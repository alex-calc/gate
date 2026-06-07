// ============================================================
// seed-gate-knowledge-gemini.mjs
// Наповнює базу знань через Google Gemini text-embedding-004
// ============================================================

import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const embeddingModel = genAI.getGenerativeModel({
  model: 'gemini-embedding-001'
})

// ============================================================
// 📚 БАЗА ЗНАНЬ (АКТУАЛЬНІ ДАНІ 2026)
// ============================================================

const KNOWLEDGE_BASE = [
  // ----------------------------------------------------------
  // 🔧 КАТАЛОГ: АВТОМАТИКА
  // ----------------------------------------------------------
  {
    category: 'catalog',
    title: 'Edinger S8 (з Wi-Fi) — характеристики і ціна',
    content: `Edinger S8 (вбудований Wi-Fi) — хіт продажу.
Максимальна вага воріт: до 800 кг.
Особливості: керування зі смартфона, сталевий посилений редуктор.
Гарантія: 5 років від виробника.
Ціна: 9 861 грн.
Підходить для: побутових воріт 4-5 метрів, зашитих профнастилом або деревом.`,
    metadata: { brand: 'edinger', type: 'engine', max_weight: 800, price: 9861 }
  },
  {
    category: 'catalog',
    title: 'Edinger I10 (з Wi-Fi) — характеристики і ціна',
    content: `Edinger I10 (вбудований Wi-Fi) — вибір покупців для важких воріт.
Максимальна вага воріт: до 1000 кг.
Особливості: керування зі смартфона, потужний двигун, металевий редуктор.
Гарантія: 5 років від виробника.
Ціна: 10 380 грн.
Підходить для: важких побутових воріт, широких прорізів.`,
    metadata: { brand: 'edinger', type: 'engine', max_weight: 1000, price: 10380 }
  },
  {
    category: 'catalog',
    title: 'Miller Technics 800 — характеристики і ціна',
    content: `Miller Technics 800 — вибір експертів.
Максимальна вага воріт: до 800 кг.
Особливості: латунний редуктор (найнадійніший матеріал, не боїться морозів), потрійний ресурс порівняно зі сталлю.
Гарантія: 5 років від виробника.
Ціна: 14 999 грн.
Підходить для: клієнтів, які хочуть надійність на 10+ років без сервісу.`,
    metadata: { brand: 'miller', type: 'engine', max_weight: 800, price: 14999 }
  },
  {
    category: 'catalog',
    title: 'Rotelli Premium 1100 (з Wi-Fi) — характеристики і ціна',
    content: `Rotelli Premium 1100 (вбудований Wi-Fi) — преміум автоматика з Італії.
Максимальна вага воріт: до 1100 кг.
Особливості: керування зі смартфона, потужний промисловий двигун, сталевий редуктор.
Гарантія: 5 років від виробника.
Ціна: 14 480 грн.
Підходить для: важких кованих воріт, інтенсивного використання.`,
    metadata: { brand: 'rotelli', type: 'engine', max_weight: 1100, price: 14480 }
  },
  {
    category: 'catalog',
    title: 'Rotelli PRO 2000 (з Wi-Fi) — характеристики і ціна',
    content: `Rotelli PRO 2000 (вбудований Wi-Fi) — надпотужний промисловий привід.
Максимальна вага воріт: до 2000 кг.
Особливості: масляна ванна (двигун охолоджується маслом, витримує надвисокі навантаження без перегріву), керування зі смартфона.
Гарантія: 5 років.
Ціна: 25 220 грн.
Підходить для: підприємств, заводів, багатоквартирних будинків, надважких воріт.`,
    metadata: { brand: 'rotelli', type: 'engine', max_weight: 2000, price: 25220 }
  },

  // ----------------------------------------------------------
  // 🔧 КАТАЛОГ: ФУРНІТУРА І ДОПИ
  // ----------------------------------------------------------
  {
    category: 'catalog',
    title: 'Novi Vorota Standart 3.6 мм — фурнітура',
    content: `Novi Vorota Standart 3.6 мм — комплект фурнітури для легких воріт.
Максимальне навантаження: до 500 кг.
Товщина направляючої: 3.6 мм.
Підшипник: посилений 301.
Гарантія: 5 років.
Ціна: 4 225 грн.
Підходить для: легких воріт з профнастилу.`,
    metadata: { brand: 'novi_vorota', type: 'hardware', max_weight: 500, price: 4225 }
  },
  {
    category: 'catalog',
    title: 'Novi Vorota Gospodar 4.0 мм — фурнітура',
    content: `Novi Vorota Gospodar 4.0 мм — посилений комплект фурнітури.
Максимальне навантаження: до 500 кг.
Товщина направляючої: 4.0 мм (більша довговічність і жорсткість).
Підшипник: посилений 301.
Гарантія: 5 років.
Ціна: 4 725 грн.
Підходить для: воріт з деревом або сендвіч-панеллю.`,
    metadata: { brand: 'novi_vorota', type: 'hardware', max_weight: 500, price: 4725 }
  },
  {
    category: 'catalog',
    title: 'Novi Vorota Fayna 5.0 мм — фурнітура 800 кг',
    content: `Novi Vorota Fayna 5.0 мм — фурнітура для важких воріт.
Максимальне навантаження: до 800 кг.
Товщина направляючої: 5.0 мм (обов'язково для кованих або дуже важких воріт).
Гарантія: 5 років.
Ціна: 8 957 грн.
Підходить для: кованих воріт, широких прорізів 5-7 метрів.`,
    metadata: { brand: 'novi_vorota', type: 'hardware', max_weight: 800, price: 8957 }
  },
  {
    category: 'catalog',
    title: 'Зубчаста рейка, безпека та аксесуари',
    content: `Аксесуари для автоматики:
1. Зубчаста рейка (оцинкована, 8 мм) — 300 грн за 1 метр. (Формула: ширина прорізу + 1 метр).
2. Комплект безпеки (фотоелементи + сигнальна лампа) — 1 500 грн. Захищає авто та людей від удару воротами.
3. GSM модуль (відкриття воріт дзвінком з телефону) — 600 грн.
4. Кронштейн для монтажу без зварювання — 250 грн.`,
    metadata: { type: 'addon' }
  },

  // ----------------------------------------------------------
  // 🚚 ОПЛАТА, ДОСТАВКА ТА МОНТАЖ
  // ----------------------------------------------------------
  {
    category: 'faq',
    title: 'Як працює доставка і оплата?',
    content: `Доставка: відправляємо компаніями Нова Пошта, Делівері або САТ по всій Україні. (Укрпоштою не відправляємо). Самовивозу немає.
Оплата (Безпечна угода): 
Ви можете замовити товар без попередньої оплати! Ми відправляємо посилку з блокуванням. Ви приходите на пошту, оглядаєте товар, переконуєтесь у його високій якості, після чого переказуєте кошти на наш рахунок. Ми одразу розблоковуємо посилку, і ви її забираєте.
Також можлива звичайна передоплата на рахунок ФОП.`,
    metadata: { topic: 'delivery_payment' }
  },
  {
    category: 'faq',
    title: 'Чи робите ви монтаж і чи даєте контакти майстрів?',
    content: `Ми є спеціалізованим магазином з продажу якісної автоматики та фурнітури. 
Монтаж ми не виконуємо і контакти сторонніх майстрів не надаємо. 
Проте, наша автоматика розроблена так, що її легко встановити самостійно — в комплекті йде детальна інструкція, а налаштування зведені до мінімуму. Зазвичай клієнти встановлюють її самі або наймають місцевих зварювальників/будівельників.`,
    metadata: { topic: 'installation_service' }
  },
  {
    category: 'faq',
    title: 'Яка гарантія на товари?',
    content: `Ми впевнені в якості нашого товару, тому надаємо:
- 5 років офіційної гарантії на ВСЮ автоматику (Edinger, Miller Technics, Rotelli).
- 5 років гарантії на ВСЮ фурнітуру (Novi Vorota).
Всі приводи мають надійні металеві редуктори (сталь або латунь), ніякого пластику. Моделі для промисловості (Rotelli PRO 2000) мають масляну ванну для вічної роботи.`,
    metadata: { topic: 'warranty' }
  },

  // ----------------------------------------------------------
  // 📐 СУМІСНІСТЬ
  // ----------------------------------------------------------
  {
    category: 'compatibility',
    title: 'Скільки коштує мінімальний комплект?',
    content: `Для легких воріт з профнастилу (до 4 метрів ширини):
- Фурнітура Standart 3.6 мм: 4 225 грн
- Автоматика Edinger S8 (з Wi-Fi): 9 861 грн
- Зубчаста рейка (5 метрів): 1 500 грн
Разом орієнтовно: 15 586 грн.
Це ідеальний базовий набір з гарантією 5 років на все!`,
    metadata: { weight_range: '0-500' }
  },
  {
    category: 'compatibility',
    title: 'Комплект для важких кованих воріт',
    content: `Для важких кованих воріт (понад 600 кг) потрібен посилений комплект:
- Фурнітура Fayna 5.0 мм (до 800 кг): 8 957 грн.
- Автоматика Miller Technics 800 (латунь) або Rotelli Premium 1100.
Тонший рельс НЕ підходить — важкі ворота його деформують.`,
    metadata: { weight_range: '600-1000' }
  }
]

