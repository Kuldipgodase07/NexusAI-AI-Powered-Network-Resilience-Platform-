import { useState } from "react";
import { motion } from "motion/react";
import { Wifi, Network, Building2, Monitor, BarChart3, ArrowRight, CheckCircle2, Shield, Cpu, TrendingUp } from "lucide-react";

export type UserPersona = "engineer" | "architect" | "manager" | "cio";

interface RoleSelectionProps {
  onSelect: (persona: UserPersona) => void;
}

const roles = [
  {
    id: "engineer" as UserPersona,
    title: "Network Operations Engineer",
    subtitle: "NOC · Tier 2/3 Support",
    desc: "Resolve incidents fast, monitor device health, and run diagnostics across the network fabric.",
    icon: Monitor,
    color: "#1BA0D7",
    gradient: "from-[#1BA0D7] to-[#0A84FF]",
    lightBg: "#EFF6FF",
    highlights: ["Active Alerts & Incident Queue", "Device Health Monitoring", "Latency & Packet Loss", "AI-Driven Recommendations"],
    badge: "Operational Focus",
  },
  {
    id: "architect" as UserPersona,
    title: "Network Architect",
    subtitle: "Infrastructure Design · Capacity",
    desc: "Explore topology, plan capacity, forecast risk, and design for maximum resilience.",
    icon: Network,
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
    lightBg: "#F5F3FF",
    highlights: ["Interactive Topology Explorer", "Capacity Planning", "Risk Forecast Maps", "Architecture Insights"],
    badge: "Design Focus",
  },
  {
    id: "manager" as UserPersona,
    title: "NOC Manager",
    subtitle: "Operations Management · SLA",
    desc: "Track SLA compliance, manage escalations, oversee team performance, and drive operational efficiency.",
    icon: Building2,
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#D97706]",
    lightBg: "#FFFBEB",
    highlights: ["SLA Compliance Tracker", "Team Performance Metrics", "Escalation Management", "Service Availability"],
    badge: "Management Focus",
  },
  {
    id: "cio" as UserPersona,
    title: "CIO / IT Director",
    subtitle: "Executive · Business Impact",
    desc: "Monitor business continuity, track ROI, assess strategic risk, and present executive-ready reports.",
    icon: TrendingUp,
    color: "#10B981",
    gradient: "from-[#10B981] to-[#059669]",
    lightBg: "#F0FDF4",
    highlights: ["Resilience Score & ROI", "Downtime Cost Analysis", "Executive KPI Cards", "Strategic Recommendations"],
    badge: "Executive Focus",
  },
];

export function RoleSelection({ onSelect }: RoleSelectionProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<UserPersona | null>(null);

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1BA0D7] to-[#0A84FF] flex items-center justify-center">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#0F172A] text-sm" style={{ fontFamily: "Sora, sans-serif" }}>NexusAI</div>
            <div className="text-[10px] text-[#64748B]">Network Resilience Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          Authentication complete
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl"
        >
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#1BA0D7]/10 text-[#1BA0D7] text-xs font-semibold px-4 py-2 rounded-full mb-4 border border-[#1BA0D7]/20">
              <Shield className="w-3.5 h-3.5" />
              Role-Based Experience
            </div>
            <h1 className="text-4xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
              Select Your Role
            </h1>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              NexusAI adapts to your workflow. Choose your role to get a personalized dashboard tailored to your goals.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {roles.map((role, i) => {
              const Icon = role.icon;
              const isSelected = selected === role.id;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelected(role.id)}
                  onMouseEnter={() => setHovered(role.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "shadow-xl"
                      : "border-[#E2E8F0] hover:border-gray-300 hover:shadow-lg"
                  }`}
                  style={isSelected ? { borderColor: role.color, boxShadow: `0 20px 40px ${role.color}15` } : {}}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: role.color }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`} style={{ boxShadow: `0 8px 20px ${role.color}30` }}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}15`, color: role.color }}>
                          {role.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0F172A] text-base leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>{role.title}</h3>
                      <div className="text-xs text-[#64748B] mt-0.5">{role.subtitle}</div>
                    </div>
                  </div>

                  <p className="text-sm text-[#475569] leading-relaxed mb-4">{role.desc}</p>

                  <div className="space-y-1.5">
                    {role.highlights.map(h => (
                      <div key={h} className="flex items-center gap-2 text-xs text-[#64748B]">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
                        {h}
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 pt-4 border-t flex items-center gap-2 text-sm font-semibold"
                      style={{ borderColor: `${role.color}20`, color: role.color }}
                    >
                      <span>Your dashboard is ready</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Continue button */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              onClick={handleContinue}
              disabled={!selected}
              whileHover={selected ? { scale: 1.02 } : {}}
              whileTap={selected ? { scale: 0.98 } : {}}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={
                selected
                  ? {
                      background: `linear-gradient(135deg, ${roles.find(r=>r.id===selected)?.color}, #0A84FF)`,
                      color: "white",
                      boxShadow: `0 12px 30px ${roles.find(r=>r.id===selected)?.color}40`,
                    }
                  : { background: "#E2E8F0", color: "#94A3B8" }
              }
            >
              {selected ? `Enter as ${roles.find(r => r.id === selected)?.title.split(" ")[0]} ${roles.find(r => r.id === selected)?.title.split(" ")[1]}` : "Select a role to continue"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-xs text-[#94A3B8]">You can switch roles anytime from your profile settings</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
