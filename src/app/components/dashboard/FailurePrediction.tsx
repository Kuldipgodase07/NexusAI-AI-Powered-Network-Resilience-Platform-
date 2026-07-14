import { useState } from "react";
import { motion } from "motion/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine
} from "recharts";
import {
  Radio, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Zap, Server, Wifi, Activity, ChevronRight, Brain, Shield
} from "lucide-react";

const predictions = [
  {
    id: "P-001",
    device: "WAN-EAST-01",
    type: "Link Saturation",
    confidence: 84,
    eta: "2h 58m",
    severity: "critical",
    impact: "Branch A, B connectivity",
    trend: "increasing",
    metrics: { current: 87, threshold: 90, unit: "% utilization" },
    history: [72, 74, 76, 79, 81, 83, 85, 87],
  },
  {
    id: "P-002",
    device: "WAN-EAST-02",
    type: "BGP Instability",
    confidence: 71,
    eta: "5h 30m",
    severity: "high",
    impact: "East region routing",
    trend: "increasing",
    metrics: { current: 12, threshold: 15, unit: "flaps/hr" },
    history: [3, 4, 5, 6, 8, 9, 10, 12],
  },
  {
    id: "P-003",
    device: "AS-CORE-01",
    type: "Hardware Degradation",
    confidence: 67,
    eta: "12h 15m",
    severity: "high",
    impact: "Core switching fabric",
    trend: "stable",
    metrics: { current: 4.2, threshold: 5.0, unit: "% packet loss" },
    history: [1.1, 1.8, 2.4, 2.9, 3.3, 3.7, 4.0, 4.2],
  },
  {
    id: "P-004",
    device: "DIST-CENT-01",
    type: "CPU Overload",
    confidence: 58,
    eta: "18h 40m",
    severity: "medium",
    impact: "Central distribution layer",
    trend: "stable",
    metrics: { current: 79, threshold: 85, unit: "% CPU" },
    history: [62, 65, 68, 70, 72, 74, 76, 79],
  },
];

const forecastData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  risk: Math.max(10, 20 + Math.sin(i * 0.4) * 15 + i * 1.8 + (i > 18 ? (i - 18) * 3 : 0)),
  baseline: 25,
  threshold: 75,
}));

const deviceTrend = (history: number[]) =>
  history.map((v, i) => ({ t: i, v }));

const severityConfig = {
  critical: { color: "#EF4444", bg: "#FEF2F2", label: "Critical", badge: "bg-[#EF4444]/15 text-[#EF4444]" },
  high:     { color: "#F59E0B", bg: "#FFFBEB", label: "High",     badge: "bg-[#F59E0B]/15 text-[#F59E0B]" },
  medium:   { color: "#1BA0D7", bg: "#EFF6FF", label: "Medium",   badge: "bg-[#1BA0D7]/15 text-[#1BA0D7]" },
};

const modelStats = [
  { label: "Model Accuracy", value: "94.2%", icon: Brain, color: "#8B5CF6" },
  { label: "Active Predictions", value: "4", icon: Radio, color: "#EF4444" },
  { label: "Prevented Failures", value: "28", icon: Shield, color: "#10B981" },
  { label: "Avg Lead Time", value: "8.4h", icon: Clock, color: "#1BA0D7" },
];

