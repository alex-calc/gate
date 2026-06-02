import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, generateEmbeddings } from 'ai';
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
    const { messages, context } = await req.json();

    // Limit check to prevent abuse
    if (messages.length > 20) {
      return new Response(
        JSON.stringify({ error: "Ліміт повідомлень вичерпано. Будь ласка, зателефонуйте менеджеру для подальшої консультації." }), 
        { status: 429 }
      );
    }

    // Get the last user message to generate embedding
    const lastMessage = messages[messages.length - 1];
    
    // Generate embedding for user query using Google's embedding model
    const embeddingResponse = await google.embedding('text-embedding-004').doEmbed({
      values: [lastMessage.content],
    });
    const embedding = embeddingResponse.embeddings[0];

    // Query Supabase for similar context
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.7, // Adjust as needed
      match_count: 5,
    });

    if (error) {
      console.error('Supabase match error:', error);
    }

    // Build the RAG Context string
    let ragContext = '';
    if (documents && documents.length > 0) {
      ragContext = documents.map((doc: any) => doc.content).join('\n\n');
    }

    // System prompt with context injected
    const systemPrompt = `
Ви — розумний інженер-консультант з підбору воріт та автоматики.
Ваше завдання: допомагати клієнтам обрати правильну фурнітуру та автоматику для їхніх воріт.
Відповідайте коротко, професійно та привітно. Форматуйте текст зручно (маркери, жирний шрифт).

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
