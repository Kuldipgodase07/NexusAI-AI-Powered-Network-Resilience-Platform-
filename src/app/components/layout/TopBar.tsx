import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Bell, ChevronDown, Settings, LogOut, User,
  Command, AlertCircle, CheckCircle2, Info, Shield, Hexagon
} from "lucide-react";

const C_BLUE = "#049FD9";
const C_TEAL = "#005073";
const C_NAVY = "#00364A";

const notifications = [
  { id:1, type:"critical", title:"Critical: Core Router Packet Loss",  desc:"AS-CORE-01 experiencing 15% packet loss — remediation triggered",  time:"2m ago"  },
  { id:2, type:"warning",  title:"Warning: WAN Latency Spike",         desc:"WAN-EAST-01 latency up 340% — Nexus Predict flagged 2h ago",       time:"8m ago"  },
  { id:3, type:"success",  title:"Remediation Complete",               desc:"Nexus Resolve successfully rerouted traffic via WAN-WEST-02",        time:"15m ago" },
  { id:4, type:"info",     title:"Myalosis Fine-tune Complete",        desc:"Model nexus-7b-ft01 training job FT-447 completed — 97.4% accuracy", time:"31m ago" },
];

const pageLabels: Record<string, string[]> = {
  home:         ["Nexus AI", "Command Center"],
  agents:       ["Nexus AI", "AI Agents"],
  analytics:    ["Nexus AI", "Analytics & Intelligence"],
  cisco:        ["Nexus AI", "Cisco Integration Hub"],
  connectivity: ["Nexus AI", "Network Operations"],
  myalosis:     ["Nexus AI", "Myalosis Core Console"],
  rca:          ["Nexus AI", "Root Cause Explorer"],
  prediction:   ["Nexus AI", "Failure Prediction"],
  remediation:  ["Nexus AI", "Autonomous Remediation"],
  security:     ["Nexus AI", "Security & Compliance"],
  admin:        ["Nexus AI", "Settings & Administration"],
  assistant:    ["Nexus AI", "AI Operations"],
};

interface TopBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function TopBar({ currentPage, onNavigate, onLogout }: TopBarProps) {
  const [showNotif, setShowNotif]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const crumbs = pageLabels[currentPage] || ["Nexus AI", "Dashboard"];
  const unread = notifications.filter(n => n.type === "critical" || n.type === "warning").length;

  const iconMap  = { critical: AlertCircle, warning: AlertCircle, success: CheckCircle2, info: Info };
  const colorMap = { critical: "#E2231A", warning: "#FF7300", success: "#6EBE4A", info: C_BLUE };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 relative z-20 flex-shrink-0"
      style={{ borderBottom: "1px solid #E8ECF0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: C_BLUE }}>
            <Hexagon className="w-3 h-3 text-white" />
          </div>
          <span style={{ color: "#8C949A" }}>{crumbs[0]}</span>
        </div>
        {crumbs.slice(1).map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span style={{ color: "#D4D9DD" }}>/</span>
            <span className="font-semibold" style={{ color: "#1D2228" }}>{c}</span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-text transition-all"
          style={{ backgroundColor: "#F5F7FA", borderColor: "#E8ECF0" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C_BLUE)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8ECF0")}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#8C949A" }} />
          <span className="text-sm flex-1" style={{ color: "#8C949A" }}>Search agents, events, models...</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold flex-shrink-0"
            style={{ borderColor: "#D4D9DD", color: "#8C949A" }}>
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Status pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: "#E0F5E8", color: "#3D8B3D", border: "1px solid #B8E0C0" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#6EBE4A" }} />
          98.7% Healthy
        </div>

        {/* Ask AI */}
        <button onClick={() => onNavigate("assistant")}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold transition-all"
          style={{ backgroundColor: C_BLUE, boxShadow: `0 2px 8px ${C_BLUE}40` }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0390C5")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = C_BLUE)}>
          Ask Nexus AI
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{ color: "#4D5358" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F7FA"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
            <Bell className="w-4.5 h-4.5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#E2231A" }}>{unread}</span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-8, scale:0.96 }}
                className="absolute right-0 top-12 w-96 bg-white rounded-2xl overflow-hidden z-50"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid #E8ECF0" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #E8ECF0" }}>
                  <span className="font-semibold text-sm" style={{ color: "#1D2228" }}>Notifications</span>
                  <button className="text-xs font-semibold" style={{ color: C_BLUE }}>Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => {
                    const Icon = iconMap[n.type as keyof typeof iconMap];
                    const color = colorMap[n.type as keyof typeof colorMap];
                    return (
                      <div key={n.id} className="p-4 hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                        style={{ borderBottom: "1px solid #F5F7FA" }}>
                        <div className="flex gap-3">
                          <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate" style={{ color: "#1D2228" }}>{n.title}</div>
                            <div className="text-xs mt-0.5" style={{ color: "#4D5358" }}>{n.desc}</div>
                            <div className="text-[10px] mt-1" style={{ color: "#8C949A" }}>{n.time}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 text-center" style={{ borderTop: "1px solid #E8ECF0" }}>
                  <button className="text-sm font-semibold" style={{ color: C_BLUE }}>View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-xl transition-colors"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F5F7FA")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>JC</div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold leading-none" style={{ color: "#1D2228" }}>James Chen</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#8C949A" }}>Enterprise Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5" style={{ color: "#8C949A" }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity:0, y:-8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-8, scale:0.96 }}
                className="absolute right-0 top-12 w-60 bg-white rounded-2xl overflow-hidden z-50"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid #E8ECF0" }}>
                <div className="p-4" style={{ borderBottom: "1px solid #E8ECF0" }}>
                  <div className="font-bold text-sm" style={{ color: "#1D2228" }}>James Chen</div>
                  <div className="text-xs mt-0.5" style={{ color: "#8C949A" }}>james.chen@acme.corp</div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Shield className="w-3 h-3" style={{ color: C_BLUE }} />
                    <span className="text-xs font-semibold" style={{ color: C_BLUE }}>Enterprise Administrator</span>
                  </div>
                </div>
                <div className="p-2">
                  {[
                    { icon: User,     label: "Profile Settings" },
                    { icon: Settings, label: "Preferences"      },
                    { icon: Shield,   label: "Security Center"  },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.label} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors"
                        style={{ color: "#4D5358" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F7FA"; (e.currentTarget as HTMLElement).style.color = "#1D2228"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#4D5358"; }}>
                        <Icon className="w-4 h-4" />{item.label}
                      </button>
                    );
                  })}
                  <div className="mt-1 pt-1" style={{ borderTop: "1px solid #E8ECF0" }}>
                    <button onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
                      style={{ color: "#E2231A" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FFF0EE")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {(showNotif || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotif(false); setShowProfile(false); }} />
      )}
    </header>
  );
}
