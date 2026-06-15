import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AuroraBackground } from './components/ui/aurora-background';
import { MagicCard } from './components/ui/magic-card';
import { ShimmerButton } from './components/ui/shimmer-button';
import {
  ShieldCheck, Wrench, Cpu, Sparkles, Phone,
  CheckCircle2, ChevronRight, Info, ArrowRight,
  Clock, Truck, Video, Star, Award, Zap, Timer, Camera, Gift
} from 'lucide-react';
import { AIChatWidget } from './components/AIChatWidget';

// ============================================================
// 📦 БАЗА ДАННЫХ — каталог без изменений
// ============================================================

const ENGINES_CATALOG = [
  {
    id: 'edinger-s8',
    name: 'Edinger S8 (вбудований Wi-Fi)',
    tag: 'ХІТ ПРОДАЖУ',
    description: 'Оптимальний вибір для побутових воріт до 5 метрів. Сталевий редуктор та вбудований Wi-Fi.',
    specs: ['400W', 'Метал', 'до 800 кг'],
    basePrice: 9861,
    maxWeight: 800,
    minWeight: 0
  },
  {
    id: 'edinger-i10',
    name: 'Edinger I10 (вбудований Wi-Fi)',
    tag: 'ВИБІР ПОКУПЦІВ',
    description: 'Потужний двигун для важких воріт. Металевий редуктор та вбудований Wi-Fi.',
    specs: ['500W', 'Метал', 'до 1000 кг'],
    basePrice: 10380,
    maxWeight: 1000,
    minWeight: 0
  },
  {
    id: 'miller-800',
    name: 'Miller Technics 800',
    tag: 'ВИБІР ЕКСПЕРТІВ',
    description: 'Преміум-клас. Надійний двигун з масивним металевим редуктором для важких умов.',
    specs: ['400W', 'Латунь/Сталь', 'до 800 кг'],
    basePrice: 14999,
    maxWeight: 800,
    minWeight: 0
  },
  {
    id: 'miller-1000',
    name: 'Miller Technics 1000 (Невбиваємий Трактор)',
    tag: 'ТЯЖКОВИК',
    description: 'Супер-потужний двигун із запасом міцності та 10 роками гарантії на редуктор!',
    specs: ['500W', 'Сталь/Латунь', 'до 1000 кг'],
    basePrice: 16037,
    maxWeight: 1000,
    minWeight: 800
  },
  {
    id: 'rotelli-1100',
    name: 'Rotelli Premium 1100 (вбудований Wi-Fi)',
    tag: 'ПРЕМІУМ (ІТАЛІЯ)',
    description: 'Промисловий запас міцності та вбудоване керування з телефона в комплекті.',
    specs: ['500W', 'Сталь', 'до 1100 кг'],
    basePrice: 14480,
    maxWeight: 1100,
    minWeight: 0
  },
  {
    id: 'rotelli-pro',
    name: 'Rotelli PRO 2000 (Масляна ванна)',
    tag: 'ПРОМИСЛОВИЙ',
    description: 'Промисловий привід у рідкій масляній ванні для безперервної роботи 24/7',
    specs: ['1000W', 'Сталь/Масло', 'до 2000 кг'],
    basePrice: 19500,
    maxWeight: 2000,
    minWeight: 800
  },
  {
    id: 'no-engine',
    name: 'Автоматика не потрібна (тільки фурнітура)',
    tag: '',
    description: 'Я планую відкривати ворота вручну',
    specs: ['-', '-', '-'],
    basePrice: 0,
    maxWeight: 9999,
    minWeight: 0
  }
];

const HARDWARE_CATALOG = [
  { id: 'standart-3.6', name: 'Novi Vorota Standart (3.6 мм)', maxWeight: 500, thickness: '3.6 мм', price: 3925, desc: 'Для легких воріт з профнастилу.' },
  { id: 'gospodar-4.0', name: 'Novi Vorota Gospodar (4.0 мм)', maxWeight: 500, thickness: '4.0 мм', price: 4525, desc: 'Посилений направляючий рельс для довговічності.' },
  { id: 'fayna-5.0', name: 'Novi Vorota Fayna (5.0 мм)', maxWeight: 1000, thickness: '5.0 мм', price: 8757, desc: 'Для важких кованих або широких воріт.' },
  { id: 'no-hardware', name: 'Фурнітура не потрібна (тільки автоматика)', maxWeight: 9999, thickness: '-', price: 0, desc: 'Я вже маю фурнітуру' }
];

// ============================================================
// 🧩 ДОПОМІЖНІ КОМПОНЕНТИ
// ============================================================

