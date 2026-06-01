import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AuroraBackground } from './components/ui/aurora-background';
import { MagicCard } from './components/ui/magic-card';
import { ShimmerButton } from './components/ui/shimmer-button';
import {
  ShieldCheck, Wrench, Cpu, Sparkles, Phone,
  CheckCircle2, ChevronRight, Info, ArrowRight,
  Clock, Truck, Video, Star, Award, Zap, Timer, Camera
} from 'lucide-react';

// ============================================================
// 📦 БАЗА ДАННЫХ — каталог без изменений
// ============================================================

const ENGINES_CATALOG = [
  {
    id: 'edinger-s6',
    name: 'Edinger S6',
    tag: 'ТОП ЦІНА/ЯКІСТЬ',
    description: 'Ідеально для побутових воріт до 4-5 метрів. Сталевий редуктор.',
    specs: ['350W', 'Метал', 'до 600 кг'],
    basePrice: 7500,
    maxWeight: 600
  },
  {
    id: 'miller-technics-800',
    name: 'Miller Technics 800',
    tag: 'ВИБІР ЕКСПЕРТІВ',
    description: 'Преміум-клас. Надійний двигун з масивним металевим редуктором для важких умов.',
    specs: ['400W', 'Латунь/Сталь', 'до 800 кг'],
    basePrice: 14999,
    maxWeight: 800
  },
  {
    id: 'rotelli-sl1100',
    name: 'Rotelli Premium SL 1100 Wi-Fi',
    tag: 'ЄВРОПЕЙСЬКИЙ ПРЕМІУМ',
    description: 'Промисловий запас міцності та вбудоване керування з телефона в комплекті.',
    specs: ['500W', 'Сталь', 'до 1100 кг'],
    basePrice: 14480,
    maxWeight: 1100
  }
];

const HARDWARE_CATALOG = [
  { id: 'standart-3.6', name: 'Novi Vorota Standart (3.6 мм)', maxWeight: 500, thickness: '3.6 мм', price: 3925, desc: 'Для легких воріт з профнастилу.' },
  { id: 'gospodar-4.0', name: 'Novi Vorota Gospodar (4.0 мм)', maxWeight: 500, thickness: '4.0 мм', price: 4525, desc: 'Посилений направляючий рельс для довговічності.' },
  { id: 'fayna-5.0', name: 'Novi Vorota Fayna (5.0 мм)', maxWeight: 800, thickness: '5.0 мм', price: 8757, desc: 'Для важких кованих або широких воріт.' }
];

