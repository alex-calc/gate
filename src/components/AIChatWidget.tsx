import React, { useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';
import { useChat } from 'ai/react';



interface AIChatWidgetProps {
  calculatorState: {
    gateWidth: number;
    gateWeight: number;
    selectedEngine: string;
    selectedHardware: string;
    guideRailLength?: number;
  };
  isSubmitted: boolean;
  isOpen: boolean;
  locale: string;
  onOpen: () => void;
  onClose: () => void;
}

export function AIChatWidget({ calculatorState, isSubmitted, isOpen, locale, onOpen, onClose }: AIChatWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7));

  const [utmCampaign, setUtmCampaign] = React.useState<string>('');
  const [isNightTime, setIsNightTime] = React.useState<boolean>(false);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmCampaign(params.get('utm_campaign') || '');
    
    const hour = new Date().getHours();
    setIsNightTime(hour >= 21 || hour < 8);

    const timer = setTimeout(() => {
      if (!hasAutoOpened.current) {
        hasAutoOpened.current = true;
        onOpen();
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [onOpen]);

  const { gateWidth, gateWeight, guideRailLength, selectedEngine, selectedHardware } = calculatorState;

  const initialMessageContent = React.useMemo(() => {
    let msg = '';
    const isRu = locale === 'ru';
    if (utmCampaign === 'furnitura') {
      msg = isRu ? 'Привет! Я Алексей, ведущий ИИ-инженер нашего сервиса. Вижу, вы подбираете надежную фурнитуру...' : 'Привіт! Я Олексій, провідний ШІ-інженер нашого сервісу. Бачу, ви підбираєте надійну фурнітуру...';
    } else if (utmCampaign === 'automatika') {
      msg = isRu ? 'Привет! Я Алексей, ведущий ИИ-инженер нашего сервиса. Помочь выбрать надежную автоматику с металлическим редуктором...' : 'Привіт! Я Олексій, провідний ШІ-інженер нашого сервісу. Допомогти обрати надійну автоматику з металевим редуктором...';
    } else {
      const material = gateWeight === 300 
        ? (isRu ? 'профнастила или сетки' : 'профнастилу або сітки') 
        : gateWeight === 500 
          ? (isRu ? 'дерева или металла' : 'дерева або металу') 
          : (isRu ? 'ковки или филенки' : 'ковки або фільонки');
      if (gateWidth > 4 || gateWeight >= 1000) {
        msg = isRu 
          ? `Привет! Я Алексей, ведущий ИИ-инженер нашего сервиса. Вижу, вы присматриваетесь к воротам на ${gateWidth} метров (${material}). Для таких габаритов я бы советовал усиленную направляющую на ${guideRailLength} м, чтобы створка не провисала со временем. Подсказать, какие варианты моторов и фурнитуры у нас есть для такого веса?`
          : `Привіт! Я Олексій, провідний ШІ-інженер нашого сервісу. Бачу, ви придивляєтесь до воріт на ${gateWidth} метрів (${material}). Для таких габаритів я б радив посилену направляючу на ${guideRailLength} м, щоб стулка не провисала з часом. Підказати, які варіанти моторів і фурнітури у нас є для такої ваги?`;
      } else {
        msg = isRu
          ? `Привет! Я Алексей, ведущий ИИ-инженер нашего сервиса. Вижу, вы планируете аккуратные ворота на ${gateWidth} метров из ${material}. Сюда идеально подойдет направляющая на ${guideRailLength} м. Помогу подобрать надежную автоматику, чтобы работала без проблем в любые морозы. Какие у вас вопросы?`
          : `Привіт! Я Олексій, провідний ШІ-інженер нашого сервісу. Бачу, ви плануєте акуратні ворота на ${gateWidth} метрів з ${material}. Сюди ідеально підійде направляюча на ${guideRailLength} м. Допоможу підібрати надійну автоматику, щоб працювала без проблем у будь-які морози. Які у вас запитання?`;
      }
    }

    if (isNightTime) {
      msg += isRu 
        ? ` Наш офис сейчас отдыхает, но я работаю 24/7. Давайте просчитаю ваши ворота прямо сейчас, а менеджер свяжется с вами уже утром!`
        : ` Наш офіс зараз відпочиває, але я працюю 24/7. Давайте прорахую ваші ворота прямо зараз, а менеджер зв'яжеться з вами вже вранці!`;
    }
    
    return msg.trim();
  }, [gateWidth, gateWeight, guideRailLength, utmCampaign, isNightTime, locale]);

  const chatBody = React.useMemo(() => ({
    sessionId: sessionIdRef.current,
    locale,
    context: { gateWidth, gateWeight, guideRailLength, selectedEngine, selectedHardware, utmCampaign, isNightTime }
  }), [gateWidth, gateWeight, guideRailLength, selectedEngine, selectedHardware, utmCampaign, isNightTime, locale]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: chatBody,
  });

  // Відображаємо динамічне привітання завжди першим, не втручаючись у внутрішній стан useChat
  const displayMessages = [
    {
      id: 'welcome-message',
      role: 'assistant',
      content: initialMessageContent,
    },
    ...messages,
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const [isLocalSubmitted, setIsLocalSubmitted] = React.useState(false);
  const showSuccess = isSubmitted || isLocalSubmitted;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Regex for Ukrainian phone numbers (+380..., 380..., 095...) with or without spaces/dashes/parens
    const phoneRegex = /(?:\+?38)?[\s\-]?\(?0\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/;
    const digitCount = (input.match(/\d/g) || []).length;
    
    if (phoneRegex.test(input) || digitCount >= 10) {
      setIsLocalSubmitted(true);

      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID';
      
      const text = `🤖 ЛІД З ШІ-ЧАТУ!\n📞 Телефон: ${input}\n📐 Ширина воріт в калькуляторі: ${gateWidth} м\n💬 Останній контекст діалогу: Клієнт залишив телефон в обмін на креслення воріт.`;

      if (botToken !== 'YOUR_TELEGRAM_BOT_TOKEN') {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text })
        }).catch(err => console.error('Telegram error', err));
      } else {
        console.log("Mock Telegram Send:\n", text);
      }
    }
    
    handleSubmit(e);
  };

  return (
    <div className={`fixed right-4 sm:right-6 z-50 transition-all ${showSuccess ? 'bottom-6' : 'bottom-24 md:bottom-6'}`}>
      {!isOpen ? (
        <button
          onClick={onOpen}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl flex items-center gap-2 group transition-all duration-300 hover:scale-105"
        >
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-30" />
          <img src="/assets/alexey.jpg" alt="Alexey" className="w-8 h-8 rounded-full object-cover border border-white/20 relative z-10" />
          <span className="hidden sm:inline relative z-10 max-w-0 overflow-hidden group-hover:max-w-md transition-all duration-300 ease-out text-sm font-bold whitespace-nowrap pl-1">
            {locale === 'ru' ? '💬 Нужна помощь? Алексей подберет комплект!' : '💬 Потрібна допомога? Олексій підбере комплект!'}
          </span>
        </button>
      ) : (
        <div className="bg-white border border-slate-200 w-80 sm:w-96 h-[440px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-sm relative shrink-0 bg-white/20">
                  <img src="/assets/alexey.jpg" alt="Alexey" className="w-full h-full object-cover" />
                </div>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-blue-700 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">{locale === 'ru' ? 'Алексей' : 'Олексій'}</div>
                <div className="text-[10px] text-blue-200 font-mono">{locale === 'ru' ? 'ИИ-Инженер' : 'ШІ-Інженер'}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-xs bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {showSuccess ? (
            <div className="flex-1 min-h-0 p-6 overflow-y-auto flex flex-col items-center text-center bg-slate-50 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1 shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div className="space-y-3 text-slate-700 text-sm">
                <p className="font-semibold text-lg text-slate-900 leading-tight">Дякую!<br/>Ваш номер телефону зафіксовано.</p>
                <p>Параметри розрахунку фурнітури та автоматики під ваші ворота збережено.</p>
                <p className="bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100">
                  🎁 Як і обіцяли, тримайте повний пакет заводської технічної документації на 7-метровий каркас (оптимально для прорізів в'їзду 4-4.5м):
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full mt-2">
                <a 
                  href="https://drive.google.com/file/d/1zQyqtbKL4bTtohPNQuT5i9XvguLnxbXa/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium py-3 px-4 rounded-xl shadow-md transition-all flex items-center gap-2 group leading-tight"
                >
                  <span className="text-xl shrink-0 group-hover:-translate-y-0.5 transition-transform">📥</span> 
                  <span className="text-left">Завантажити схему монтажу воріт та автоматики</span>
                </a>
                <a 
                  href="https://drive.google.com/file/d/1P36xv4sgQhTCM_pj3tg_wCUIsX_EgSnf/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-medium py-3 px-4 rounded-xl shadow-md transition-all flex items-center gap-2 group leading-tight"
                >
                  <span className="text-xl shrink-0 group-hover:-translate-y-0.5 transition-transform">📐</span>
                  <span className="text-left">Завантажити готове інженерне креслення каркаса</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Chat area */}
              <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain space-y-4 text-[15px] bg-slate-50/50 antialiased subpixel-antialiased" data-lenis-prevent>
                {displayMessages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role !== 'user' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 overflow-hidden shadow-sm border border-slate-200 bg-white">
                        <img src="/assets/alexey.jpg" alt="Alexey" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm font-medium'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                      }`}
                    >
                      {/* Basic markdown-like rendering for bold text */}
                      {(msg.content || '').split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                          {line}
                          {i !== (msg.content || '').split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 overflow-hidden shadow-sm border border-slate-200 bg-white">
                      <img src="/assets/alexey.jpg" alt="Alexey" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex justify-center p-3">
                    <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100 max-w-[90%] text-center">
                      Помилка: {error.message}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Запитати про редуктор, вагу, ціну..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input || !input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
