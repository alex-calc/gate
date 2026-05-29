import { useState, useEffect } from "react";

// ============================================================
// 📦 КАТАЛОГ ТОВАРІВ — додавай нові позиції тут
// ============================================================

const HARDWARE_CATALOG = [
  {
    id: "nv_standart_500",
    name: "Novi Vorota Standart 500",
    rail: "рельс 3,6 мм",
    maxWeight: 500,
    price: 4025,
    recommended: true,
  },
  {
    id: "nv_standart_800",
    name: "Novi Vorota Standart 800",
    rail: "рельс 5 мм",
    maxWeight: 800,
    price: 8857,
    recommended: false,
  },
];

const ADDONS_CATALOG = [
  {
    id: "t_profile",
    name: "Т-подібний профіль для каркасу",
    desc: "Захист від корозії, монтаж у 2 рази швидше",
    pricePerMeter: 85, // ₴ за метр
    type: "per_meter",
  },
  {
    id: "bracket",
    name: "Кронштейн без зварювання",
    desc: "Монтаж без зварювального апарату (+250 ₴)",
    price: 250,
    type: "fixed",
  },
];

const ENGINES_CATALOG = [
  {
    id: "edinger_s6",
    name: "Edinger S6",
    brand: "Edinger",
    tier: "budget",
    maxWeight: 600,
    price: 8900,
    wifiPrice: 9500,
    wifiModel: "Edinger S6 Wi-Fi",
    desc: "Народний вибір • Надійний редуктор",
  },
  {
    id: "edinger_s8",
    name: "Edinger S8",
    brand: "Edinger",
    tier: "budget",
    maxWeight: 800,
    price: 10200,
    wifiPrice: 10800,
    wifiModel: "Edinger S8 Wi-Fi",
    desc: "Народний вибір • Посилена серія",
  },
  {
    id: "miller_800",
    name: "Miller Technics 800",
    brand: "Miller Technics",
    tier: "premium",
    maxWeight: 800,
    price: 16400,
    wifiPrice: 16400, // вже включає Wi-Fi
    wifiModel: "Miller Technics 800",
    desc: "Преміум • Латунний редуктор • Італія",
  },
  {
    id: "rotelli_1100",
    name: "Rotelli Premium 1100",
    brand: "Rotelli",
    tier: "premium",
    maxWeight: 1100,
    price: 15900,
    wifiPrice: 15900,
    wifiModel: "Rotelli Premium 1100",
    desc: "Преміум • Wi-Fi вбудований • Італія",
  },
  {
    id: "edinger_i12",
    name: "Edinger I12",
    brand: "Edinger",
    tier: "budget",
    maxWeight: 1200,
    price: 12173,
    wifiPrice: 12691,
    wifiModel: "Edinger I12 Wi-Fi",
    desc: "Промислова потужність • Масляна ванна",
  },
];

const ENGINE_OPTIONS = {
  gearRack: [
    { label: "Без рейки", price: 0 },
    { label: "4 метри", price: 1200 },
    { label: "5 метрів", price: 1500 },
  ],
  safety: [
    { label: "Без додаткової безпеки", price: 0 },
    { label: "Сигнальна лампа", price: 516 },
    { label: "Фотоелементи безпеки", price: 929 },
    { label: "Фотоелементи + Лампа", price: 1445 },
  ],
  phoneControl: [
    { label: "Тільки пульти", price: 0 },
    { label: "Модуль Prosto Dzvinok", price: 1440 },
    { label: "GSM-модуль (10 номерів)", price: 2580 },
  ],
};

// ============================================================
// 🔧 УТИЛІТИ
// ============================================================

const fmt = (n: number) => n.toLocaleString("uk-UA") + " ₴";

