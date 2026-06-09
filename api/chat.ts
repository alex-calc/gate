import { streamText, embed } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Edge runtime config for Vercel (allows Web Request/Response and streaming)
export const config = {
  runtime: 'edge',
};

// Setup Google Gen AI provider using the key from env
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
});

// Setup Supabase Client
let supabase: any = null;
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export const maxDuration = 30; // Max execution time for vercel function

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("Входящий body:", body);
    
    let { messages, context } = body || {};
    
    // Fallback: if messages is undefined, but the body itself is a message object
    if (!messages) {
      if (body.role && body.content) {
        messages = [body];
      } else {
        messages = [];
      }
    }

    // Limit check to prevent abuse
    if (messages.length > 20) {
      return new Response(
        JSON.stringify({ error: "Ліміт повідомлень вичерпано. Будь ласка, зателефонуйте менеджеру для подальшої консультації." }), 
        { status: 429 }
      );
    }

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Немає повідомлень для обробки" }), { status: 400 });
    }

    // Helper to prevent infinite hangs
    const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms))
      ]);
    };

    // Get the last user message to generate embedding
    const lastMessage = messages[messages.length - 1];
    
    // Generate embedding for user query using Google's embedding model
    let embedding = null;
    try {
      console.log("Starting embed...");
      const { embedding: emb } = await withTimeout(embed({
        model: google.textEmbeddingModel('gemini-embedding-2') as any,
        value: lastMessage.content,
      }), 5000, 'Embed API');
      embedding = emb;
      console.log("Embed successful.");
    } catch (embError: any) {
      console.error('Embedding failed or timed out:', embError.message);
    }

    let documents = null;
    
    if (embedding) {
      if (embedding.length > 768) {
        embedding = embedding.slice(0, 768);
        const norm = Math.sqrt(embedding.reduce((sum: number, v: number) => sum + v*v, 0));
        embedding = embedding.map((v: number) => v / norm);
      }

      // Query Supabase for similar context
      if (supabase) {
        try {
          console.log("Starting supabase query...");
          const { data, error } = (await withTimeout(supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.7, // Adjust as needed
            match_count: 5,
          }), 5000, 'Supabase RPC')) as any;
          
          documents = data;

          if (error) {
            console.error('Supabase match error:', error);
          } else {
            console.log("Supabase query successful.");
          }
        } catch (supaError: any) {
          console.error('Supabase query failed or timed out:', supaError.message);
        }
      } else {
        console.warn('Supabase not configured, skipping context retrieval.');
      }
    }

    // Build the RAG Context string
    let ragContext = '';
    if (documents && documents.length > 0) {
      ragContext = documents.map((doc: any) => doc.content).join('\n\n');
    }

    console.log("Starting manual Google SDK stream...");

    // System prompt with context injected
    const systemPrompt = `Ти досвідчений інженер-консультант з продажу та підбору воріт і фурнітури для відкатних воріт. Твоя мета — проконсультувати клієнта та допомогти йому обрати комплектуючі. Будь ввічливим, лаконічним. Ніколи не придумуй ціни, яких немає в прайсі! Використовуй тільки інформацію, що надана тобі у контексті нижче. Якщо інформації немає в контексті, скажи "На жаль, я не маю точної інформації про це".

=== ОБРАНІ ПАРАМЕТРИ ВОРІТ (з калькулятора) ===
Ширина в'їзду: ${context?.gateWidth || 'Не вказано'} м
Вага воріт (орієнтовно): ${context?.gateWeight || 'Не вказано'} кг
Обраний мотор автоматики: ${context?.selectedEngine || 'Не обрано'}
Обрана фурнітура (направляюча): ${context?.selectedHardware || 'Не обрано'}

=== БАЗА ЗНАНЬ (інформація з бази) ===
${ragContext ? ragContext : "Інформація відсутня."}

Ти маєш відповідати виключно українською мовою.
Якщо користувач питає "Що порадиш вибрати?", порадь найкраще для його обраних параметрів.
`;

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const lastMessageText = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessageText);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunkText)}\n`));
            }
          }
          controller.close();
        } catch (e: any) {
          const errorMessage = e.message || '';
          if (errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('high demand')) {
            const friendlyError = "\n\n*(Сервери Google зараз перевантажені через високий попит. Будь ласка, зачекайте кілька секунд і спробуйте ще раз)*";
            controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(friendlyError)}\n`));
          } else {
            controller.enqueue(new TextEncoder().encode(`3:${JSON.stringify(errorMessage)}\n`));
          }
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
