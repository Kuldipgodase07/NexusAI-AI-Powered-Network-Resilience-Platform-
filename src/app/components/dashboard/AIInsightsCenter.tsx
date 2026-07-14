import { useState } from "react";
import { motion } from "motion/react";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap, ChevronRight, BarChart3, Activity } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const predictions = [
  {
    id: "P-1042", title: "BGP Route Instability", node: "AS-CORE-01", eta: "1h 43m",
    confidence: 91, severity: "critical", impact: "High", affectedNodes: 47,
    desc: "Pattern analysis indicates BGP peer flapping sequence similar to incident INC-2731. Recommend pre-emptive failover.",
    actions: ["Enable BFD on peer", "Pre-provision backup route", "Notify NOC team"]
  },
  {
    id: "P-1041", title: "WAN Link Saturation", node: "WAN-EAST-01", eta: "2h 58m",
    confidence: 84, severity: "warning", impact: "Medium", affectedNodes: 12,
    desc: "Traffic forecasting model predicts sustained load exceeding 95% capacity threshold within 3 hours.",
    actions: ["Redistribute traffic via WAN-WEST-02", "Enable QoS prioritization", "Alert capacity team"]
  },
  {
    id: "P-1040", title: "STP Loop Risk", node: "DIST-CENT-01", eta: "4h 12m",
    confidence: 76, severity: "warning", impact: "Low", affectedNodes: 8,
    desc: "Spanning tree topology change detected across distribution layer. Risk of transient loop during scheduled maintenance.",
    actions: ["Verify RSTP configuration", "Review port states", "Schedule off-hours maintenance"]
  },
  {
    id: "P-1039", title: "OSPF Neighbor Timeout", node: "EDGE-RTR-03", eta: "6h 30m",
    confidence: 68, severity: "info", impact: "Low", affectedNodes: 3,
    desc: "Hello packet intervals showing inconsistency. Possible hardware timer drift on edge router.",
    actions: ["Check NTP sync", "Verify hello/dead intervals", "Monitor neighbor state"]
  },
];

const forecastData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  risk: Math.max(10, Math.min(95, 30 + Math.sin(i * 0.4) * 20 + (i > 10 && i < 14 ? 40 : 0))),
  baseline: 25,
}));

const radarData = [
  { subject: "Routing", A: 92, fullMark: 100 },
  { subject: "Switching", A: 87, fullMark: 100 },
  { subject: "WAN", A: 74, fullMark: 100 },
  { subject: "Security", A: 96, fullMark: 100 },
  { subject: "Cloud", A: 89, fullMark: 100 },
  { subject: "Wireless", A: 91, fullMark: 100 },
];

const riskByDomain = [
  { domain: "Core Routing", score: 87, delta: -3 },
  { domain: "WAN Links", score: 64, delta: -12 },
  { domain: "Distribution", score: 79, delta: +2 },
  { domain: "Access Layer", score: 94, delta: +1 },
  { domain: "Cloud Gateways", score: 91, delta: 0 },
  { domain: "Edge Routers", score: 72, delta: -5 },
];

const SEVERITY_STYLE: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  critical: { bg: "bg-[#FEF2F2]", border: "border-[#EF4444]/30", badge: "bg-[#EF4444]/10 text-[#EF4444]", text: "text-[#EF4444]" },
  warning:  { bg: "bg-[#FFFBEB]", border: "border-[#F59E0B]/30", badge: "bg-[#F59E0B]/10 text-[#F59E0B]", text: "text-[#F59E0B]" },
  info:     { bg: "bg-[#EFF6FF]", border: "border-[#1BA0D7]/30", badge: "bg-[#1BA0D7]/10 text-[#1BA0D7]", text: "text-[#1BA0D7]" },
};