const getFilteredEngines = (selectedWeight: number) => {
  if (selectedWeight <= 500) {
    return ENGINES_CATALOG.filter(e => ["edinger_s6", "edinger_s8", "miller_800"].includes(e.id));
  } else if (selectedWeight <= 800) {
    return ENGINES_CATALOG.filter(e => ["edinger_s8", "miller_800", "rotelli_1100"].includes(e.id));
  } else {
    return ENGINES_CATALOG.filter(e => ["edinger_i12", "rotelli_1100"].includes(e.id));
  }
};

// ============================================================
// 🧩 КОМПОНЕНТИ
// ============================================================

// --- Progress Bar ---
function ProgressBar({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-1">
        {labels.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
                  done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : active
                    ? "bg-white border-blue-600 text-blue-600 shadow-lg shadow-blue-200"
                    : "bg-white border-slate-200 text-slate-300"
                }`}
              >
                {done ? "✓" : step}
              </div>
              <span
                className={`text-[10px] mt-1 font-bold text-center leading-tight ${
                  active ? "text-blue-600" : done ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1 bg-slate-100 rounded-full mx-3 mt-1">
        <div
          className="absolute h-1 bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// --- Sticky Summary ---
function StickySummary({ total }: { total: number }) {
  return (
    <div className="sticky top-0 z-30 bg-slate-900 text-white px-4 py-2 flex items-center justify-between shadow-lg border-b border-slate-700">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ваш кошик</span>
      <span className="text-lg font-black text-blue-400 tabular-nums">{fmt(total)}</span>
    </div>
  );
}

// --- Step 1: Фурнітура ---
function StepHardware({ state, setState }: { state: any; setState: any }) {
  const weightOptions = [
    { label: "до 400 кг", value: 400, hint: "Стандартні ворота гаражу" },
    { label: "до 500 кг", value: 500, hint: "Великий прогін або важкий каркас" },
    { label: "до 800 кг", value: 800, hint: "Промислові або дуже важкі ворота" },
    { label: "до 1200 кг", value: 1200, hint: "Важкі промислові або ковані ворота" },
  ];

  let baseSuggested = state.weight <= 500
      ? HARDWARE_CATALOG.find((h) => h.id === "nv_standart_500")
      : HARDWARE_CATALOG.find((h) => h.id === "nv_standart_800");

  let suggestedHardware = baseSuggested ? { ...baseSuggested } : null;
  if (suggestedHardware && state.weight === 1200 && suggestedHardware.id === "nv_standart_800") {
    suggestedHardware.name = "Novi Vorota Standart 800 (посилений)";
    suggestedHardware.rail = "рельс 5 мм • 8 метрів";
    suggestedHardware.price = 10757;
  }

  useEffect(() => {
    if (
      suggestedHardware &&
      (state.hardware?.id !== suggestedHardware.id || state.hardware?.price !== suggestedHardware.price)
    ) {
      setState((s: any) => ({ ...s, hardware: suggestedHardware }));
    }
  }, [state.weight, suggestedHardware?.id, suggestedHardware?.price, setState]);

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 leading-tight">
          Параметри ваших ворот
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Оберіть приблизну вагу — ми підберемо фурнітуру автоматично
        </p>
      </div>

      {/* Вага */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Вага воротного полотна
        </label>
        <div className="grid grid-cols-1 gap-2">
          {weightOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setState((s: any) => ({ ...s, weight: opt.value }))}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                state.weight === opt.value
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <div className={`font-black text-base ${state.weight === opt.value ? "text-blue-700" : "text-slate-800"}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{opt.hint}</div>
              </div>
              {state.weight === opt.value && (
                <span className="text-blue-600 text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Рекомендована фурнітура */}
      {suggestedHardware && (
        <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            ✦ Рекомендована фурнітура
          </div>
          <div className="text-white font-black text-base">{suggestedHardware.name}</div>
          <div className="text-slate-400 text-sm">{suggestedHardware.rail}</div>
          <div className="text-blue-400 font-black text-xl">{fmt(suggestedHardware.price)}</div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-700 mt-2">
            ⚙️ Тільки металеві ролики та посилені підшипники. Жодного пластику!
          </div>
        </div>
      )}

      {/* Ручний вибір */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Або обрати вручну
        </label>
        {HARDWARE_CATALOG.map((baseHw) => {
          if (state.weight > 500 && baseHw.maxWeight < 800) return null;

          let displayHw = { ...baseHw };
          if (state.weight === 1200 && displayHw.id === "nv_standart_800") {
            displayHw.name = "Novi Vorota Standart 800 (посилений)";
            displayHw.rail = "рельс 5 мм • 8 метрів";
            displayHw.price = 10757;
          }

          const isRecommended = displayHw.id === suggestedHardware?.id;
          return (
            <button
              key={displayHw.id}
              onClick={() => setState((s: any) => ({ ...s, hardware: displayHw }))}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                state.hardware?.id === displayHw.id && state.hardware?.price === displayHw.price
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-left">
                <div className={`font-bold text-sm ${state.hardware?.id === displayHw.id && state.hardware?.price === displayHw.price ? "text-blue-700" : "text-slate-800"}`}>
                  {displayHw.name} {isRecommended && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-1">Рекомендований</span>}
                </div>
                <div className="text-xs text-slate-400">{displayHw.rail} • до {displayHw.maxWeight} кг</div>
              </div>
              <div className="font-black text-sm text-slate-700 ml-2 shrink-0">{fmt(displayHw.price)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Step 2: Додаткові матеріали ---
function StepAddons({ state, setState }: { state: any; setState: any }) {
  const toggle = (id: string) => {
    setState((s: any) => ({
      ...s,
      addons: s.addons.includes(id)
        ? s.addons.filter((a: string) => a !== id)
        : [...s.addons, id],
    }));
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Додаткові матеріали</h2>
        <p className="text-sm text-slate-500 mt-1">
          Оберіть що вам потрібно — або пропустіть цей крок
        </p>
      </div>

      {ADDONS_CATALOG.map((addon) => {
        const selected = state.addons.includes(addon.id);
        const price = addon.type === "per_meter"
          ? `${addon.pricePerMeter} ₴/м`
          : fmt(addon.price!);

        return (
          <button
            key={addon.id}
            onClick={() => toggle(addon.id)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] space-y-1 ${
              selected
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className={`font-black text-sm ${selected ? "text-blue-800" : "text-slate-800"}`}>
                  {addon.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{addon.desc}</div>
              </div>
              <div className={`shrink-0 font-black text-sm ${selected ? "text-blue-600" : "text-slate-600"}`}>
                {price}
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              selected ? "bg-blue-600 border-blue-600" : "border-slate-300"
            }`}>
              {selected && <span className="text-white text-xs font-black">✓</span>}
            </div>
          </button>
        );
      })}

      {state.addons.includes("t_profile") && (
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Довжина профілю (метрів)
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setState((s: any) => ({ ...s, profileMeters: Math.max(1, (s.profileMeters || 6) - 1) }))}
              className="w-10 h-10 rounded-xl bg-slate-100 font-black text-lg active:scale-95"
            >−</button>
            <span className="text-2xl font-black text-blue-600 w-12 text-center">
              {state.profileMeters || 6}
            </span>
            <button
              onClick={() => setState((s: any) => ({ ...s, profileMeters: (s.profileMeters || 6) + 1 }))}
              className="w-10 h-10 rounded-xl bg-slate-100 font-black text-lg active:scale-95"
            >+</button>
            <span className="text-sm text-slate-500 ml-2">
              = {fmt((state.profileMeters || 6) * 85)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Step 3: Автоматика ---
function StepEngine({ state, setState }: { state: any; setState: any }) {
  const selectedWeight = state.weight || 400;
  const compatible = getFilteredEngines(selectedWeight);
  const budget = compatible.filter((e) => e.tier === "budget");
  const premium = compatible.filter((e) => e.tier === "premium");

  const toggleWifi = () => setState((s: any) => ({ ...s, wifi: !s.wifi }));

  const selectedEngine = state.engine
    ? compatible.find((e) => e.id === state.engine.id) || compatible[0]
    : compatible[0];

  useEffect(() => {
    if (!state.engine || !compatible.find((e) => e.id === state.engine.id)) {
      setState((s: any) => ({ ...s, engine: compatible[0] || null }));
    }
  }, [selectedWeight, state.engine, compatible, setState]);

  const renderEngineCard = (engine: any) => {
    const selected = state.engine?.id === engine.id;
    const isPremium = engine.tier === "premium";
    const displayPrice = (selected && state.wifi && !isPremium) ? engine.wifiPrice : engine.price;
    const displayName = (selected && state.wifi && !isPremium) ? engine.wifiModel : engine.name;
    const diff = engine.wifiPrice - engine.price;

    let badge = null;
    if (engine.id === "edinger_s8") badge = <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full ml-1 uppercase font-bold tracking-wider">🔥 Хіт продажів</span>;
    if (engine.id === "miller_800") badge = <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1 uppercase font-bold tracking-wider">⭐ Вибір професіоналів</span>;

    return (
      <div
        key={engine.id}
        className={`w-full rounded-2xl border-2 text-left transition-all overflow-hidden ${
          selected
            ? "border-blue-600 bg-blue-50 shadow-md"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <button
          onClick={() => setState((s: any) => ({ ...s, engine }))}
          className="w-full p-4 flex justify-between items-start gap-2 active:scale-[0.99]"
        >
          <div className="text-left">
            <div className={`font-black text-sm ${selected ? "text-blue-800" : "text-slate-800"}`}>
              {displayName} {badge}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{engine.desc}</div>
            <div className="text-xs text-slate-400 mt-0.5">до {engine.maxWeight} кг</div>
          </div>
          <div className={`font-black text-base shrink-0 ${selected ? "text-blue-600" : "text-slate-700"}`}>
            {fmt(displayPrice)}
          </div>
        </button>

        {selected && (
          <div className="px-4 pb-4 pt-1 bg-blue-50/50">
            {!isPremium ? (
              <button
                onClick={(e) => { e.stopPropagation(); toggleWifi(); }}
                className="flex items-center gap-2 mt-2"
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${state.wifi ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                  {state.wifi && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-xs font-bold text-slate-700">Додати Wi-Fi модуль (+{diff} ₴)</span>
              </button>
            ) : (
              <div className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
                <span>✓</span> Модуль Wi-Fi вже у вартості
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-xl font-black text-slate-900">Автоматика</h2>
        <p className="text-sm text-slate-500 mt-1">
          Показуємо лише двигуни сумісні з вашою фурнітурою (до {state.hardware?.maxWeight || 500} кг)
        </p>
      </div>

      {/* Бюджетні */}
      {budget.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">
            🏆 Народний вибір (Edinger)
          </div>
          {budget.map(renderEngineCard)}
        </div>
      )}

      {/* Преміум */}
      {premium.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">
            💎 Преміум (Rotelli / Miller)
          </div>
          {premium.map(renderEngineCard)}
        </div>
      )}

      {/* Додаткові опції */}
      <div className="pt-4 border-t border-slate-200 mt-6 space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">Додаткові опції для комфорту та безпеки</h2>
        </div>

        {/* Зубчаста рейка */}
        <div className="space-y-2">
          <div>
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Зубчаста рейка (оцинкована, 8 мм)</label>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Необхідна для передачі руху від мотора до воріт. Довжина = ширина прорізу + 1 метр.</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ENGINE_OPTIONS.gearRack.map(opt => (
              <button
                key={opt.label}
                onClick={() => setState((s: any) => ({ ...s, gearRack: opt }))}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  state.gearRack?.label === opt.label ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`font-bold text-sm ${state.gearRack?.label === opt.label ? "text-blue-700" : "text-slate-800"}`}>{opt.label}</div>
                <div className="text-sm font-black text-slate-700">{opt.price > 0 ? `+${fmt(opt.price)}` : '0 ₴'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Елементи безпеки */}
        <div className="space-y-2">
          <div>
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Елементи безпеки</label>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Фотоелементи не дадуть воротам ударити машину або дитину, а лампа сигналізує про рух.</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ENGINE_OPTIONS.safety.map(opt => (
              <button
                key={opt.label}
                onClick={() => setState((s: any) => ({ ...s, safety: opt }))}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  state.safety?.label === opt.label ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`font-bold text-sm ${state.safety?.label === opt.label ? "text-blue-700" : "text-slate-800"}`}>{opt.label}</div>
                <div className="text-sm font-black text-slate-700">{opt.price > 0 ? `+${fmt(opt.price)}` : '0 ₴'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Керування з телефона */}
        <div className="space-y-2">
          <div>
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Керування з телефона</label>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Дозволяє відкривати ворота дзвінком без використання пультів.</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {ENGINE_OPTIONS.phoneControl.map(opt => (
              <button
                key={opt.label}
                onClick={() => setState((s: any) => ({ ...s, phoneControl: opt }))}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  state.phoneControl?.label === opt.label ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`font-bold text-sm ${state.phoneControl?.label === opt.label ? "text-blue-700" : "text-slate-800"}`}>{opt.label}</div>
                <div className="text-sm font-black text-slate-700">{opt.price > 0 ? `+${fmt(opt.price)}` : '0 ₴'}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Step 4: Підсумок + Лід-магніт ---
function StepSummary({ state, total, onSubmit }: { state: any; total: number; onSubmit: any }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("380")) val = val.slice(3);
    else if (val.startsWith("80")) val = val.slice(1);
    else if (val.startsWith("0")) val = val;
    val = val.slice(0, 10);

    let formatted = "+380";
    if (val.length > 0) formatted += ` (${val.slice(1, 3)}`;
    if (val.length >= 3) formatted += `) ${val.slice(3, 6)}`;
    if (val.length >= 6) formatted += `-${val.slice(6, 8)}`;
    if (val.length >= 8) formatted += `-${val.slice(8, 10)}`;
    setPhone(formatted === "+380" ? "" : formatted);
  };

  const addonDetails = state.addons.map((id: string) => {
    const a = ADDONS_CATALOG.find((x) => x.id === id);
    if (!a) return null;
    if (a.type === "per_meter") return { name: a.name, price: (state.profileMeters || 6) * a.pricePerMeter! };
    return { name: a.name, price: a.price };
  }).filter(Boolean);

  const isPremiumEngine = state.engine?.tier === "premium";
  const engineName = (state.wifi && !isPremiumEngine)
    ? state.engine?.wifiModel
    : state.engine?.name;
  const enginePrice = (state.wifi && !isPremiumEngine)
    ? state.engine?.wifiPrice
    : state.engine?.price;

  const handleSubmit = () => {
    if (!name || phone.length < 19) { alert("Будь ласка, введіть ім'я та коректний номер телефону"); return; }
    const order = {
      hardware: { name: state.hardware?.name, price: state.hardware?.price },
      addons: addonDetails,
      engine: { name: engineName, price: enginePrice },
      engineOptions: {
        gearRack: state.gearRack,
        safety: state.safety,
        phoneControl: state.phoneControl,
      },
      wifi: state.wifi,
      total,
      customer: { name, phone },
      timestamp: new Date().toISOString(),
    };
    console.log("📦 ORDER:", order);
    onSubmit(order);
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      {/* Лід-магніт */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-xl">
        <div className="text-2xl mb-1">🎁</div>
        <div className="font-black text-lg leading-tight">При оформленні замовлення сьогодні — БЕЗКОШТОВНО:</div>
        <ul className="mt-2 space-y-1 text-sm font-medium">
          <li>✓ Індивідуальний креслення каркасу під ваш проріз</li>
          <li>✓ Покрокова книга-інструкція по монтажу</li>
          <li className="text-amber-100 text-xs">Економія 1 000 ₴</li>
        </ul>
      </div>

      {/* Деталізація */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="font-black text-sm text-slate-700 uppercase tracking-wider">Ваш кошик</div>
        </div>
        <div className="divide-y divide-slate-100">
          {state.hardware && (
            <div className="flex justify-between items-center px-4 py-3">
              <div>
                <div className="text-sm font-bold text-slate-800">{state.hardware.name}</div>
                <div className="text-xs text-slate-400">{state.hardware.rail}</div>
              </div>
              <div className="font-black text-sm text-slate-700">{fmt(state.hardware.price)}</div>
            </div>
          )}
          {addonDetails.map((a: any, i: number) => (
            <div key={i} className="flex justify-between items-center px-4 py-3">
              <div className="text-sm font-bold text-slate-800">{a.name}</div>
              <div className="font-black text-sm text-slate-700">{fmt(a.price)}</div>
            </div>
          ))}
          {state.engine && (
            <div className="flex justify-between items-center px-4 py-3">
              <div>
                <div className="text-sm font-bold text-slate-800">{engineName}</div>
                <div className="text-xs text-slate-400">Автоматика {state.wifi ? "+ Wi-Fi" : ""}</div>
              </div>
              <div className="font-black text-sm text-slate-700">{fmt(enginePrice || 0)}</div>
            </div>
          )}
          {state.gearRack?.price > 0 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100">
              <div className="text-sm font-bold text-slate-800">Зубчаста рейка: {state.gearRack.label}</div>
              <div className="font-black text-sm text-slate-700">{fmt(state.gearRack.price)}</div>
            </div>
          )}
          {state.safety?.price > 0 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100">
              <div className="text-sm font-bold text-slate-800">{state.safety.label}</div>
              <div className="font-black text-sm text-slate-700">{fmt(state.safety.price)}</div>
            </div>
          )}
          {state.phoneControl?.price > 0 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-slate-100">
              <div className="text-sm font-bold text-slate-800">{state.phoneControl.label}</div>
              <div className="font-black text-sm text-slate-700">{fmt(state.phoneControl.price)}</div>
            </div>
          )}
          <div className="flex justify-between items-center px-4 py-4 bg-slate-900">
            <div className="font-black text-white text-sm">РАЗОМ</div>
            <div className="font-black text-blue-400 text-xl">{fmt(total)}</div>
          </div>
        </div>
      </div>

      {/* Форма */}
      <div className="space-y-3">
        <div className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
          Оформити та отримати подарунки
        </div>
        <input
          type="text"
          placeholder="Ваше ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm font-medium"
        />
        <input
          type="tel"
          placeholder="+380 (XX) XXX-XX-XX"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm font-medium"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          Оформити замовлення та отримати подарунок 🎁
        </button>
        <p className="text-center text-xs text-slate-400">
          Менеджер зв'яжеться протягом 15 хвилин
        </p>
      </div>
    </div>
  );
}

// --- Екран успіху ---
function StepSuccess({ order }: { order: any }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-5">
      <div className="text-6xl animate-bounce">🎉</div>
      <h2 className="text-2xl font-black text-slate-900">Замовлення прийнято!</h2>
      <p className="text-slate-500 text-sm max-w-xs">
        Менеджер зв'яжеться з вами протягом 15 хвилин у Telegram або Viber.
      </p>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 w-full max-w-xs">
        <div className="text-xs text-blue-500 font-bold uppercase mb-1">Підсумок</div>
        <div className="text-2xl font-black text-slate-900">{fmt(order.total)}</div>
        <div className="text-sm text-slate-500 mt-1">{order.customer.name} • {order.customer.phone}</div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 w-full max-w-xs text-left">
        <div className="text-sm font-black text-amber-800">🎁 Ваш подарунок:</div>
        <div className="text-xs text-amber-700 mt-1">Менеджер надішле креслення та інструкцію разом з підтвердженням замовлення.</div>
      </div>
    </div>
  );
}

// ============================================================
// 🚀 ГОЛОВНИЙ КОМПОНЕНТ
// ============================================================

const STEP_LABELS = ["Фурнітура", "Матеріали", "Автоматика", "Підсумок"];

const FLOW_HARDWARE = [1, 2, 3, 4]; // ?start=hardware
const FLOW_ENGINE   = [3, 1, 2, 4]; // ?start=engine

export default function App() {
  // --- Парсинг URL ---
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const startParam = params.get("start");
  const flow = startParam === "engine" ? FLOW_ENGINE : FLOW_HARDWARE;

  const [flowIndex, setFlowIndex] = useState(0); // поточний індекс у flow
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState<any>(null);

  // --- Стан форми ---
  const [state, setState] = useState({
    weight: 400,
    hardware: HARDWARE_CATALOG[0],
    addons: [] as string[],
    profileMeters: 6,
    engine: ENGINES_CATALOG[0],
    wifi: false,
    gearRack: ENGINE_OPTIONS.gearRack[0],
    safety: ENGINE_OPTIONS.safety[0],
    phoneControl: ENGINE_OPTIONS.phoneControl[0],
  });

  // --- Підрахунок суми ---
  const total = (() => {
    let sum = 0;
    if (state.hardware) sum += state.hardware.price;
    state.addons.forEach((id) => {
      const a = ADDONS_CATALOG.find((x) => x.id === id);
      if (!a) return;
      sum += a.type === "per_meter" ? (state.profileMeters || 6) * a.pricePerMeter! : a.price!;
    });
    if (state.engine) {
      sum += state.wifi ? state.engine.wifiPrice : state.engine.price;
    }
    sum += state.gearRack?.price || 0;
    sum += state.safety?.price || 0;
    sum += state.phoneControl?.price || 0;
    return sum;
  })();

  const currentStep = flow[flowIndex]; // 1,2,3,4
  const totalSteps = flow.length;
  const isFirst = flowIndex === 0;
  const isLast = flowIndex === totalSteps - 1;

  const goNext = () => setFlowIndex((i) => Math.min(i + 1, totalSteps - 1));
  const goBack = () => setFlowIndex((i) => Math.max(i - 1, 0));

  const handleSubmit = (ord: any) => {
    setOrder(ord);
    setSubmitted(true);
  };

  if (submitted && order) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white font-sans pt-10">
        <StepSuccess order={order} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Sticky Summary */}
      <StickySummary total={total} />

      {/* Progress Bar */}
      <ProgressBar
        current={flowIndex + 1}
        total={totalSteps}
        labels={flow.map((s) => STEP_LABELS[s - 1])}
      />

      {/* Контент кроку */}
      <div className="flex-1 pb-28 mt-2">
        {currentStep === 1 && (
          <StepHardware state={state} setState={setState} />
        )}
        {currentStep === 2 && (
          <StepAddons state={state} setState={setState} />
        )}
        {currentStep === 3 && (
          <StepEngine state={state} setState={setState} />
        )}
        {currentStep === 4 && (
          <StepSummary state={state} total={total} onSubmit={handleSubmit} />
        )}
      </div>

      {/* Sticky Buttons (не показуємо на останньому кроці — там кнопка в формі) */}
      {currentStep !== 4 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-4 py-3 flex gap-3 z-40 shadow-xl">
          {!isFirst && (
            <button
              onClick={goBack}
              className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 font-black text-sm text-slate-600 active:scale-95 transition-all"
            >
              ← Назад
            </button>
          )}
          <button
            onClick={goNext}
            className="flex-[2] py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            {isLast ? "Переглянути підсумок →" : "Далі →"}
          </button>
        </div>
      )}
    </div>
  );
}
