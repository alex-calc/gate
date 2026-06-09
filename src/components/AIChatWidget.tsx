import React, { useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';
import { useChat as originalUseChat } from '@ai-sdk/react';

// Обхід проблеми з типізацією useChat у новій версії SDK
const useChat = originalUseChat as any;

interface Message {
  id: string;
  role: string;
  content: string;
}

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
  onOpen: () => void;
  onClose: () => void;
}

export function AIChatWidget({ calculatorState, isSubmitted, isOpen, onOpen, onClose }: AIChatWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { gateWidth, gateWeight, guideRailLength, selectedEngine, selectedHardware } = calculatorState;

  const initialMessageContent = React.useMemo(() => {
    const material = gateWeight === 300 ? 'профнастилу або сітки' : gateWeight === 500 ? 'дерева або металу' : 'ковки або фільонки';
    
    if (gateWidth > 4 || gateWeight >= 1000) {
      return `Вітаю! 👋 Бачу, ви придивляєтесь до воріт на ${gateWidth} метрів (${material}). Для таких габаритів я б радив посилену направляючу на ${guideRailLength} м, щоб стулка не провисала з часом. Підказати, які варіанти моторів і фурнітури у нас є для такої ваги?`;
    }
    return `Привіт! 👋 Бачу, ви плануєте акуратні ворота на ${gateWidth} метрів з ${material}. Сюди ідеально підійде направляюча на ${guideRailLength} м. Допоможу підібрати надійну автоматику, щоб працювала без проблем у будь-які морози. Які у вас запитання?`;
  }, [gateWidth, gateWeight, guideRailLength]);

  const chatBody = React.useMemo(() => ({
    context: { gateWidth, gateWeight, guideRailLength, selectedEngine, selectedHardware }
  }), [gateWidth, gateWeight, guideRailLength, selectedEngine, selectedHardware]);

  const initialMessagesList = React.useMemo(() => [
    {
      id: '1',
      role: 'assistant',
      content: initialMessageContent,
    }
  ], [initialMessageContent]);

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: chatBody,
    initialMessages: initialMessagesList,
  });

  // Оновлюємо вітальне повідомлення, якщо користувач змінив параметри, але ще не почав діалог
  useEffect(() => {
    const isChatEmpty = messages.length === 0;
    const isOnlyGreeting = messages.length === 1 && messages[0].role === 'assistant';
    
    if (isChatEmpty || (isOnlyGreeting && messages[0].content !== initialMessageContent)) {
      setMessages([{
        id: 'welcome-message',
        role: 'assistant',
        content: initialMessageContent,
      }]);
    }
  }, [initialMessageContent, messages, setMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className={`fixed right-4 sm:right-6 z-50 transition-all ${isSubmitted ? 'bottom-6' : 'bottom-24 md:bottom-6'}`}>
      {!isOpen ? (
        <button
          onClick={onOpen}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl flex items-center gap-2 group transition-all duration-300 hover:scale-105"
        >
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-30" />
          <Bot className="w-6 h-6 relative z-10" />
          <span className="hidden sm:inline relative z-10 max-w-0 overflow-hidden group-hover:max-w-md transition-all duration-300 ease-out text-sm font-bold whitespace-nowrap pl-1">
            💬 Потрібна допомога? AI підбере комплект!
          </span>
        </button>
      ) : (
        <div className="bg-white border border-slate-200 w-80 sm:w-96 h-[440px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-blue-700 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">Інженер-Консультант</div>
                <div className="text-[10px] text-blue-200 font-mono">Штучний Інтелект</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-xs bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-slate-50/50">
            {messages.map((msg: Message) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'user' && (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
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
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1">
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Запитати про редуктор, вагу, ціну..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
