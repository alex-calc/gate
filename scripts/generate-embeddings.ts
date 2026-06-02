import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Завантаження змінних оточення з .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) throw new Error('GOOGLE_GEMINI_API_KEY is not defined in .env');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Для запису потрібен Service Role Key!

if (!supabaseUrl || !supabaseKey) throw new Error('Supabase credentials missing. Need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');

const genAI = new GoogleGenerativeAI(apiKey);
const supabase = createClient(supabaseUrl, supabaseKey);

// Отримуємо модель для векторів
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

/**
 * Приклад масиву з даними бази знань.
 * У реальному проекті ви можете брати їх з PDF або JSON файлів.
 */
const knowledgeBase = [
  {
    content: "Фурнітура Novi Vorota (Україна) відрізняється використанням високоякісної сталі та підшипників, що забезпечують плавний хід воріт навіть взимку.",
    metadata: { source: "manual", topic: "hardware" }
  },
  {
    content: "Автоматика Edinger (Едінгер) має виключно металеві шестерні редуктора. Це запобігає їх зрізанню при морозах.",
    metadata: { source: "manual", topic: "engine_edinger" }
  },
  {
    content: "Модель Miller Technics 1000 призначена для важких воріт (до 1000 кг). Має потужний 500W двигун і сталево-латунний редуктор. Чудово підходить для воріт, зашитих ковкою або деревом.",
    metadata: { source: "manual", topic: "engine_miller" }
  }
];

async function generateEmbeddings() {
  console.log(`Починаємо генерацію векторів для ${knowledgeBase.length} записів...`);

  for (const doc of knowledgeBase) {
    try {
      // 1. Генерація вектора через Google Gemini API
      console.log(`Генерація вектора для: "${doc.content.substring(0, 30)}..."`);
      const result = await model.embedContent(doc.content);
      const embedding = result.embedding.values; // Масив чисел (768 вимірів)

      // 2. Збереження у Supabase
      const { data, error } = await supabase
        .from('knowledge_base') // Назва вашої таблиці
        .insert({
          content: doc.content,
          metadata: doc.metadata,
          embedding: embedding
        });

      if (error) {
        console.error('Помилка вставки в Supabase:', error);
      } else {
        console.log('✅ Запис успішно збережено в БД');
      }

    } catch (err) {
      console.error('Помилка обробки запису:', err);
    }
  }

  console.log('🎉 Генерація завершена!');
}

generateEmbeddings();
