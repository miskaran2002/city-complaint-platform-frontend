'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore'; // ⚠️ তোমার path অনুযায়ী ঠিক আছে কিনা দেখো

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

// 🤖 ছোট্ট animated robot avatar
function RobotAvatar({ size = 22 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      animate={{ rotate: [0, -4, 4, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* antenna */}
      <motion.circle
        cx="24" cy="6" r="2.5" fill="#fbbf24"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <line x1="24" y1="8.5" x2="24" y2="13" stroke="#fff" strokeWidth="2" />
      {/* head */}
      <rect x="9" y="13" width="30" height="24" rx="9" fill="#ffffff" />
      {/* eyes */}
      <motion.circle
        cx="19" cy="25" r="3.2" fill="#7c3aed"
        animate={{ scaleY: [1, 0.15, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4 }}
      />
      <motion.circle
        cx="29" cy="25" r="3.2" fill="#7c3aed"
        animate={{ scaleY: [1, 0.15, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4 }}
      />
      {/* ears */}
      <rect x="4" y="21" width="5" height="10" rx="2.5" fill="#c4b5fd" />
      <rect x="39" y="21" width="5" height="10" rx="2.5" fill="#c4b5fd" />
    </motion.svg>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500 dark:text-white/60">Thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const { token } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! I'm CityPulse Assistant. Ask me about complaints, payments, or your complaint status." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, loading]);

  if (!token) return null;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: data.success ? data.data.reply : 'দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করো।',
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Network সমস্যা হয়েছে, আবার চেষ্টা করো।' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 w-[320px] sm:w-[370px] h-[460px] rounded-2xl shadow-2xl border border-white/10 bg-white dark:bg-[#0f0524] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#7c3aed] to-[#4C1D95] text-white flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <RobotAvatar size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight">CityPulse Assistant</div>
                <div className="text-[11px] text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg leading-none">
                ×
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {m.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#a855f7] to-[#4C1D95] flex items-center justify-center shrink-0">
                      <RobotAvatar size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#7c3aed] text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#a855f7] to-[#4C1D95] flex items-center justify-center shrink-0">
                    <RobotAvatar size={14} />
                  </div>
                  <div className="bg-gray-100 dark:bg-white/10 px-3 py-2 rounded-xl rounded-bl-sm">
                    <ThinkingDots />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-gray-200 dark:border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-[#7c3aed] text-gray-800 dark:text-white"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-sm font-medium hover:bg-[#6d28d9] disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#a855f7] to-[#4C1D95] shadow-2xl flex items-center justify-center text-white"
        aria-label="Open chat assistant"
      >
        {/* pulsing glow ring — bot "alive" acche eita bojhay */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-[#a855f7]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {open ? (
          <span className="text-2xl leading-none relative z-10">×</span>
        ) : (
          <span className="relative z-10">
            <RobotAvatar size={30} />
          </span>
        )}
      </motion.button>
    </div>
  );
}