function GateVisualizer({ width, weight }: { width: number, weight: number }) {
  // Пропорційне відображення ширини (від 3м до 5.5м)
  const widthPercent = (width / 5.5) * 100;
  
  let textureClass = "bg-blue-300"; 
  let borderClass = "border-blue-400";
  let pattern = null;

  if (weight === 500) {
    textureClass = "bg-amber-700/80"; 
    borderClass = "border-amber-900";
    pattern = (
      <div className="absolute inset-0 opacity-20 flex flex-col justify-evenly">
        <div className="h-px bg-black w-full" />
        <div className="h-px bg-black w-full" />
        <div className="h-px bg-black w-full" />
        <div className="h-px bg-black w-full" />
      </div>
    );
  } else if (weight >= 800) {
    textureClass = "bg-slate-800"; 
    borderClass = "border-slate-950";
    pattern = (
      <div className="absolute inset-0 opacity-40 flex justify-evenly">
        <div className="w-1 h-full bg-slate-900" />
        <div className="w-1 h-full bg-slate-900" />
        <div className="w-1 h-full bg-slate-900" />
        <div className="w-1 h-full bg-slate-900" />
        <div className="w-1 h-full bg-slate-900" />
      </div>
    );
  } else {
    pattern = (
      <div className="absolute inset-0 opacity-10 flex justify-evenly">
        <div className="w-0.5 h-full bg-black" />
        <div className="w-0.5 h-full bg-black" />
        <div className="w-0.5 h-full bg-black" />
        <div className="w-0.5 h-full bg-black" />
        <div className="w-0.5 h-full bg-black" />
        <div className="w-0.5 h-full bg-black" />
        <div className="w-0.5 h-full bg-black" />
      </div>
    );
  }

  return (
    <div className="w-full h-32 bg-slate-100 rounded-xl border border-slate-200 flex flex-col justify-end p-4 relative overflow-hidden mb-8 shadow-inner">
      <div className="absolute bottom-0 left-0 w-full h-6 bg-slate-200 border-t border-slate-300"></div>
      <div className="absolute bottom-0 left-4 sm:left-8 w-6 h-28 bg-slate-300 border border-slate-400 rounded-t-sm z-10 flex flex-col items-center">
         <div className="w-8 h-2 bg-slate-400 rounded-sm -mt-1 shadow-sm"></div>
         <div className="mt-2 w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
      </div>
      <div className="absolute bottom-0 right-4 sm:right-8 w-6 h-28 bg-slate-300 border border-slate-400 rounded-t-sm z-10 flex flex-col items-center">
         <div className="w-8 h-2 bg-slate-400 rounded-sm -mt-1 shadow-sm"></div>
      </div>
      <div className="absolute bottom-6 left-10 sm:left-14 h-20 transition-all duration-500 ease-out z-0 flex" style={{ width: `${widthPercent}%`, maxWidth: 'calc(100% - 4rem)' }}>
        <div className={`w-full h-full ${textureClass} ${borderClass} border-2 rounded-sm relative overflow-hidden transition-colors duration-500 shadow-sm`}>
          {pattern}
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  const items = [
    { icon: <Award className="w-4 h-4 text-blue-400" />, text: '12 років на ринку' },
    { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: '3 000+ комплектів' },
    { icon: <ShieldCheck className="w-4 h-4 text-sky-400" />, text: 'Гарантія до 5 років' },
    { icon: <Truck className="w-4 h-4 text-violet-400" />, text: 'Доставка по всій Україні' },
  ];
  return (
    <div className="border-y border-slate-800 bg-slate-900 py-3">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-300">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuaranteeBlock() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-4">
      <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white text-center mb-12">
        Гарантія, доставка та офіційні бренди
      </h2>
      <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 items-start">

        {/* Гарантія */}
        <MagicCard>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 hover:rotate-6">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-3 text-lg">365 днів тест-драйву</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
            На моделі Rotelli та Miller Technics — повернення протягом року, навіть якщо привід вже встановлено на воротах.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">Edinger — 12 міс</span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">Miller & Rotelli — 24 міс</span>
          </div>
        </MagicCard>

        {/* Доставка */}
        <MagicCard className="sm:mt-12">
          <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 hover:-rotate-6">
            <Truck className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-3 text-lg">Швидка доставка</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
            Відправка зі складу в день замовлення. Нова Пошта, Делівері або САТ. По всій Україні — без доплат за регіон.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">1-3 дні</span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">Нова Пошта</span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">Делівері</span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">САТ</span>
          </div>
        </MagicCard>

        {/* Бренди */}
        <MagicCard>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 hover:rotate-12">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-3 text-lg">Офіційні бренди</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
            Офіційний дистриб'ютор Edinger, Miller Technics та Rotelli в Україні. Жодного контрафакту — тільки заводська упаковка.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {['Edinger', 'Miller Technics', 'Rotelli'].map(b => (
              <span key={b} className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                {b}
              </span>
            ))}
          </div>
        </MagicCard>
      </div>
    </section>
  );
}