async function generateEmbedding(text) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text: text.replace(/\n/g, ' ') }] },
    taskType: 'RETRIEVAL_DOCUMENT'
  })
  let vals = result.embedding.values
  if (vals.length > 768) {
    vals = vals.slice(0, 768)
    const norm = Math.sqrt(vals.reduce((sum, v) => sum + v*v, 0))
    vals = vals.map(v => v / norm)
  }
  return vals
}

async function seedKnowledge() {
  console.log('\n🚀 Починаємо наповнення бази знань (ОНОВЛЕНІ ДАНІ)...')

  let success = 0
  let failed = 0
  let skipped = 0

  for (let i = 0; i < KNOWLEDGE_BASE.length; i++) {
    const item = KNOWLEDGE_BASE[i]
    
    // Щоб оновити базу, ми СПОЧАТКУ ВИДАЛЯЄМО старий запис з таким же title
    await supabase.from('knowledge_base').delete().eq('title', item.title)

    try {
      process.stdout.write(`[${i + 1}/${KNOWLEDGE_BASE.length}] ⚙️  "${item.title}"... `)
      const textToEmbed = `${item.title}\n\n${item.content}`
      const embedding = await generateEmbedding(textToEmbed)

      const { error } = await supabase.from('knowledge_base').insert({
        title: item.title,
        content: item.content,
        category: item.category,
        metadata: item.metadata || {},
        embedding,
      })

      if (error) {
        console.log(`❌ ${error.message}`)
        failed++
      } else {
        console.log(`✅`)
        success++
      }
      await new Promise(r => setTimeout(r, 600))
    } catch (err) {
      console.log(`❌ ${err.message}`)
      failed++
      await new Promise(r => setTimeout(r, 2000))
    }
  }
  console.log('\n🎉 Готово! Оновлено записів: ' + success)
}

seedKnowledge()