export function FailurePrediction() {
  const [selected, setSelected] = useState(predictions[0]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Failure Prediction</h1>
          <p className="text-[#64748B] text-sm mt-0.5">AI-powered predictive analytics · Updated 42s ago</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20">
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-[#EF4444] text-xs font-semibold">4 Active Predictions</span>
        </div>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-4 gap-4">
        {modelStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-[#0F172A] font-bold text-lg" style={{ fontFamily: "Sora, sans-serif" }}>{s.value}</div>
                <div className="text-[#64748B] text-xs">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Prediction list */}
        <div className="col-span-4 space-y-3">
          <div className="text-[#0F172A] font-semibold text-sm">Predicted Failures</div>
          {predictions.map(p => {
            const s = severityConfig[p.severity as keyof typeof severityConfig];
            const isSelected = selected.id === p.id;
            return (
              <motion.button
                key={p.id}
                onClick={() => setSelected(p)}
                whileHover={{ x: 2 }}
                className={`w-full text-left bg-white rounded-2xl border p-4 transition-all ${
                  isSelected ? "border-[#1BA0D7] shadow-md shadow-[#1BA0D7]/10" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-[#0F172A] font-semibold text-sm">{p.device}</div>
                    <div className="text-[#64748B] text-xs">{p.type}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.badge}`}>{s.label}</span>
                </div>

                {/* Confidence bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#64748B]">Confidence</span>
                    <span className="font-bold" style={{ color: s.color }}>{p.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.confidence}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#64748B]">
                    <Clock className="w-3 h-3" />
                    <span>ETA: {p.eta}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#1BA0D7]" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="col-span-8 space-y-4">
          {/* Device detail */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <div className="text-[#0F172A] font-bold" style={{ fontFamily: "Sora, sans-serif" }}>{selected.device}</div>
                  <div className="text-[#64748B] text-sm">{selected.type} · Impact: {selected.impact}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#EF4444] font-bold text-2xl" style={{ fontFamily: "Sora, sans-serif" }}>{selected.confidence}%</div>
                <div className="text-[#64748B] text-xs">failure confidence</div>
              </div>
            </div>

            {/* Current vs threshold */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-[#F8FAFC] rounded-xl p-3">
                <div className="text-[#64748B] text-xs mb-1">Current Value</div>
                <div className="text-[#0F172A] font-bold text-lg">{selected.metrics.current}<span className="text-xs text-[#64748B] ml-1">{selected.metrics.unit}</span></div>
              </div>
              <div className="bg-[#FEF2F2] rounded-xl p-3">
                <div className="text-[#64748B] text-xs mb-1">Failure Threshold</div>
                <div className="text-[#EF4444] font-bold text-lg">{selected.metrics.threshold}<span className="text-xs text-[#64748B] ml-1">{selected.metrics.unit}</span></div>
              </div>
              <div className="bg-[#F0FDF4] rounded-xl p-3">
                <div className="text-[#64748B] text-xs mb-1">Time to Failure</div>
                <div className="text-[#10B981] font-bold text-lg">{selected.eta}</div>
              </div>
            </div>

            {/* Trend sparkline */}
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deviceTrend(selected.history)}>
                  <Line type="monotone" dataKey="v" stroke="#EF4444" strokeWidth={2} dot={false} />
                  <ReferenceLine y={selected.metrics.threshold} stroke="#EF4444" strokeDasharray="4 2" strokeOpacity={0.4} />
                  <Tooltip
                    contentStyle={{ background: "#0F172A", border: "none", borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ display: "none" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk forecast */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[#0F172A] font-semibold text-sm">24-Hour Risk Forecast</div>
                <div className="text-[#64748B] text-xs">Aggregated failure probability across all monitored devices</div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#1BA0D7]" /><span className="text-[#64748B]">Risk Score</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#EF4444]" /><span className="text-[#64748B]">Threshold</span></div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1BA0D7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1BA0D7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94A3B8" }} interval={3} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "#0F172A", border: "none", borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: "#94A3B8" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="4 2" strokeOpacity={0.6} label={{ value: "Critical", position: "right", fontSize: 10, fill: "#EF4444" }} />
                  <Area type="monotone" dataKey="risk" stroke="#1BA0D7" strokeWidth={2} fill="url(#riskGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommended Actions */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-[#0F172A] font-semibold text-sm">AI Recommended Actions</span>
            </div>
            <div className="space-y-3">
              {[
                { action: "Pre-provision failover route via WAN-WEST-02", confidence: 94, effort: "Auto", icon: Zap, color: "#10B981" },
                { action: "Throttle non-critical traffic on WAN-EAST-01 by 30%", confidence: 88, effort: "1-click", icon: Activity, color: "#1BA0D7" },
                { action: "Alert upstream provider of SLA breach risk", confidence: 76, effort: "Manual", icon: Wifi, color: "#F59E0B" },
              ].map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${r.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: r.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#0F172A] text-sm">{r.action}</div>
                      <div className="text-[#64748B] text-xs mt-0.5">Confidence: {r.confidence}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569]">{r.effort}</span>
                      <button className="text-xs font-semibold text-[#1BA0D7] hover:text-[#0A84FF] transition-colors whitespace-nowrap">
                        Apply →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Historical predictions */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#0F172A] font-semibold text-sm">Recent Prediction History</div>
          <span className="text-xs text-[#64748B]">Last 7 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {["Prediction ID", "Device", "Failure Type", "Confidence", "Lead Time", "Outcome"].map(h => (
                  <th key={h} className="text-left text-xs text-[#64748B] font-medium pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {[
                { id: "P-997", device: "WAN-WEST-01", type: "Link Saturation", confidence: 91, lead: "4h 20m", outcome: "prevented" },
                { id: "P-996", device: "EDGE-RTR-01", type: "BGP Instability", confidence: 78, lead: "6h 05m", outcome: "prevented" },
                { id: "P-995", device: "AS-DIST-02", type: "CPU Overload",    confidence: 62, lead: "11h 50m", outcome: "missed" },
                { id: "P-994", device: "WAN-EAST-02", type: "Memory Leak",    confidence: 85, lead: "3h 15m", outcome: "prevented" },
                { id: "P-993", device: "CORE-RTR-01", type: "SFP Degradation",confidence: 72, lead: "9h 40m", outcome: "prevented" },
              ].map(row => (
                <tr key={row.id}>
                  <td className="py-3 pr-6 text-[#64748B] font-mono text-xs">{row.id}</td>
                  <td className="py-3 pr-6 text-[#0F172A] font-medium">{row.device}</td>
                  <td className="py-3 pr-6 text-[#64748B]">{row.type}</td>
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#1BA0D7]" style={{ width: `${row.confidence}%` }} />
                      </div>
                      <span className="text-[#0F172A] text-xs font-medium">{row.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-[#64748B] text-xs">{row.lead}</td>
                  <td className="py-3">
                    {row.outcome === "prevented" ? (
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Prevented</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Missed</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
