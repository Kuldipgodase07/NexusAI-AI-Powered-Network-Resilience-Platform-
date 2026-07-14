import { motion } from "motion/react";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Brain, Activity,
  Shield, Zap, Clock, Server, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const kpiCards = [
  { label: "Network Health Score", value: "98.7", unit: "%", trend: "+0.3%", positive: true, icon: Activity, color: "#10B981", bg: "#10B98115", desc: "Composite resilience index" },
  { label: "Resilience Index", value: "94.2", unit: "/100", trend: "+2.1", positive: true, icon: Shield, color: "#1BA0D7", bg: "#1BA0D715", desc: "AI-computed resilience score" },
  { label: "Active Incidents", value: "3", unit: "", trend: "-2 today", positive: true, icon: AlertTriangle, color: "#EF4444", bg: "#EF444415", desc: "1 critical, 2 warning" },
  { label: "Mean Time to Recover", value: "23", unit: "min", trend: "-47 min", positive: true, icon: Clock, color: "#F59E0B", bg: "#F59E0B15", desc: "vs 70 min baseline" },
  { label: "AI Predictions", value: "12", unit: "", trend: "Next 4 hours", positive: null, icon: Brain, color: "#8B5CF6", bg: "#8B5CF615", desc: "Active forecasts" },
  { label: "Automated Remediations", value: "47", unit: "", trend: "+8 today", positive: true, icon: Zap, color: "#06B6D4", bg: "#06B6D415", desc: "This month" },
];

const healthTrend = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  health: 95 + Math.sin(i * 0.5) * 3 + (i === 13 ? -38 : 0) + (i === 14 ? -50 : 0) + (i === 15 ? -20 : 0),
  incidents: i === 13 ? 3 : i === 14 ? 5 : i === 15 ? 2 : 0,
}));

const incidentTrend = [
  { month: "Jan", incidents: 28, mttr: 68 },
  { month: "Feb", incidents: 22, mttr: 54 },
  { month: "Mar", incidents: 31, mttr: 71 },
  { month: "Apr", incidents: 19, mttr: 42 },
  { month: "May", incidents: 14, mttr: 35 },
  { month: "Jun", incidents: 9, mttr: 23 },
];

const pieData = [
  { name: "Healthy", value: 1247, color: "#10B981" },
  { name: "Warning", value: 89, color: "#F59E0B" },
  { name: "Critical", value: 23, color: "#EF4444" },
  { name: "Unknown", value: 12, color: "#94A3B8" },
];

const aiInsights = [
  { severity: "critical", title: "BGP Route Instability Predicted", desc: "AS-CORE-01 likely to experience BGP flaps in 1h 43m. Confidence: 91%", time: "2m ago" },
  { severity: "warning", title: "WAN Link Saturation Risk", desc: "DC-EAST primary link at 87% capacity. Projected 95%+ in 3 hours.", time: "8m ago" },
  { severity: "info", title: "Optimal Maintenance Window", desc: "AI recommends 03:00-04:00 UTC Sunday for planned upgrades based on traffic patterns.", time: "15m ago" },
];

const topIncidents = [
  { id: "INC-2847", title: "Core Router Packet Loss", severity: "critical", node: "AS-CORE-01", duration: "14m", status: "Remediating" },
  { id: "INC-2846", title: "BGP Peer Down", severity: "warning", node: "EDGE-RTR-02", duration: "2h 8m", status: "Monitoring" },
  { id: "INC-2845", title: "High Latency - WAN", severity: "warning", node: "WAN-EAST-01", duration: "38m", status: "Resolved" },
];

export function ExecutiveDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Executive Dashboard</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Network performance overview — Last updated 30 seconds ago</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#10B981] text-xs font-semibold">Live Monitoring</span>
          </div>
          <button className="flex items-center gap-1.5 border border-[#E2E8F0] text-[#475569] text-sm px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                </div>
                {card.positive !== null && (
                  card.positive
                    ? <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                    : <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />
                )}
              </div>
              <div className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>
                {card.value}<span className="text-sm font-medium text-[#64748B] ml-0.5">{card.unit}</span>
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">{card.label}</div>
              <div className={`text-xs font-medium mt-1 ${card.positive ? "text-[#10B981]" : card.positive === false ? "text-[#EF4444]" : "text-[#64748B]"}`}>
                {card.trend}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Network Health — 24h</h3>
              <p className="text-xs text-[#64748B]">Composite health score across all nodes</p>
            </div>
            <div className="flex gap-2">
              {["24h", "7d", "30d"].map(t => (
                <button key={t} className={`text-xs px-2.5 py-1 rounded-lg ${t === "24h" ? "bg-[#1BA0D7] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={healthTrend}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1BA0D7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1BA0D7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[40, 100]} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "12px" }}
                formatter={(v: number) => [`${v.toFixed(1)}%`, "Health"]}
              />
              <Area type="monotone" dataKey="health" stroke="#1BA0D7" fill="url(#healthGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Node Status Pie */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">Node Status</h3>
          <p className="text-xs text-[#64748B] mb-4">1,371 total monitored nodes</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-[#64748B]">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F172A]">AI Insights</h3>
                <p className="text-xs text-[#64748B]">Active predictions & recommendations</p>
              </div>
            </div>
            <span className="text-xs text-[#1BA0D7] font-medium cursor-pointer hover:underline">View all →</span>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-xl border-l-4 ${
                insight.severity === "critical" ? "bg-[#FEF2F2] border-[#EF4444]" :
                insight.severity === "warning" ? "bg-[#FFFBEB] border-[#F59E0B]" :
                "bg-[#EFF6FF] border-[#1BA0D7]"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-[#0F172A] text-sm">{insight.title}</div>
                  <span className="text-xs text-[#94A3B8] whitespace-nowrap">{insight.time}</span>
                </div>
                <div className="text-xs text-[#64748B] mt-1">{insight.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Trends */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Incident Trends</h3>
              <p className="text-xs text-[#64748B]">Monthly incidents vs MTTR (minutes)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={incidentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="incidents" fill="#1BA0D7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mttr" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 border-t border-[#F1F5F9] pt-4">
            <div className="text-xs font-semibold text-[#64748B] mb-2">Recent Incidents</div>
            {topIncidents.map(inc => (
              <div key={inc.id} className="flex items-center gap-3 py-2 border-b border-[#F8FAFC] last:border-0">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  inc.severity === "critical" ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                }`}>{inc.severity.toUpperCase()}</span>
                <span className="text-xs text-[#0F172A] font-medium flex-1 truncate">{inc.title}</span>
                <span className="text-xs text-[#94A3B8]">{inc.duration}</span>
                <span className={`text-xs font-medium ${
                  inc.status === "Resolved" ? "text-[#10B981]" :
                  inc.status === "Remediating" ? "text-[#1BA0D7]" : "text-[#F59E0B]"
                }`}>{inc.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