function YoutubeBlock() {
  return (
    <section className="py-24 border-t border-slate-200 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Video className="w-3.5 h-3.5" /> Відео-інструкції
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">Монтаж відкатних воріт своїми руками</h2>
          <p className="text-sm text-slate-600 mt-2">Покрокові відео від наших інженерів — від фундаменту до першого відкриття</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { title: 'Встановлення фурнітури Novi Vorota', duration: '12:34', views: '48K' },
            { title: 'Підключення автоматики Edinger S8', duration: '08:21', views: '31K' },
          ].map((video, i) => (
            <div key={i} className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
              <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center relative">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1" />
                </div>
                <div className="absolute bottom-2 right-3 text-xs text-white font-mono bg-black/60 px-1.5 py-0.5 rounded">{video.duration}</div>
              </div>
              <div className="p-4 bg-white">
                <div className="text-sm font-bold text-slate-900">{video.title}</div>
                <div className="text-xs text-slate-500 mt-1">{video.views} переглядів</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-5 font-medium">
          Більше відео на каналі <span className="text-blue-600">@vorotasvoimirukami</span>
        </p>
      </div>
    </section>
  );
}

function ReviewsBlock() {
  return (
    <section className="py-24 border-t border-slate-200 bg-white relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 text-center mb-10">
          Реальні відгуки клієнтів
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-2 sm:p-3 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="w-full aspect-[9/16] bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-300 transition-colors">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 mb-2 opacity-50" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-center px-2">Скріншот {i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiPromoBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="relative bg-blue-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-blue-600/10" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center shrink-0 border border-blue-700">
            <Sparkles className="w-7 h-7 text-blue-300 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-mono text-blue-300 uppercase tracking-wider mb-1 font-bold">AI-консультант онлайн</div>
            <h3 className="text-base sm:text-lg font-display font-extrabold text-white leading-tight">
              Не знаєш що вибрати?
            </h3>
            <p className="text-sm text-blue-100 mt-0.5">
              Запитай нашого AI-інженера — він знає всі ціни та підбере оптимальний комплект за 30 секунд.
            </p>
          </div>
        </div>
        <button
          onClick={onOpen}
          className="relative shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <span>💬 Потрібна допомога? AI підбере комплект за 1 хвилину</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 🚀 ГОЛОВНИЙ КОМПОНЕНТ
// ============================================================

export default function App() {
  // --- Стани калькулятора (без змін) ---
  const [step, setStep] = useState(1);
  const [gateWidth, setGateWidth] = useState(4);
  const [gateWeight, setGateWeight] = useState(400);
  const [selectedHardware, setSelectedHardware] = useState(HARDWARE_CATALOG[0].id);
  const [selectedEngine, setSelectedEngine] = useState('no-engine');
  const [includeWifi, setIncludeWifi] = useState(false);
  const [includeSafety, setIncludeSafety] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Скрол нагору при зміні кроку ---
  const handleStepChange = (newStep: number) => {
    const el = document.getElementById('calculator-top');
    if (el) {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        // На десктопі миттєво підтягуємо скрол до початку калькулятора ТІЛЬКИ ЯКЩО користувач проскролив нижче
        const rect = el.getBoundingClientRect();
        if (rect.top < 0) {
          window.scrollTo({ top: window.scrollY + rect.top - 20, behavior: 'instant' as ScrollBehavior });
        }
      } else {
        // На мобільному плавно скролимо
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setStep(newStep);
  };

  // --- Lenis Smooth Scroll ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // --- AI Чат ---
  const [chatOpen, setChatOpen] = useState(false);

  // --- FOMO Соціальний доказ ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const messages = [
      "Олексій (Київ) щойно замовив Edinger S8",
      "Цю сторінку зараз переглядають 4 людини",
      "Залишилось 2 комплекти Rotelli по старій ціні",
      "Іван (Львів) додав Miller Technics у кошик",
      "Остання покупка: 14 хвилин тому"
    ];
    const showRandomToast = () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 5000);
      setTimeout(showRandomToast, 15000 + Math.random() * 15000);
    };
    const initialTimer = setTimeout(showRandomToast, 10000);
    return () => clearTimeout(initialTimer);
  }, []);

  // --- Нова логіка фурнітури ---
  const getGuideRailLength = (width: number) => {
    return Math.ceil(width * 1.5);
  };

  const guideRailLength = getGuideRailLength(gateWidth);

  const getHardwarePrice = (id: string, railLength: number) => {
    if (id === 'standart-3.6') {
      if (railLength === 5) return 3450;
      if (railLength === 6) return 3600;
      return 3950;
    }
    if (id === 'gospodar-4.0') {
      if (railLength === 5) return 4625;
      if (railLength === 6) return 4925;
      return 5325;
    }
    if (id === 'fayna-5.0') {
      if (railLength <= 6) return 8857;
      return 9807;
    }
    return 0;
  };

  const hardwarePrice = getHardwarePrice(selectedHardware, guideRailLength);

  // --- Розрахунок вартості (оновлено) ---
  const currentHardware = HARDWARE_CATALOG.find(h => h.id === selectedHardware) || HARDWARE_CATALOG[0];
  const currentEngine = ENGINES_CATALOG.find(e => e.id === selectedEngine) || ENGINES_CATALOG[0];
  
  const isNoHardware = currentHardware.id === 'no-hardware';
  const isNoEngine = currentEngine.id === 'no-engine';

  const toothRackLength = gateWidth + 1;
  const toothRackPrice = isNoEngine ? 0 : toothRackLength * 350;
  
  const hasBuiltInWifi = currentEngine.id.includes('edinger') || currentEngine.id === 'rotelli-1100';
  const wifiPrice = (includeWifi && !hasBuiltInWifi && !isNoEngine) ? 1500 : 0;
  const safetyPrice = (includeSafety && !isNoEngine) ? 1500 : 0;
  const totalPrice = hardwarePrice + currentEngine.basePrice + toothRackPrice + wifiPrice + safetyPrice;
  const retailPrice = Math.round(totalPrice * 1.15);
  const totalSavings = retailPrice - totalPrice;

  // --- Фільтрація по вазі (матриця сумісності) ---
  const compatibleEngines = ENGINES_CATALOG.filter(e => e.maxWeight >= gateWeight && (e.minWeight ? gateWeight >= e.minWeight : true));
  const compatibleHardware = HARDWARE_CATALOG.filter(h => h.maxWeight >= gateWeight);

  // --- Розумна маска телефону ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    
    // Обробка вставленого номера з префіксом (наприклад, +380 або 380)
    if (input.startsWith('380')) {
      input = input.substring(3);
    } else if (input.startsWith('80')) {
      input = input.substring(2);
    }
    
    // Якщо номер починається з 0 (наприклад, 097...), прибираємо його
    if (input.startsWith('0')) {
      input = input.substring(1);
    }

    if (input.length <= 9) {
      setPhoneNumber(input);
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 9) return alert('Будь ласка, введіть коректний номер телефону');
    
    // Telegram Integration
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID';

    const selectedWeightCategory = gateWeight === 300 ? 'Легкі (Профнастил, сітка)' : gateWeight === 500 ? 'Середні (Дерево, метал)' : 'Важкі (Ковка, фільонка)';
    const wifiStatus = hasBuiltInWifi && !isNoEngine ? 'Вбудований (0 ₴)' : includeWifi && !isNoEngine ? 'Так (1500 ₴)' : 'Ні';
    const safetyStatus = includeSafety && !isNoEngine ? 'Так (1500 ₴)' : 'Ні';
    
    const text = `🚀 НОВИЙ ЛІД З КАЛЬКУЛЯТОРА ВОРІТ
👤 Ім'я: ${clientName || 'Не вказано'}
📞 Телефон: +380${phoneNumber}
---
📐 Параметри воріт:
- Ширина: ${gateWidth} м
- Вага/Матеріал: ${selectedWeightCategory}
---
📦 Комплектація:
- Фурнітура: ${currentHardware.name} (${hardwarePrice} ₴)
- Автоматика: ${currentEngine.name} (${currentEngine.basePrice} ₴)
- Зубчаста рейка: ${toothRackLength} м (${toothRackPrice} ₴)
- Доп. модулі: Wi-Fi (${wifiStatus}), Безпека (${safetyStatus})
---
💰 РАЗОМ (Наша ціна): ${totalPrice} ₴
🏪 Роздрібна ціна: ${retailPrice} ₴`;

    try {
      if (botToken !== 'YOUR_TELEGRAM_BOT_TOKEN') {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text })
        });
      } else {
        console.log("Mock Telegram Send:\n", text);
      }
    } catch (error) {
      console.error('Telegram error', error);
    }

    setIsSubmitted(true);
  };


  const scrollToCheckout = () => {
    document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden w-full">
      {/* ====== HEADER & HERO (Тёмный фон) ====== */}
      <AuroraBackground className="pt-32 pb-24 sm:pt-40 sm:pb-32 min-h-[90vh]">
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              GATE-PRO <span className="text-blue-400 text-[10px] font-mono px-1 py-0.5 rounded border border-blue-500/30 ml-1">AI INSIDE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Пн–Пт 9:00–17:00</span>
            <span className="text-slate-700">|</span>
            <span>Сб 10:00–17:00</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              Отримати креслення
            </button>
            <a href="tel:+380958769000" className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">+38 (095) 876-9000</span>
              <span className="sm:hidden">Дзвінок</span>
            </a>
          </div>
        </div>
      </header>

      {/* ====== ТЕМНИЙ HERO ====== */}
      <section className="relative pt-20 lg:pt-32">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Розумний підбір комплектуючих без націнок посередників
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Зберіть ідеальні відкатні ворота <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              за 30 секунд без дзвінків
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            AI-конфігуратор розрахує вартість рельса, підбере привід з металевим редуктором та сформує чесну ціну.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-5 py-3 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> 5 років офіційної гарантії
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-5 py-3 rounded-2xl">
              <Wrench className="w-5 h-5 text-emerald-500" /> Креслення для монтажу у подарунок
            </div>
          </div>
        </div>
      </section>
      </AuroraBackground>

      {/* ====== TRUST BAR ====== */}
      <TrustBar />

      {/* ====== AI ПРОМО БАНЕР ====== */}
      <AiPromoBanner onOpen={() => setChatOpen(true)} />

      {/* ====== СВІТЛИЙ КАЛЬКУЛЯТОР ====== */}
      <section className="pb-24 max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ліва колонка: кроки (Світла карточка) */}
          <div id="calculator-top" className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">

            {/* Steps Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-10 text-xs font-mono text-slate-400">
              <span className={step === 1 ? 'text-blue-600 font-bold' : ''}>1. ПАРАМЕТРИ</span>
              <ChevronRight className="w-4 h-4" />
              <span className={step === 2 ? 'text-blue-600 font-bold' : ''}>2. ФУРНІТУРА</span>
              <ChevronRight className="w-4 h-4" />
              <span className={step === 3 ? 'text-blue-600 font-bold' : ''}>3. ДВИГУН</span>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-10 animate-fadeIn">
                <div>
                  <GateVisualizer width={gateWidth} weight={gateWeight} />
                  <label className="flex justify-between items-end mb-3 text-slate-600">
                    <span className="text-sm font-bold mb-1">Ширина в'їзду (метрів):</span>
                    <span className="text-blue-600 font-mono font-bold text-3xl leading-none">{gateWidth} <span className="text-lg">м</span></span>
                  </label>
                  <input type="range" min="3" max="5.5" step="0.5" value={gateWidth}
                    aria-label="Ширина в'їзду в метрах"
                    onChange={(e) => setGateWidth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium"><span>3 м</span><span>4 м</span><span>5.5 м</span></div>
                  <div className="mt-4 text-sm text-blue-800 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Фурнітура комплектується направляючим рельсом довжиною <strong className="font-mono">{guideRailLength} метрів</strong>.</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-600 mb-3">Орієнтовна вага воріт (матеріал):</h4>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { weight: 300, name: 'Легкі', sub: 'Профнастил, сітка' },
                      { weight: 500, name: 'Середні', sub: 'Дерево, метал' },
                      { weight: 1000, name: 'Важкі', sub: 'Ковка, фільонка' },
                    ].map(card => (
                      <div key={card.weight} 
                        onClick={() => setGateWeight(card.weight)}
                        className={`border rounded-xl p-3 cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                          gateWeight === card.weight 
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">{card.name}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{card.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <ShimmerButton onClick={() => handleStepChange(2)} className="w-full bg-blue-600 hover:bg-blue-700 py-4 px-4 shadow-md mt-6">
                  <span>Далі до вибору фурнітури</span>
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
                </ShimmerButton>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-display font-extrabold text-slate-900">Виберіть комплект фурнітури:</h3>
                {gateWeight > 500 && (
                  <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2 font-medium">
                    <Zap className="w-4 h-4 shrink-0 text-amber-600" />
                    Для воріт {gateWeight} кг доступна тільки важка серія рельсів (5.0 мм).
                  </div>
                )}
                <div className="grid gap-3">
                  {compatibleHardware.map((hw) => (
                    <div key={hw.id} onClick={() => setSelectedHardware(hw.id)}
                      className={`border p-4 rounded-xl cursor-pointer transition-all ${
                        selectedHardware === hw.id
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                      }`}>
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <h4 className="font-bold text-slate-900 text-base">{hw.name}</h4>
                        <span className="font-mono text-blue-600 font-bold text-base shrink-0 whitespace-nowrap">{getHardwarePrice(hw.id, guideRailLength)} ₴</span>
                      </div>
                      <p className="text-sm text-slate-700">{hw.desc}</p>
                      <div className="text-[11px] text-slate-500 font-mono mt-2 bg-slate-100 inline-block px-2 py-0.5 rounded">Товщина напрямної рейки: {hw.thickness} | до {hw.maxWeight} кг</div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:flex bg-slate-50 border border-slate-200 p-4 rounded-xl gap-3 items-start text-sm text-slate-700">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-blue-700">Порада AI:</strong>{' '}
                    {gateWeight > 450
                      ? "У вас важкі ворота. Обирайте рельс 4.0 або 5.0 мм — тонкий метал деформується через сезон."
                      : "Для легких воріт ідеально підійде Standart 3.6 мм — немає сенсу переплачувати."}
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => handleStepChange(1)} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all">Назад</button>
                  <ShimmerButton onClick={() => handleStepChange(3)} className="w-2/3 bg-blue-600 hover:bg-blue-700 py-3.5 px-4 shadow-md">
                    <span>Далі до вибору автоматики</span><ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </ShimmerButton>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-display font-extrabold text-slate-900">Підбір приводу (з металевим редуктором):</h3>
                {compatibleEngines.length < ENGINES_CATALOG.length && (
                  <div className="hidden sm:flex text-xs text-sky-800 bg-sky-50 border border-sky-200 p-3 rounded-lg items-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-sky-600" />
                    Показуємо лише двигуни сумісні з вашою вагою ({gateWeight} кг). Слабші приховано.
                  </div>
                )}
                <div className="grid gap-3">
                  {compatibleEngines.map((engine) => (
                    <div key={engine.id} onClick={() => setSelectedEngine(engine.id)}
                      className={`border p-4 rounded-xl cursor-pointer transition-all flex gap-4 ${
                        selectedEngine === engine.id
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                      }`}>
                      
                      {/* Image Placeholder */}
                      <div className="hidden sm:flex w-24 h-24 shrink-0 bg-slate-100 border border-slate-200 rounded-xl flex-col items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6 mb-1.5 opacity-60" />
                        <span className="text-[9px] uppercase tracking-wider font-bold">Фото</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-4">
                          <h4 className="font-bold text-slate-900 text-base flex flex-wrap items-center gap-2">
                            {engine.name}
                            {engine.tag && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded border border-blue-200 font-mono whitespace-nowrap font-bold">{engine.tag}</span>
                            )}
                          </h4>
                          <span className="font-mono text-blue-600 font-bold text-base sm:text-lg shrink-0 whitespace-nowrap">{engine.basePrice} ₴</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{engine.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          <div className="text-[11px] text-slate-500 font-mono bg-slate-100 inline-block px-2.5 py-1 rounded-md border border-slate-200">
                            {engine.specs.join(' | ')}
                          </div>
                          {!engine.id.includes('no-engine') && (
                            <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-sm">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 
                              {engine.id.includes('miller') ? 'Металеві шестерні (Латунь/Сталь)' : '100% метал редуктора'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Опції */}
                <div className="border-t border-slate-200 pt-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Додаткові модулі:</h4>
                  {[
                    { 
                      state: hasBuiltInWifi && !isNoEngine ? true : (includeWifi && !isNoEngine), 
                      setter: setIncludeWifi, 
                      label: 'Управління зі смартфона (Wi-Fi/GSM)', 
                      sub: hasBuiltInWifi ? 'Вбудований Wi-Fi модуль! Керуйте воротами зі смартфона (до 10 користувачів безкоштовно)' : 'Відкривайте ворота додатком з будь-якої точки', 
                      price: hasBuiltInWifi ? 'Вбудований' : '+1500 ₴', 
                      badge: hasBuiltInWifi ? 'БЕЗКОШТОВНО' : 'ХІТ',
                      disabled: hasBuiltInWifi || isNoEngine
                    },
                    { 
                      state: includeSafety && !isNoEngine, 
                      setter: setIncludeSafety, 
                      label: 'Комплект безпеки (Фотоелементи + Лампа)', 
                      sub: 'Зупинить ворота якщо у прорізі зʼявиться людина або авто', 
                      price: '+1 500 ₴', 
                      badge: null,
                      disabled: isNoEngine
                    },
                  ].map((opt, i) => (
                    <label key={i} className={`flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm select-none transition-all ${opt.disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={opt.state} onChange={(e) => !opt.disabled && opt.setter(e.target.checked)} disabled={opt.disabled}
                          aria-label={opt.label}
                          className="w-5 h-5 rounded accent-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {opt.label}
                            {opt.badge && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded border border-amber-200">{opt.badge}</span>}
                          </div>
                          <div className="hidden sm:block text-xs text-slate-500 mt-0.5">{opt.sub}</div>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-bold text-blue-600 shrink-0 ml-2">{opt.price}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4 pt-2">
                  <button onClick={() => handleStepChange(2)} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all">Назад</button>
                  <ShimmerButton onClick={scrollToCheckout} className="w-2/3 bg-emerald-600 hover:bg-emerald-700 py-3.5 px-4 shadow-md">
                    <span>Оформити замовлення</span><ArrowRight className="w-5 h-5 ml-1" />
                  </ShimmerButton>
                </div>
              </div>
            )}
          </div>

          {/* Права колонка: кошторис (Світла карточка) */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl h-fit sticky top-20">
            <h3 className="text-lg font-display font-extrabold text-slate-900 mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Ваш кошторис</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 5 років гарантії</span>
            </h3>
            <div className="space-y-3.5 mb-6">
              {[
                { label: isNoHardware ? 'Фурнітура:' : `Фурнітура ${currentHardware.name.split(' ')[2] || ''} (рельс ${guideRailLength} м):`, value: isNoHardware ? 'Не потрібна (0 ₴)' : hardwarePrice },
                { label: 'Привід автоматики:', value: isNoEngine ? 'Не потрібен (0 ₴)' : currentEngine.basePrice },
                { label: isNoEngine ? 'Зубчаста рейка:' : `Зубчаста рейка (${toothRackLength} м):`, value: isNoEngine ? 'Не потрібна (0 ₴)' : toothRackPrice },
                ...((includeWifi && !hasBuiltInWifi && !isNoEngine) ? [{ label: 'Доп. Wi-Fi:', value: 1500 }] : []),
                ...(includeSafety && !isNoEngine ? [{ label: 'Комплект безпеки:', value: 1500 }] : []),
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">{row.label}</span>
                  <span className="text-slate-900 font-mono font-bold">{typeof row.value === 'number' ? `${row.value} ₴` : row.value}</span>
                </div>
              ))}

              <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-100">
                <span className="text-slate-600 font-medium">Доставка:</span>
                <span className="text-slate-900 font-medium text-right">за тарифами перевізника<br/><span className="text-slate-400 text-xs">(орієнтовно 1100–1300 ₴)</span></span>
              </div>
              
              {/* Маркетинг: Триггер срочности и скидка */}
              <div className="border-t border-slate-200 pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Ціна в роздрібних магазинах:</span>
                  <span className="line-through decoration-rose-500 decoration-2">{retailPrice} ₴</span>
                </div>
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="text-sm font-extrabold text-slate-900 leading-tight">Наша ціна<br/><span className="text-[10px] text-blue-600 uppercase tracking-wider font-bold block mt-0.5">пряма поставка зі складу</span></span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600">{totalPrice} ₴</span>
                </div>
                <div className="w-full flex justify-end">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 text-xs shadow-sm flex items-center gap-1.5 w-full justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ви економите: {totalSavings} ₴
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 mt-0.5 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 w-full justify-center shadow-sm">
                  <Timer className="w-4 h-4 animate-pulse text-emerald-600" /> Ціна зафіксована на 48 годин
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              <form id="checkout-form" onSubmit={submitOrder} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-bold font-mono text-slate-500 mb-1.5 ml-1">Ваше імʼя (необовʼязково):</label>
                  <input type="text" placeholder="Іван" value={clientName} onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold font-mono text-slate-500 mb-1.5 ml-1">Номер телефону:</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono font-medium">+380</span>
                    <input type="tel" required placeholder="67 123 4567" value={phoneNumber} onChange={handlePhoneChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-14 pr-4 py-3 text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm placeholder:text-slate-400" />
                  </div>
                </div>
                
                {/* Маркетинг: Лид-магнит */}
                <div className="text-[13px] text-slate-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex gap-2.5 items-start leading-relaxed font-medium mb-2 shadow-sm">
                  <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                  <span><strong>+ ПОДАРУНОК:</strong> Безкоштовна інженерна схема монтажу та готове креслення каркаса воріт з таблицею порізки!</span>
                </div>

                <button type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] text-sm uppercase tracking-wider">
                  Отримати креслення та ціну
                </button>

                {/* Блок Гарантії */}
                <div className="mt-5 bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 text-sm shadow-sm">
                  <div className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    Гарантія 5 років від виробника
                  </div>
                  <p className="text-xs mb-3 text-emerald-800/90 font-medium leading-relaxed">
                    Ми офіційні постачальники Edinger, Miller Technics та Rotelli в Україні.
                  </p>
                  <ul className="text-xs space-y-2 mb-3 text-emerald-900/80 font-medium">
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 5 років гарантії на приводи</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Повернення навіть після встановлення</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Безкоштовна заміна при гарантійній поломці</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Офіційний сервісний центр у Києві</li>
                  </ul>
                  <p className="text-[11px] text-emerald-800/70 border-t border-emerald-200/60 pt-2.5 leading-relaxed font-medium">
                    Якщо привід зламається — ми вирішимо питання.<br/>Без бюрократії і довгих очікувань.
                  </p>
                </div>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-5 sm:p-6 rounded-2xl shadow-xl text-center text-sm text-emerald-900 relative overflow-hidden animate-fadeIn">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500 bg-white rounded-full p-1 shadow-sm" />
                <h4 className="font-extrabold text-xl sm:text-2xl mb-2 text-emerald-900">Дякуємо! Ваша заявка прийнята.</h4>
                <p className="font-medium mt-2 text-emerald-800/80 mb-3">Менеджер вже готує пропозицію та зв'яжеться з вами.</p>
                <div className="bg-emerald-100/50 text-emerald-900 p-4 rounded-xl border border-emerald-200 mb-6 text-sm font-medium">
                  <div className="mb-3">🎁 Як і обіцяли, забирайте ваш повний пакет технічної документації прямо зараз:</div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <a 
                      href="https://drive.google.com/file/d/1zQyqtbKL4bTtohPNQuT5i9XvguLnxbXa/view?usp=sharing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      <span className="text-xl shrink-0 group-hover:-translate-y-0.5 transition-transform">📥</span> 
                      <span className="text-left leading-tight">Завантажити схему монтажу воріт та автоматики</span>
                    </a>
                    <a 
                      href="https://drive.google.com/file/d/1P36xv4sgQhTCM_pj3tg_wCUIsX_EgSnf/view?usp=sharing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      <span className="text-xl shrink-0 group-hover:-translate-y-0.5 transition-transform">📐</span>
                      <span className="text-left leading-tight">Завантажити готове інженерне креслення каркаса</span>
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 text-left shadow-sm border border-emerald-100">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Ваш розрахунок:
                  </h5>
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    <div className="flex justify-between items-center">
                      <span>Ширина воріт:</span> <strong className="text-slate-900">{gateWidth} м</strong>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span>Фурнітура:</span> <strong className="text-slate-900 truncate max-w-[60%] text-right">{currentHardware.name}</strong>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span>Автоматика:</span> <strong className="text-slate-900 truncate max-w-[60%] text-right">{currentEngine.name}</strong>
                    </div>
                    {!isNoEngine && (
                      <div className="flex justify-between items-center">
                        <span>Довжина рейки:</span> <strong className="text-slate-900">{toothRackLength} м</strong>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 font-bold text-sm sm:text-base">
                      <span>Всього до сплати:</span> <span className="text-blue-600 font-mono">{totalPrice} ₴</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== ГАРАНТІЯ + ДОСТАВКА + БРЕНДИ (Темний блок) ====== */}
      <div className="border-t border-slate-800 relative z-10 bg-slate-900">
        <GuaranteeBlock />
      </div>

      {/* ====== YOUTUBE (Світлий блок) ====== */}
      <div className="relative z-10">
        <YoutubeBlock />
      </div>

      {/* ====== ВІДГУКИ (Світлий блок) ====== */}
      <ReviewsBlock />

      {/* ====== ЧОМУ 95% ЛАМАЮТЬСЯ (Темний блок) ====== */}
      <section className="py-24 border-t border-slate-800 bg-slate-900 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white text-center mb-10">
            Чому 95% приводів на ринку ламаються взимку, і чому наші працюють завжди?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-transparent shadow-lg flex flex-col">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-5 font-bold text-xl shrink-0">✕</div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-3">Дешевий силумін та пластик</h3>
              
              {/* Image Placeholder */}
              <div className="w-full h-40 bg-slate-100 border border-slate-200 rounded-xl mb-4 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[10px] uppercase tracking-wider font-bold">Фото зламаної шестерні</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Багато брендів економлять і ставлять пластикові редуктори. При перших заморозках мастило густішає, пластикові зуби зрізає — і ви залишаєтесь з неробочими воротами.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-transparent shadow-lg flex flex-col">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5 font-bold text-xl shrink-0">✓</div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-3">Сталь, латунь та повний метал</h3>
              
              {/* Image Placeholder */}
              <div className="w-full h-40 bg-slate-100 border border-slate-200 rounded-xl mb-4 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[10px] uppercase tracking-wider font-bold">Фото сталевого редуктора</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Edinger, Miller Technics та Rotelli — тільки металеві шестерні. Сталеві та латунні редуктори мають потрійний ресурс міцності та не бояться українських зим.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== ФУТЕР ====== */}
      <footer className="border-t border-slate-800 py-10 text-center text-xs text-slate-400 bg-slate-950 relative z-10 font-medium">
        <p>© 2012—2026 | Магазин-конфігуратор воротних систем та автоматики.</p>
        <p className="mt-1">Всі права захищено. Доставка зі складу по всій Україні.</p>
        <div className="flex justify-center gap-6 mt-4 text-slate-500 font-bold">
          <a href="https://t.me/NoviVorotabot" target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> Telegram</a>
          <span>•</span>
          <a href="viber://pa?chatURI=novivorota" className="hover:text-blue-400 transition-colors flex items-center gap-1.5"><Phone className="w-3 h-3"/> Viber</a>
        </div>
      </footer>

      {/* ====== MOBILE STICKY CHECKOUT BAR (Світлий) ====== */}
      {!isSubmitted && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-bold font-mono mb-0.5 uppercase tracking-wider">До сплати:</div>
            <div className="text-xl font-black font-mono text-blue-600 leading-none">{totalPrice} ₴</div>
          </div>
          <button 
            onClick={() => {
              if (step < 3) handleStepChange(step + 1);
              else scrollToCheckout();
            }}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-sm flex items-center gap-2"
          >
            {step < 3 ? (
              <>Далі <ArrowRight className="w-4 h-4" /></>
            ) : (
              'Оформити'
            )}
          </button>
        </div>
      )}

      {/* ====== FLOATING AI ЧАТ ====== */}
      <AIChatWidget 
        calculatorState={{ gateWidth, gateWeight, selectedEngine, selectedHardware, guideRailLength }} 
        isSubmitted={isSubmitted} 
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />
      {/* ====== FOMO TOAST ====== */}
      <div className={`fixed bottom-24 md:bottom-6 left-4 z-50 transition-all duration-500 transform ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 max-w-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <p className="text-xs sm:text-sm font-medium leading-snug">{toastMessage}</p>
        </div>
      </div>

    </div>
  );
}
