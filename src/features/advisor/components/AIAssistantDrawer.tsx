import React, { useState } from 'react';
import { AirQualitySnapshot, UserPreferences } from '@/types';
import { GeminiAdvisorService, ChatMessage } from '@/lib/gemini/advisor-service';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Footprints 
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: AirQualitySnapshot | null;
  preferences: UserPreferences;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  snapshot,
  preferences,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content:
        'Hello! I am your BreatheWise AI Assistant. I can help interpret current air quality numbers, suggest schedule adjustments, explain commute emission trade-offs, or share indoor source reduction steps. What would you like to explore?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const advisor = GeminiAdvisorService.getInstance();
  const isGeminiLive = advisor.isAvailable();

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const reply = await advisor.sendChatMessage(text, snapshot, preferences);
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Unable to reach the assistant service at this moment. Please refer to the verified dashboard advice.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const suggestedPrompts = [
    { label: 'Can I move my walk?', icon: <Footprints className="w-3 h-3" /> },
    { label: 'What does this reading mean?', icon: <Compass className="w-3 h-3" /> },
    { label: 'How can I reduce cooking smoke?', icon: <Flame className="w-3 h-3" /> },
    { label: 'Compare my commute options.', icon: <CheckCircle2 className="w-3 h-3" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-navy-900 border-l border-slate-700 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-navy-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white">BreatheWise Assistant</h2>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    isGeminiLive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isGeminiLive ? 'Gemini 1.5' : 'Deterministic Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Grounded strictly in closed environmental context</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visible Context Panel */}
        <div className="px-5 py-2.5 bg-navy-950/70 border-b border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-mono">
            <span>
              <strong>Context AQI:</strong>{' '}
              {snapshot && snapshot.aqi_value !== null ? `${snapshot.aqi_value} (${snapshot.aqi_scale})` : 'Unavailable'}
            </span>
            <span>
              <strong>Freshness:</strong>{' '}
              <span
                className={
                  snapshot?.freshness === 'fresh'
                    ? 'text-emerald-400'
                    : snapshot?.freshness === 'stale'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }
              >
                {snapshot?.freshness || 'N/A'}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Source: {snapshot?.provider.name || 'Unconfigured'}</span>
            <span>Type: {snapshot?.value_type || 'Unknown'}</span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender !== 'user' && (
                <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0 border border-teal-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                <p>{m.content}</p>
                <span className="block mt-1.5 text-[9px] text-slate-400 text-right font-mono">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 text-teal-400 animate-spin" />
              <span>Verifying closed context and formulating safe response...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-navy-950/90 border-t border-slate-800">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Suggested Prompts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.label)}
                disabled={isSending}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-navy-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about air quality, outdoor plans, or indoor safety..."
              className="flex-1 px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              disabled={isSending}
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-slate-500 text-center">
            Untrusted user content is delimited. No clinical diagnoses or medical advice provided.
          </div>
        </div>
      </div>
    </div>
  );
};
