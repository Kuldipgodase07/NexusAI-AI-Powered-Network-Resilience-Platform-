import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Send, X, Minimize2, Sparkles, Wifi, AlertTriangle, Activity } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const STARTER_PROMPTS = [
  "Why is Branch A experiencing latency?",
  "Show high-risk devices",
  "Predict WAN failures",
  "Summarize active incidents",
];

const CANNED: Record<string, string> = {
  "why is branch a experiencing latency?": "Branch A latency spike (+340%) is traced to **WAN-EAST-01 link saturation at 87% capacity**. Root cause: upstream provider maintenance increased contention. AI recommends pre-routing 30% of Branch A traffic via WAN-WEST-02. Shall I initiate?",
  "show high-risk devices": "**Top 3 High-Risk Devices:**\n\n🔴 AS-CORE-01 — Packet loss 15%, SFP degradation\n🟡 DIST-CENT-01 — CPU 79%, nearing threshold\n🟡 EDGE-RTR-02 — BGP peer flapping, 2h 8m",
  "predict wan failures": "**WAN Failure Predictions (next 6h):**\n\n⚠️ WAN-EAST-01: 84% confidence saturation in 2h 58m\n⚠️ WAN-EAST-02: 71% confidence BGP instability in 5h 30m\n\nRecommended: pre-provision failover routes now.",
  "summarize active incidents": "**3 Active Incidents:**\n\n🔴 INC-2847 — Core Router Packet Loss (AS-CORE-01) — Remediating\n🟡 INC-2846 — BGP Peer Down (EDGE-RTR-02) — Monitoring\n🟡 INC-2845 — WAN Latency (WAN-EAST-01) — Resolved\n\nExpected full resolution: ~4 minutes.",
};

function getReply(q: string): string {
  return CANNED[q.toLowerCase()] || "I've checked the current telemetry. All monitored systems are reporting. Would you like me to run a detailed diagnostic or generate a network health summary?";
}

export function FloatingCopilot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your NexusAI Copilot. Ask me anything about your network — incidents, predictions, or diagnostics." }
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "ai", text: getReply(text) }]);
    }, 1400 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1BA0D7] to-[#0A84FF] flex items-center justify-center shadow-xl shadow-[#1BA0D7]/40 z-50"
          >
            <Brain className="w-6 h-6 text-white" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center text-[9px] text-white font-bold border-2 border-white">3</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden"
            style={{ width: 360, height: minimized ? 64 : 520 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#1BA0D7] to-[#0A84FF] flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>NexusAI Copilot</div>
                <div className="text-white/70 text-[10px] flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Online · Full network context
                </div>
              </div>
              <button onClick={() => setMinimized(!minimized)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <Minimize2 className="w-3.5 h-3.5 text-white" />
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {!minimized && (
              <>
                {/* Context pills */}
                <div className="flex gap-1.5 px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex-shrink-0 overflow-x-auto">
                  {[
                    { icon: Wifi, label: "98.7% Healthy", color: "#10B981" },
                    { icon: AlertTriangle, label: "3 Incidents", color: "#EF4444" },
                    { icon: Activity, label: "Live Telemetry", color: "#1BA0D7" },
                  ].map(p => {
                    const Icon = p.icon;
                    return (
                      <div key={p.label} className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `${p.color}12`, color: p.color }}>
                        <Icon className="w-3 h-3" />
                        {p.label}
                      </div>
                    );
                  })}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                      {m.role === "ai" && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1BA0D7] to-[#0A84FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-[#1BA0D7] to-[#0A84FF] text-white rounded-tr-sm"
                          : "bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-sm shadow-sm"
                      }`}>
                        {m.text.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1BA0D7] to-[#0A84FF] flex items-center justify-center flex-shrink-0">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                        <div className="flex gap-1 items-center">
                          {[0,1,2].map(i => (
                            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1BA0D7]"
                              animate={{ y: [0,-3,0], opacity: [0.5,1,0.5] }}
                              transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Starter prompts (only shown when messages = 1) */}
                {msgs.length === 1 && (
                  <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
                    {STARTER_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        className="text-[10px] text-left px-2.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#1BA0D7]/40 hover:bg-[#EFF6FF] text-[#475569] hover:text-[#1BA0D7] transition-all leading-snug"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="px-3 pb-3 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-3 py-2 focus-within:border-[#1BA0D7] focus-within:ring-2 focus-within:ring-[#1BA0D7]/15 transition-all">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") send(input); }}
                      placeholder="Ask anything about your network..."
                      className="flex-1 bg-transparent text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
                    />
                    <button
                      onClick={() => send(input)}
                      disabled={!input.trim() || typing}
                      className="w-7 h-7 rounded-xl bg-[#1BA0D7] flex items-center justify-center disabled:opacity-40 hover:bg-[#0A84FF] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
