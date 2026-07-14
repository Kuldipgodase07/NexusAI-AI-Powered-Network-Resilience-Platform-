import { motion } from "motion/react";
import { TrendingUp, DollarSign, Shield, BarChart3, Brain, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Zap, Download } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

const resilienceTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i],
  score: 74 + i * 1.7 + Math.sin(i * 0.5) * 1.5,
  industry: 68 + i * 0.5,
}));

const downtimeCost = [
  { month: "Jan", avoided: 2.1, actual: 0.4 }, { month: "Feb", avoided: 1.8, actual: 0.2 },
  { month: "Mar", avoided: 2.4, actual: 0.6 }, { month: "Apr", avoided: 1.9, actual: 0.1 },
  { month: "May", avoided: 2.7, actual: 0.2 }, { month: "Jun", avoided: 3.2, actual: 0.1 },
];

const execKPIs = [
  { label: "Resilience Score",     value: "94.2",   unit: "/100", delta: "+16.2 pts",  up: true,  color: "#10B981", icon: Shield },
  { label: "Network Availability", value: "99.97",  unit: "%",    delta: "+0.07%",    up: true,  color: "#1BA0D7", icon: CheckCircle2 },
  { label: "Downtime Avoided",     value: "$8.7M",  unit: "",     delta: "This year",  up: null,  color: "#8B5CF6", icon: DollarSign },
  { label: "AI Prediction Acc.",   value: "94.2",   unit: "%",    delta: "+13.2% YTD", up: true,  color: "#F59E0B", icon: Brain },
  { label: "MTTR Improvement",     value: "66",     unit: "%",    delta: "68m → 23m",  up: true,  color: "#06B6D4", icon: TrendingUp },
  { label: "Automation Rate",      value: "78",     unit: "%",    delta: "+31% vs Jan", up: true, color: "#EF4444", icon: Zap },
];

const businessRisk = [
  { area: "Core Infrastructure",   risk: 18, impact: "Low",    trend: -3 },
  { area: "WAN Connectivity",      risk: 42, impact: "Medium", trend: +8 },
  { area: "Cloud Integration",     risk: 22, impact: "Low",    trend: -2 },
  { area: "Cybersecurity Posture", risk: 12, impact: "Low",    trend: -5 },
  { area: "Vendor Dependency",     risk: 35, impact: "Medium", trend: +2 },
  { area: "Compliance",            risk: 8,  impact: "Low",    trend: -1 },
];

const strategicRecs = [
  { priority: 1, title: "Invest in WAN Redundancy — East Region",  impact: "$2.1M risk reduction",  effort: "Medium", timeframe: "Q3 2026", color: "#EF4444" },
  { priority: 2, title: "Expand NexusAI to APAC Network Fabric",   impact: "$1.4M efficiency gain",  effort: "High",   timeframe: "Q4 2026", color: "#F59E0B" },
  { priority: 3, title: "Consolidate Legacy Monitoring Stack",      impact: "$680K OpEx reduction",   effort: "Low",    timeframe: "Q3 2026", color: "#10B981" },
  { priority: 4, title: "SD-WAN Migration — Branch Offices",       impact: "40% WAN cost reduction", effort: "High",   timeframe: "Q1 2027", color: "#1BA0D7" },
];

const roiMetrics = [
  { label: "Platform Investment",    value: "$1.2M",  note: "Annual" },
  { label: "Downtime Costs Avoided", value: "$8.7M",  note: "YTD" },
  { label: "OpEx Savings",           value: "$2.1M",  note: "Through automation" },
  { label: "Net ROI",                value: "826%",   note: "Year 1" },
];

