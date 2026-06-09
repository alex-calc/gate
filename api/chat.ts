import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { createClient } from '@supabase/supabase-js';

// Setup Google Gen AI provider using the key from env
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
});

// Setup Supabase Client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
);

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

    // Get the last user message to generate embedding
    const lastMessage = messages[messages.length - 1];
    
    // Generate embedding for user query using Google's embedding model
    let embedding = null;
    try {
      const { embedding: emb } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: lastMessage.content,
      });
      embedding = emb;
    } catch (embError) {
      console.error('Embedding failed, continuing without context:', embError);
    }

    let documents = null;
    
    if (embedding) {
      if (embedding.length > 768) {
        embedding = embedding.slice(0, 768);
        const norm = Math.sqrt(embedding.reduce((sum: number, v: number) => sum + v*v, 0));
        embedding = embedding.map((v: number) => v / norm);
      }

      // Query Supabase for similar context
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.7, // Adjust as needed
        match_count: 5,
      });
      
      documents = data;

      if (error) {
        console.error('Supabase match error:', error);
      }
    }

    // Build the RAG Context string
    let ragContext = '';
    if (documents && documents.length > 0) {
      ragContext = documents.map((doc: any) => doc.content).join('\n\n');
    }

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
      model: google('gemini-1.5-flash'),
      messages: messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