export function AIInsightsCenter() {
  const [selected, setSelected] = useState<string | null>("P-1042");
  const selectedPred = predictions.find(p => p.id === selected);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>AI Insights Center</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Predictive intelligence — {predictions.length} active forecasts · Model accuracy 94.2%</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#8B5CF6]/10 px-3 py-1.5 rounded-lg border border-[#8B5CF6]/20">
            <Brain className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-xs font-semibold">NexusAI v3.2 · Active</span>
          </div>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Predictions", value: "12", icon: Brain, color: "#8B5CF6", sub: "Next 6 hours" },
          { label: "Avg Confidence", value: "87%", icon: TrendingUp, color: "#10B981", sub: "+3% vs last week" },
          { label: "Prevented Incidents", value: "34", icon: CheckCircle2, color: "#1BA0D7", sub: "This month" },
          { label: "Risk Score", value: "28/100", icon: AlertTriangle, color: "#F59E0B", sub: "Low-Medium risk" },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${m.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <span className="text-xs text-[#64748B]">{m.label}</span>
              </div>
              <div className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{m.value}</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">{m.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictions List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-[#0F172A] text-sm">Active Failure Forecasts</h3>
          {predictions.map((p) => {
            const s = SEVERITY_STYLE[p.severity];
            const isSelected = selected === p.id;
            return (
              <motion.div
                key={p.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelected(p.id)}
                className={`rounded-2xl p-4 border cursor-pointer transition-all ${s.bg} ${s.border} ${isSelected ? "ring-2 ring-[#1BA0D7]/30 shadow-md" : "hover:shadow-sm"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.badge}`}>{p.severity.toUpperCase()}</span>
                      <span className="text-[10px] text-[#94A3B8] font-mono">{p.id}</span>
                    </div>
                    <div className="font-semibold text-[#0F172A] text-sm">{p.title}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{p.node}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-colors ${isSelected ? "text-[#1BA0D7]" : "text-[#CBD5E1]"}`} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Clock className="w-3 h-3" />
                    <span>ETA: <span className="font-semibold text-[#0F172A]">{p.eta}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-16 bg-white/60 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[#1BA0D7]" style={{ width: `${p.confidence}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#1BA0D7]">{p.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel + Charts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prediction Detail */}
          {selectedPred && (
            <motion.div
              key={selectedPred.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEVERITY_STYLE[selectedPred.severity].badge}`}>{selectedPred.severity.toUpperCase()}</span>
                    <span className="text-xs font-mono text-[#94A3B8]">{selectedPred.id}</span>
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-lg" style={{ fontFamily: "Sora, sans-serif" }}>{selectedPred.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#1BA0D7]" style={{ fontFamily: "Sora, sans-serif" }}>{selectedPred.confidence}%</div>
                  <div className="text-xs text-[#64748B]">Confidence</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "ETA", value: selectedPred.eta },
                  { label: "Impact", value: selectedPred.impact },
                  { label: "Affected Nodes", value: selectedPred.affectedNodes },
                ].map(d => (
                  <div key={d.label} className="bg-[#F8FAFC] rounded-xl p-3 text-center">
                    <div className="font-bold text-[#0F172A]">{d.value}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{d.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-3 mb-4">
                <div className="text-xs font-semibold text-[#64748B] mb-1">AI Explanation</div>
                <p className="text-sm text-[#475569] leading-relaxed">{selectedPred.desc}</p>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-[#64748B] mb-2">Recommended Actions</div>
                <div className="space-y-2">
                  {selectedPred.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#1BA0D7]/10 text-[#1BA0D7] flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</div>
                      <span className="text-sm text-[#475569]">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-[#1BA0D7] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0A84FF] transition-colors flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Remediate
                </button>
                <button className="flex-1 border border-[#E2E8F0] text-[#475569] py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] transition-colors">
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}

          {/* Risk Forecast Chart */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#0F172A]">Risk Forecast — Next 24h</h3>
                <p className="text-xs text-[#64748B]">AI-predicted network risk score vs baseline</p>
              </div>
              <Activity className="w-4 h-4 text-[#94A3B8]" />
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1BA0D7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1BA0D7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
                <Area type="monotone" dataKey="baseline" stroke="#1BA0D7" fill="url(#baseGrad)" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Baseline" />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" fill="url(#riskGrad)" strokeWidth={2} dot={false} name="Risk Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain Risk + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-4">Health by Domain</h3>
          <div className="space-y-3">
            {riskByDomain.map(d => (
              <div key={d.domain} className="flex items-center gap-3">
                <span className="text-sm text-[#475569] w-36 flex-shrink-0">{d.domain}</span>
                <div className="flex-1 bg-[#F1F5F9] rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${d.score}%`,
                    backgroundColor: d.score < 70 ? "#EF4444" : d.score < 85 ? "#F59E0B" : "#10B981"
                  }} />
                </div>
                <span className="text-sm font-bold text-[#0F172A] w-10 text-right">{d.score}%</span>
                <span className={`text-xs font-semibold w-10 text-right ${d.delta > 0 ? "text-[#10B981]" : d.delta < 0 ? "text-[#EF4444]" : "text-[#94A3B8]"}`}>
                  {d.delta > 0 ? `+${d.delta}` : d.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">Network Resilience Radar</h3>
          <p className="text-xs text-[#64748B] mb-2">Multi-domain health assessment</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748B" }} />
              <Radar name="Health" dataKey="A" stroke="#1BA0D7" fill="#1BA0D7" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