// ============================================================
// 🧩 ДОПОМІЖНІ КОМПОНЕНТИ
// ============================================================

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
            Відправка зі складу в день замовлення. Нова Пошта, Укрпошта або самовивіз. По всій Україні — без доплат за регіон.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">1-3 дні</span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">Нова Пошта</span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">Укрпошта</span>
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
            { title: 'Підключення автоматики Edinger S6', duration: '08:21', views: '31K' },
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
  const [selectedEngine, setSelectedEngine] = useState(ENGINES_CATALOG[0].id);
  const [includeWifi, setIncludeWifi] = useState(false);
  const [includeSafety, setIncludeSafety] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Привіт! Я твій інженер-консультант. Допоможу підібрати автоматику без переплат. Які ворота плануєте ставити?' }
  ]);
  const [userQuestion, setUserQuestion] = useState('');

  // --- Розрахунок вартості (без змін) ---
  const currentHardware = HARDWARE_CATALOG.find(h => h.id === selectedHardware) || HARDWARE_CATALOG[0];
  const currentEngine = ENGINES_CATALOG.find(e => e.id === selectedEngine) || ENGINES_CATALOG[0];
  const railLength = gateWidth + 1;
  const railPrice = railLength * 350;
  
  const isRotelli = currentEngine.id === 'rotelli-sl1100';
  const wifiPrice = (includeWifi && !isRotelli) ? 600 : 0;
  const safetyPrice = includeSafety ? 1500 : 0;
  const totalPrice = currentHardware.price + currentEngine.basePrice + railPrice + wifiPrice + safetyPrice;

  // --- Фільтрація по вазі (матриця сумісності) ---
  const compatibleEngines = ENGINES_CATALOG.filter(e => e.maxWeight >= gateWeight);
  const compatibleHardware = HARDWARE_CATALOG.filter(h => h.maxWeight >= gateWeight);

  // --- Маска телефону (без змін) ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 9) setPhoneNumber(input);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 9) return alert('Будь ласка, введіть коректний номер телефону');
    setIsSubmitted(true);
  };

  const askAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    const newMessages = [...chatMessages, { role: 'user', text: userQuestion }];
    setChatMessages(newMessages);
    setUserQuestion('');
    setTimeout(() => {
      let aiResponse = "Гарне питання! Для ваших параметрів краще за все підійде конфігурація з металевим редуктором. Зверніть увагу на блоки автоматики з Wi-Fi — це лише +600 грн до кошторису.";
      if (userQuestion.toLowerCase().includes('ціна') || userQuestion.toLowerCase().includes('сколько')) {
        aiResponse = `За вашим розрахунком повний комплект виходить ${totalPrice} грн. Ціни актуальні, від офіційного постачальника!`;
      } else if (userQuestion.toLowerCase().includes('вага') || userQuestion.toLowerCase().includes('вес')) {
        aiResponse = `При вазі воріт ${gateWeight} кг автоматика повинна мати запас 1.5-2х. Мотор ${currentEngine.name} розрахований до ${currentEngine.maxWeight} кг — впорається навіть у сильний вітер.`;
      }
      setChatMessages([...newMessages, { role: 'assistant', text: aiResponse }]);
    }, 800);
  };

  const scrollToCheckout = () => {
    document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-blue-500/30">
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
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">

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
                  <label className="flex justify-between items-end mb-3 text-slate-600">
                    <span className="text-sm font-bold mb-1">Ширина в'їзду (метрів):</span>
                    <span className="text-blue-600 font-mono font-bold text-3xl leading-none">{gateWidth} <span className="text-lg">м</span></span>
                  </label>
                  <input type="range" min="3" max="7" step="0.5" value={gateWidth}
                    aria-label="Ширина в'їзду в метрах"
                    onChange={(e) => setGateWidth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium"><span>3 м</span><span>5 м</span><span>7 м</span></div>
                  <div className="mt-4 text-sm text-blue-800 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Для противаги розраховано рельс довжиною <strong className="font-mono">{railLength} метрів</strong>.</span>
                  </div>
                </div>
                <div>
                  <label className="flex justify-between items-end mb-3 text-slate-600">
                    <span className="text-sm font-bold mb-1">Орієнтовна вага воріт:</span>
                    <span className="text-blue-600 font-mono font-bold text-3xl leading-none">{gateWeight} <span className="text-lg">кг</span></span>
                  </label>
                  <input type="range" min="200" max="1000" step="50" value={gateWeight}
                    aria-label="Орієнтовна вага воріт у кілограмах"
                    onChange={(e) => setGateWeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>200 кг (Профнастил)</span><span>600 кг (Сендвіч-панель)</span><span>1000 кг (Ковка)</span>
                  </div>
                </div>
                <ShimmerButton onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 py-4 px-4 shadow-md mt-6">
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
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-base">{hw.name}</h4>
                        <span className="font-mono text-blue-600 font-bold text-base">{hw.price} ₴</span>
                      </div>
                      <p className="text-sm text-slate-600">{hw.desc}</p>
                      <div className="text-[11px] text-slate-500 font-mono mt-2 bg-slate-100 inline-block px-2 py-0.5 rounded">Товщина: {hw.thickness} | до {hw.maxWeight} кг</div>
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
                  <button onClick={() => setStep(1)} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all">Назад</button>
                  <ShimmerButton onClick={() => setStep(3)} className="w-2/3 bg-blue-600 hover:bg-blue-700 py-3.5 px-4 shadow-md">
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
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1.5">
                          <h4 className="font-bold text-slate-900 text-base flex flex-wrap items-center gap-2">
                            {engine.name}
                            {engine.tag && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded border border-blue-200 font-mono whitespace-nowrap font-bold">{engine.tag}</span>
                            )}
                          </h4>
                          <span className="font-mono text-blue-600 font-bold text-base sm:text-lg whitespace-nowrap">{engine.basePrice} ₴</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{engine.description}</p>
                        <div className="text-[11px] text-slate-500 font-mono mt-2.5 bg-slate-100 inline-block px-2.5 py-1 rounded-md border border-slate-200">
                          {engine.specs.join(' | ')}
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
                      state: isRotelli ? true : includeWifi, 
                      setter: setIncludeWifi, 
                      label: 'Управління зі смартфона (Wi-Fi/GSM)', 
                      sub: 'Відкривайте ворота додатком з будь-якої точки', 
                      price: isRotelli ? 'Включено' : '+600 ₴', 
                      badge: 'ХІТ',
                      disabled: isRotelli
                    },
                    { 
                      state: includeSafety, 
                      setter: setIncludeSafety, 
                      label: 'Комплект безпеки (Фотоелементи + Лампа)', 
                      sub: 'Зупинить ворота якщо у прорізі зʼявиться людина або авто', 
                      price: '+1 500 ₴', 
                      badge: null,
                      disabled: false
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
                  <button onClick={() => setStep(2)} className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all">Назад</button>
                  <ShimmerButton onClick={scrollToCheckout} className="w-2/3 bg-emerald-600 hover:bg-emerald-700 py-3.5 px-4 shadow-md">
                    <span>Оформити замовлення</span><ArrowRight className="w-5 h-5 ml-1" />
                  </ShimmerButton>
                </div>
              </div>
            )}
          </div>

          {/* Права колонка: кошторис (Світла карточка) */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl h-fit sticky top-20">
            <h3 className="text-lg font-display font-extrabold text-slate-900 mb-5 pb-4 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Ваш кошторис
            </h3>
            <div className="space-y-3.5 mb-6">
              {[
                { label: 'Фурнітура:', value: currentHardware.price },
                { label: 'Привід автоматики:', value: currentEngine.basePrice },
                { label: `Зубчаста рейка (${railLength} м):`, value: railPrice },
                ...((includeWifi && !isRotelli) ? [{ label: 'Смарт-модуль Wi-Fi:', value: 600 }] : []),
                ...(includeSafety ? [{ label: 'Комплект безпеки:', value: 1500 }] : []),
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">{row.label}</span>
                  <span className="text-slate-900 font-mono font-bold">{row.value} ₴</span>
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
                  <span className="line-through decoration-rose-500 decoration-2">{totalPrice + 1500} ₴</span>
                </div>
                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <span className="text-sm font-extrabold text-slate-900 leading-tight">Наша ціна<br/><span className="text-[10px] text-blue-600 uppercase tracking-wider font-bold block mt-0.5">пряма поставка зі складу</span></span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600">{totalPrice} ₴</span>
                </div>
                <div className="w-full flex justify-end">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 text-xs shadow-sm flex items-center gap-1.5 w-full justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ви економите: 1 500 грн
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
                <div className="text-[11px] text-slate-700 bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2.5 items-start leading-relaxed font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>За вашим номером фіксується <strong>безкоштовне індивідуальне креслення</strong>. <span className="text-amber-700 font-extrabold block mt-1">+ Подарунок: PDF-інструкція по зварюванню каркасу</span></span>
                </div>

                <button type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] text-sm uppercase tracking-wider">
                  Отримати креслення та ціну
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl text-center text-xs text-emerald-800">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
                <h4 className="font-extrabold text-base mb-1 text-emerald-900">Запит успішно надіслано!</h4>
                <p className="font-medium mt-2">Інженер готує креслення під ваші ворота ({gateWidth}м) та бонусний PDF. Очікуйте дзвінка найближчим часом.</p>
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
              if (step < 3) setStep(step + 1);
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
      <div className={`fixed right-4 sm:right-6 z-50 transition-all ${isSubmitted ? 'bottom-6' : 'bottom-24 md:bottom-6'}`}>
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)}
            className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl flex items-center gap-2 group transition-all duration-300 hover:scale-105">
            <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-30" />
            <Sparkles className="w-5 h-5 relative z-10" />
            <span className="hidden sm:inline relative z-10 max-w-0 overflow-hidden group-hover:max-w-md transition-all duration-300 ease-out text-sm font-bold whitespace-nowrap pl-1">
              💬 Потрібна допомога? AI підбере комплект за 1 хвилину
            </span>
          </button>
        ) : (
          <div className="bg-white border border-slate-200 w-80 sm:w-96 h-[440px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-xs font-bold text-white">Інженер-Консультант (AI)</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white text-xs font-mono bg-blue-700 hover:bg-blue-800 w-6 h-6 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={askAi} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input type="text" placeholder="Запитати про монтаж, редуктор, вагу..."
                value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-xl transition-all text-xs shadow-sm active:scale-95">
                ОК
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
