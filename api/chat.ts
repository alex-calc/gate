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
    const sessionId = body.sessionId || 'anonymous_session';

    // Log the user's message to Supabase
    if (supabase) {
      try {
        await supabase.from('chat_logs').insert({
          session_id: sessionId,
          role: 'user',
          content: lastMessage.content
        });
      } catch (err) {
        console.error("Error logging user message:", err);
      }
    }
    
    // Generate embedding for user query using Google's embedding model
    let embedding = null;
    try {
      console.log("Starting embed...");
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAIEmbed = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
      const embedModel = genAIEmbed.getGenerativeModel({ model: 'gemini-embedding-001' });
      
      const result = await withTimeout(embedModel.embedContent({
        content: { parts: [{ text: lastMessage.content.replace(/\n/g, ' ') }] },
        taskType: 'RETRIEVAL_QUERY'
      }), 5000, 'Embed API');
      
      embedding = result.embedding.values;
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
          const { data, error } = (await withTimeout(supabase.rpc('match_gate_knowledge', {
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

    const { 
      gateWidth, 
      gateWeight, 
      selectedEngine, 
      selectedHardware, 
      utmCampaign, 
      isNightTime 
    } = context || {};

    const systemPrompt = `Ти досвідчений інженер-консультант з продажу та підбору воріт і фурнітури для відкатних воріт. Твоя мета — проконсультувати клієнта та допомогти йому обрати комплектуючі. Будь ввічливим, лаконічним. Ніколи не придумуй ціни, яких немає в прайсі! Використовуй тільки інформацію, що надана тобі у контексті нижче. Якщо інформації немає в контексті, скажи "На жаль, я не маю точної інформації про це".

=== ОБРАНІ ПАРАМЕТРИ ВОРІТ (з калькулятора) ===
Ширина в'їзду: ${gateWidth || 'Не вказано'} м
Вага воріт (орієнтовно): ${gateWeight || 'Не вказано'} кг
Обраний мотор автоматики: ${selectedEngine || 'Не обрано'}
Обрана фурнітура (направляюча): ${selectedHardware || 'Не обрано'}

=== БАЗА ЗНАНЬ (інформація з бази) ===
${ragContext ? ragContext : "Інформація відсутня."}

=== ПРАВИЛА КРОС-ПРОДАЖІВ ТА ПЕРСОНАЛІЗАЦІЇ ===
${utmCampaign === 'furnitura' ? `Клієнт прийшов за фурнітурою. Правило крос-сейлу: у процесі розмови ти маєш обов'язково запитати, чи буде автоматика, пояснити, що під неї треба заздалегідь закласти зубчасту рейку, і запропонувати мотори Miller або Rotelli.` : ''}
${utmCampaign === 'automatika' ? `Клієнт прийшов за автоматикою. Правило крос-сейлу: ти зобов'язаний запитати, чи жива/нова фурнітура у клієнта, попередити, що на поганих роликах двигун швидко згорить від перевантаження, і запропонувати перевірений комплект фурнітури.` : ''}

ДОСТАВКА: Доставка здійснюється Новою Поштою або іншими перевізниками виключно за тарифами транспортної компанії (безкоштовної доставки немає).

=== ПРАВИЛА ЗАКРИТТЯ ЛІДА ===
Ти маєш креслення: Ти повинен чітко знати, що компанія має професійну технічну документацію: «Схему монтажу воріт та автоматики» та «Інженерне креслення каркаса на 7 метрів із таблицею порізки металу».

Правило захоплення ліда: Якщо користувач просить схему, креслення, візуалізацію, або якщо діалог доходить до логічного завершення розрахунку, ти ЗОБОВ'ЯЗАНИЙ запропонувати ці матеріали в подарунок в обмін на номер телефону.

Сценарій пропозиції: Твоя фраза повинна звучати приблизно так: «Звісно, у нас є докладні заводські інженерні схеми та карта порізки профілю під ваші ворота! Напишіть ваш номер телефону прямо сюди в чат — я закріплю за вашим номером цей розрахунок, і система миттєво відкриє вам доступ до завантаження цих PDF-файлів у високій якості».

Формат збору: Наполягай, щоб користувач просто написав свій телефон у полі чату.

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

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await chat.sendMessageStream(lastMessageText);
          let fullBotResponse = '';

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              fullBotResponse += chunkText;
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunkText)}\n`));
            }
          }

          // Log the bot's full response to Supabase
          if (supabase && fullBotResponse) {
            try {
              await supabase.from('chat_logs').insert({
                session_id: sessionId,
                role: 'model',
                content: fullBotResponse
              });
            } catch (err) {
              console.error("Error logging model message:", err);
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
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform'
      }
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
