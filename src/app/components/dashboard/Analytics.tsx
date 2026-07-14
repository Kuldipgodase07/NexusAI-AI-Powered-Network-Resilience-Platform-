import { motion } from "motion/react";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, CheckCircle2, Brain } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine
} from "recharts";

const mttrData = [
  { month: "Jan", mttr: 68, incidents: 28, target: 30 },
  { month: "Feb", mttr: 54, incidents: 22, target: 30 },
  { month: "Mar", mttr: 71, incidents: 31, target: 30 },
  { month: "Apr", mttr: 42, incidents: 19, target: 30 },
  { month: "May", mttr: 35, incidents: 14, target: 30 },
  { month: "Jun", mttr: 23, incidents: 9, target: 30 },
];

const slaData = [
  { week: "W1", achieved: 99.94, target: 99.9 },
  { week: "W2", achieved: 99.97, target: 99.9 },
  { week: "W3", achieved: 99.71, target: 99.9 },
  { week: "W4", achieved: 99.98, target: 99.9 },
  { week: "W5", achieved: 99.99, target: 99.9 },
  { week: "W6", achieved: 99.97, target: 99.9 },
  { week: "W7", achieved: 99.98, target: 99.9 },
  { week: "W8", achieved: 99.99, target: 99.9 },
];

const predAccuracy = [
  { month: "Jan", accuracy: 81, falsePos: 8 },
  { month: "Feb", accuracy: 83, falsePos: 7 },
  { month: "Mar", accuracy: 86, falsePos: 6 },
  { month: "Apr", accuracy: 89, falsePos: 5 },
  { month: "May", accuracy: 91, falsePos: 4 },
  { month: "Jun", accuracy: 94, falsePos: 3 },
];

const resilienceTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i],
  score: 78 + i * 1.5 + Math.sin(i * 0.5) * 2,
}));

const kpiSummary = [
  { label: "MTTR Improvement", value: "66%", sub: "68m → 23m avg", trend: "up", color: "#10B981" },
  { label: "SLA Achievement", value: "99.97%", sub: "vs 99.9% target", trend: "up", color: "#1BA0D7" },
  { label: "Incidents Prevented", value: "34", sub: "via AI prediction", trend: "up", color: "#8B5CF6" },
  { label: "Prediction Accuracy", value: "94.2%", sub: "+13.2% vs Jan", trend: "up", color: "#F59E0B" },
  { label: "Automation Rate", value: "78%", sub: "of remediations", trend: "up", color: "#06B6D4" },
  { label: "Resilience Index", value: "94.2", sub: "+16.2 pts (12m)", trend: "up", color: "#EF4444" },
];

const reports = [
  { name: "Q2 2026 Executive Network Report", date: "Jun 1, 2026", type: "Quarterly", size: "2.4 MB" },
  { name: "May 2026 SLA Compliance Report", date: "Jun 1, 2026", type: "Monthly", size: "1.1 MB" },
  { name: "Incident Trend Analysis — 6M", date: "May 28, 2026", type: "Ad-hoc", size: "840 KB" },
  { name: "AI Prediction Accuracy Audit", date: "May 15, 2026", type: "Audit", size: "3.2 MB" },
];

export function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Analytics & Reporting</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Performance intelligence · 12-month rolling window</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-[#E2E8F0] text-[#475569] text-sm px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
            <Calendar className="w-4 h-4" />
            Jun 2025 – Jun 2026
          </button>
          <button className="flex items-center gap-2 bg-[#1BA0D7] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#0A84FF] transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiSummary.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-[#E2E8F0]"
          >
            <div className="text-2xl font-bold mb-0.5" style={{ color: k.color, fontFamily: "Sora, sans-serif" }}>{k.value}</div>
            <div className="text-xs font-semibold text-[#0F172A]">{k.label}</div>
            <div className="text-xs text-[#64748B] mt-0.5">{k.sub}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
              <span className="text-[10px] text-[#10B981] font-semibold">Improving</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTTR Trend */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">MTTR Trend</h3>
              <p className="text-xs text-[#64748B]">Mean Time To Recover (minutes) vs incident count</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-2 py-1 rounded-lg">
              <TrendingDown className="w-3 h-3 text-[#10B981]" />
              <span className="text-xs text-[#10B981] font-semibold">−66% YTD</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={mttrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <ReferenceLine yAxisId="left" y={30} stroke="#10B981" strokeDasharray="4 2" strokeWidth={1} opacity={0.7} label={{ value: "Target 30m", fontSize: 9, fill: "#10B981" }} />
              <Bar yAxisId="right" dataKey="incidents" fill="#E2E8F0" radius={[3, 3, 0, 0]} name="Incidents" />
              <Line yAxisId="left" type="monotone" dataKey="mttr" stroke="#1BA0D7" strokeWidth={2.5} dot={{ fill: "#1BA0D7", r: 4 }} name="MTTR (min)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">SLA Compliance</h3>
              <p className="text-xs text-[#64748B]">Weekly availability % vs 99.9% SLA target</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1BA0D7]/10 px-2 py-1 rounded-lg">
              <CheckCircle2 className="w-3 h-3 text-[#1BA0D7]" />
              <span className="text-xs text-[#1BA0D7] font-semibold">7/8 weeks met</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={slaData}>
              <defs>
                <linearGradient id="slaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[99.6, 100]} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(3)}%`]} />
              <ReferenceLine y={99.9} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: "SLA 99.9%", fontSize: 9, fill: "#EF4444" }} />
              <Area type="monotone" dataKey="achieved" stroke="#10B981" fill="url(#slaGrad)" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} name="Availability %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">AI Prediction Accuracy</h3>
              <p className="text-xs text-[#64748B]">Model accuracy % and false positive rate over time</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#8B5CF6]/10 px-2 py-1 rounded-lg">
              <Brain className="w-3 h-3 text-[#8B5CF6]" />
              <span className="text-xs text-[#8B5CF6] font-semibold">94.2% current</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={predAccuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Bar dataKey="falsePos" fill="#EF4444" radius={[3, 3, 0, 0]} opacity={0.6} name="False Positive %" />
              <Line type="monotone" dataKey="accuracy" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6", r: 4 }} name="Accuracy %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Resilience Trend */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Resilience Index Trend</h3>
              <p className="text-xs text-[#64748B]">12-month AI-computed resilience score (0-100)</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
              <span className="text-xs text-[#10B981] font-semibold">+16.2 pts</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={resilienceTrend}>
              <defs>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1BA0D7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1BA0D7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[70, 100]} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(1)}/100`]} />
              <Area type="monotone" dataKey="score" stroke="#1BA0D7" fill="url(#resGrad)" strokeWidth={2.5} dot={false} name="Resilience Index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#0F172A]">Saved Reports</h3>
          <button className="flex items-center gap-2 bg-[#1BA0D7]/10 text-[#1BA0D7] text-sm px-3 py-1.5 rounded-xl font-medium hover:bg-[#1BA0D7]/20 transition-colors">
            Generate Report
          </button>
        </div>
        <div className="space-y-2">
          {reports.map(r => (
            <div key={r.name} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-[#1BA0D7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#0F172A] text-sm truncate">{r.name}</div>
                <div className="text-xs text-[#64748B]">{r.date} · {r.size}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                r.type === "Quarterly" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                r.type === "Monthly" ? "bg-[#1BA0D7]/10 text-[#1BA0D7]" :
                r.type === "Audit" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                "bg-[#94A3B8]/10 text-[#94A3B8]"
              }`}>{r.type}</span>
              <button className="flex items-center gap-1 text-xs text-[#1BA0D7] hover:underline flex-shrink-0">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
