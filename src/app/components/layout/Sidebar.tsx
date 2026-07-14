import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Brain, GitBranch, Zap, Activity, BarChart3,
  Settings, ChevronRight, ChevronLeft, Hexagon, Network, Shield, Cpu
} from "lucide-react";
import type { UserPersona } from "../auth/RoleSelection";

const C_BLUE = "#049FD9";
const C_TEAL = "#005073";

const navSections = [
  {
    label: "Platform",
    items: [
      { id: "home",         icon: LayoutDashboard, label: "Command Center",       badge: null    },
      { id: "agents",       icon: Brain,           label: "AI Agents",            badge: "147"   },
      { id: "analytics",    icon: BarChart3,       label: "Analytics",            badge: null    },
    ],
  },
  {
    label: "Cisco",
    items: [
      { id: "cisco",        icon: Network,         label: "Integration Hub",      badge: "Live"  },
      { id: "connectivity", icon: Activity,        label: "Network Ops",          badge: "3"     },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "myalosis",     icon: Cpu,             label: "Myalosis Core",        badge: null    },
      { id: "rca",          icon: GitBranch,       label: "Root Cause",           badge: "3"     },
      { id: "prediction",   icon: Zap,             label: "Failure Predict",      badge: "4"     },
      { id: "remediation",  icon: Zap,             label: "Remediation",          badge: "2"     },
    ],
  },
  {
    label: "Governance",
    items: [
      { id: "security",     icon: Shield,          label: "Security & Compliance", badge: null   },
      { id: "admin",        icon: Settings,        label: "Settings",             badge: null    },
    ],
  },
];

const personaConfig: Record<UserPersona, { label: string; color: string }> = {
  engineer:  { label: "Platform Engineer",     color: C_BLUE    },
  architect: { label: "Solutions Architect",   color: "#7C3AED" },
  manager:   { label: "IT Operations Manager", color: C_TEAL    },
  cio:       { label: "CIO / Executive",       color: "#005A9C" },
};

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  persona: UserPersona;
  onSwitchPersona: () => void;
}

export function Sidebar({ activePage, onNavigate, persona, onSwitchPersona }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pc = personaConfig[persona];

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 248 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full flex-shrink-0 overflow-hidden bg-white"
      style={{ borderRight: "1px solid #E2E8F0" }}>

      {/* Logo */}
      <div className="flex items-center h-16 px-4 flex-shrink-0" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
            <Hexagon className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }} transition={{ duration:0.15 }}>
                <div className="font-bold text-sm leading-tight" style={{ color: "#1D2228" }}>Nexus AI</div>
                <div className="text-[9px] font-semibold" style={{ color: C_BLUE }}>Cisco Alliance · Enterprise</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Persona badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.button
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onSwitchPersona}
            className="mx-3 mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors text-left"
            style={{ backgroundColor: `${pc.color}0D`, border: `1px solid ${pc.color}25` }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${pc.color}18`)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${pc.color}0D`)}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: pc.color }}>{pc.label[0]}</div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate leading-tight" style={{ color: "#1D2228" }}>{pc.label}</div>
              <div className="text-[9px] font-medium" style={{ color: pc.color }}>Switch workspace →</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 mt-2 space-y-4">
        {navSections.map(section => (
          <div key={section.label}>
            {!collapsed && (
              <div className="px-3 pb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#B0BAC4" }}>
                  {section.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    whileHover={{ x: collapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.98 }}
                    title={collapsed ? item.label : undefined}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl transition-all duration-150 relative"
                    style={{
                      backgroundColor: isActive ? `${C_BLUE}12` : "transparent",
                      color: isActive ? C_BLUE : "#64748B",
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F7FA";
                        (e.currentTarget as HTMLElement).style.color = "#1D2228";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#64748B";
                      }
                    }}>
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                        style={{ backgroundColor: C_BLUE }}
                      />
                    )}
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                          className="flex items-center justify-between flex-1 min-w-0">
                          <span className="text-xs font-medium truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1"
                              style={
                                isActive
                                  ? { backgroundColor: `${C_BLUE}20`, color: C_BLUE }
                                  : item.badge === "Live"
                                    ? { backgroundColor: "#E0F5E8", color: "#3D8B3D" }
                                    : { backgroundColor: "#FFF3E0", color: "#FF7300" }
                              }>
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: C_BLUE }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ backgroundColor: "white", border: "1px solid #D4D9DD", color: "#8C949A", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C_BLUE; (e.currentTarget as HTMLElement).style.borderColor = C_BLUE; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8C949A"; (e.currentTarget as HTMLElement).style.borderColor = "#D4D9DD"; }}>
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
