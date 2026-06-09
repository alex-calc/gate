import process from 'process';
import { streamText, embed } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

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
    const body = typeof req.json === 'function' ? await req.json() : (req as any).body;
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
        model: google.textEmbeddingModel('text-embedding-004') as any,
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

    console.log("Starting streamText...");

    // System prompt with context injected
    const systemPrompt = `Ти — привітний та експертний менеджер магазину воріт. Твоя мета — консультувати клієнтів простою і зрозумілою мовою. Ти не робот, а жива людина. Ніколи не вигадуй ціни та характеристики! Використовуй тільки ту інформацію, яку знайдеш у базі знань. Якщо інформації немає — чесно скажи, що уточниш це питання.

=== ПОТОЧНИЙ ВИБІР КЛІЄНТА (З КАЛЬКУЛЯТОРА) ===
Ширина воріт: ${context?.gateWidth || 'Не вказано'} м
Вага воріт (орієнтовно): ${context?.gateWeight || 'Не вказано'} кг
Поточний вибраний двигун: ${context?.selectedEngine || 'Не вибрано'}
Поточна вибрана фурнітура: ${context?.selectedHardware || 'Не вибрано'}

=== БАЗА ЗНАНЬ (ДОВІДКОВА ІНФОРМАЦІЯ З БАЗИ) ===
${ragContext ? ragContext : "Інформація не знайдена."}

Якщо питання стосується технічних характеристик, використовуйте БАЗУ ЗНАНЬ.
Якщо клієнт запитує "чи підійде мені цей двигун?", порівняйте максимальну вагу двигуна з "Поточним вибором клієнта".
`;

    // Stream response using Vercel AI SDK
    const result = await streamText({
      model: google('gemini-1.5-flash') as any,
      messages: messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