export function CIODashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>CIO / IT Director Dashboard</h1>
          </div>
          <p className="text-[#64748B] text-sm">Business continuity · Executive KPIs · Strategic intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#1BA0D7] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0A84FF] transition-colors">
            <Download className="w-4 h-4" />
            Board Report
          </button>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {execKPIs.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                {k.up === true && <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />}
                {k.up === false && <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
              </div>
              <div className="font-black text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif", fontSize: "1.4rem" }}>
                {k.value}<span className="text-sm font-medium text-[#64748B]">{k.unit}</span>
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">{k.label}</div>
              <div className={`text-[10px] font-semibold mt-1 ${k.up ? "text-[#10B981]" : k.up === null ? "text-[#94A3B8]" : "text-[#EF4444]"}`}>{k.delta}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resilience Score Trend */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Resilience Score — 12 Month</h3>
              <p className="text-xs text-[#64748B]">NexusAI score vs industry benchmark</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[#10B981]" style={{ fontFamily: "Sora, sans-serif" }}>94.2</div>
              <div className="text-xs text-[#10B981] font-semibold">+26 pts vs industry</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={resilienceTrend}>
              <defs>
                <linearGradient id="resGradCIO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="score" stroke="#10B981" fill="url(#resGradCIO)" strokeWidth={2.5} dot={false} name="NexusAI Score" />
              <Line type="monotone" dataKey="industry" stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Industry Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Downtime Cost Avoided */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Downtime Cost Analysis ($M)</h3>
              <p className="text-xs text-[#64748B]">Avoided vs actual downtime costs</p>
            </div>
            <div className="flex gap-3 text-xs">
              {[["#10B981","Avoided"],["#EF4444","Actual"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} /><span className="text-[#64748B]">{l}</span></div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={downtimeCost}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`$${v.toFixed(1)}M`]} />
              <Bar dataKey="avoided" fill="#10B981" radius={[4, 4, 0, 0]} name="Cost Avoided" />
              <Bar dataKey="actual"  fill="#EF4444" radius={[4, 4, 0, 0]} name="Actual Cost" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Risk */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="font-semibold text-[#0F172A]">Business Risk Matrix</h3>
          </div>
          <div className="p-5 space-y-3">
            {businessRisk.map(r => (
              <div key={r.area}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#475569] font-medium">{r.area}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-[10px] px-1.5 py-0.5 rounded-full ${r.impact === "Low" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>{r.impact}</span>
                    <span className={`font-bold text-[10px] ${r.trend < 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{r.trend > 0 ? `+${r.trend}` : r.trend}</span>
                    <span className="font-bold text-[#0F172A]">{r.risk}</span>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full">
                  <div className="h-2 rounded-full" style={{
                    width: `${r.risk}%`,
                    backgroundColor: r.risk > 40 ? "#F59E0B" : r.risk > 25 ? "#1BA0D7" : "#10B981"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI */}
        <div className="bg-gradient-to-br from-[#0A0F1E] to-[#0F172A] rounded-2xl p-5 border border-[#1E293B]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#10B981]" />
            </div>
            <h3 className="font-semibold text-white">ROI Dashboard</h3>
          </div>
          <div className="space-y-4">
            {roiMetrics.map(m => (
              <div key={m.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <div className="text-xs text-[#64748B]">{m.label}</div>
                  <div className="text-[10px] text-[#475569]">{m.note}</div>
                </div>
                <div className="text-xl font-black text-white" style={{ fontFamily: "Sora, sans-serif" }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20 text-center">
            <div className="text-3xl font-black text-[#10B981]" style={{ fontFamily: "Sora, sans-serif" }}>826%</div>
            <div className="text-xs text-[#10B981] font-semibold">Year 1 Return on Investment</div>
          </div>
        </div>

        {/* Strategic Recs */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F1F5F9]">
            <div className="w-8 h-8 rounded-xl bg-[#1BA0D7]/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#1BA0D7]" />
            </div>
            <h3 className="font-semibold text-[#0F172A]">Strategic Recommendations</h3>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {strategicRecs.map(r => (
              <div key={r.priority} className="px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: r.color }}>
                    {r.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#0F172A] text-sm leading-snug">{r.title}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[#10B981] font-semibold">{r.impact}</span>
                      <span className="text-[10px] text-[#94A3B8]">·</span>
                      <span className="text-xs text-[#64748B]">{r.effort} effort</span>
                      <span className="text-[10px] text-[#94A3B8]">·</span>
                      <span className="text-xs text-[#64748B]">{r.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9]">
            <button className="w-full text-center text-xs text-[#1BA0D7] font-semibold hover:underline">View Full Strategic Plan →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
