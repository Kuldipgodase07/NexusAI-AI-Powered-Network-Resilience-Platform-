import { motion } from "motion/react";
import { Activity, Wifi, TrendingUp, AlertTriangle, CheckCircle2, Clock, Server } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const latencyData = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  p50: 1.2 + Math.sin(i * 0.3) * 0.4 + (i > 30 && i < 40 ? 3.8 : 0),
  p95: 2.8 + Math.sin(i * 0.3) * 0.8 + (i > 30 && i < 40 ? 7.2 : 0),
  p99: 5.1 + Math.sin(i * 0.3) * 1.2 + (i > 30 && i < 40 ? 12.4 : 0),
}));

const packetLossData = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  loss: Math.max(0, 0.1 + Math.random() * 0.3 + (i > 30 && i < 40 ? 14.8 : 0)),
}));

const availabilityData = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  availability: 99.97 - Math.random() * 0.15,
  target: 99.9,
}));

const services = [
  { name: "Core Routing", latency: "0.8ms", availability: 99.98, loss: "0.01%", status: "healthy" },
  { name: "WAN — East", latency: "12.4ms", availability: 98.72, loss: "1.28%", status: "warning" },
  { name: "WAN — West", latency: "9.1ms", availability: 99.94, loss: "0.06%", status: "healthy" },
  { name: "Distribution Layer", latency: "0.4ms", availability: 99.99, loss: "0.00%", status: "healthy" },
  { name: "Edge Routers", latency: "2.1ms", availability: 99.91, loss: "0.09%", status: "healthy" },
  { name: "Cloud Gateway AWS", latency: "18.7ms", availability: 99.95, loss: "0.05%", status: "healthy" },
  { name: "Cloud Gateway Azure", latency: "21.2ms", availability: 99.93, loss: "0.07%", status: "healthy" },
];

const telemetryMetrics = [
  { label: "Avg Latency", value: "1.2ms", trend: "+0.1ms", delta: "warn" },
  { label: "Packet Loss", value: "0.04%", trend: "−0.02%", delta: "good" },
  { label: "Throughput", value: "847 Gbps", trend: "+23 Gbps", delta: "good" },
  { label: "Availability", value: "99.97%", trend: "−0.01%", delta: "warn" },
  { label: "Error Rate", value: "0.003%", trend: "stable", delta: "good" },
  { label: "Jitter", value: "0.18ms", trend: "+0.02ms", delta: "good" },
];

export function ObservabilityDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Observability Dashboard</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Real-time telemetry · 1,371 monitored nodes · 10M events/sec</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[#475569] bg-white focus:outline-none focus:border-[#1BA0D7]">
            <option>Last 60 minutes</option>
            <option>Last 6 hours</option>
            <option>Last 24 hours</option>
          </select>
          <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#10B981] text-xs font-semibold">Live Feed</span>
          </div>
        </div>
      </div>

      {/* Telemetry Overview */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {telemetryMetrics.map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-3 border border-[#E2E8F0]">
            <div className="text-xs text-[#64748B] mb-1">{m.label}</div>
            <div className="font-bold text-[#0F172A] text-lg" style={{ fontFamily: "Sora, sans-serif" }}>{m.value}</div>
            <div className={`text-xs font-medium mt-0.5 ${m.delta === "good" ? "text-[#10B981]" : "text-[#F59E0B]"}`}>{m.trend}</div>
          </div>
        ))}
      </div>

      {/* Latency Chart */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#0F172A]">Latency Distribution — Real Time</h3>
            <p className="text-xs text-[#64748B]">P50 / P95 / P99 percentile latency (ms) — last 60 minutes</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {[["#10B981", "P50"], ["#F59E0B", "P95"], ["#EF4444", "P99"]].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: c }} />
                <span className="text-[#64748B]">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={9} tickFormatter={v => `${v}m`} />
            <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(2)}ms`]} />
            <ReferenceLine y={5} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1} opacity={0.5} label={{ value: "SLA threshold", fontSize: 10, fill: "#EF4444" }} />
            <Line type="monotone" dataKey="p50" stroke="#10B981" strokeWidth={2} dot={false} name="P50" />
            <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={2} dot={false} name="P95" />
            <Line type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={2} dot={false} name="P99" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Packet Loss */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="mb-4">
            <h3 className="font-semibold text-[#0F172A]">Packet Loss — Last 60 Minutes</h3>
            <p className="text-xs text-[#64748B]">Aggregate packet loss % across all monitored paths</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={packetLossData}>
              <defs>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={9} tickFormatter={v => `${v}m`} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(2)}%`, "Packet Loss"]} />
              <Area type="monotone" dataKey="loss" stroke="#EF4444" fill="url(#lossGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="mb-4">
            <h3 className="font-semibold text-[#0F172A]">Network Availability — June</h3>
            <p className="text-xs text-[#64748B]">Daily availability % vs 99.9% SLA target</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={availabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[99.7, 100]} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(3)}%`]} />
              <ReferenceLine y={99.9} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1} opacity={0.6} />
              <Bar dataKey="availability" fill="#1BA0D7" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Health Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
        <h3 className="font-semibold text-[#0F172A] mb-4">Service Health Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#94A3B8] text-xs uppercase tracking-wider border-b border-[#F1F5F9]">
                <th className="text-left pb-3 pr-4">Service</th>
                <th className="text-left pb-3 pr-4">Status</th>
                <th className="text-left pb-3 pr-4">Latency</th>
                <th className="text-left pb-3 pr-4">Availability</th>
                <th className="text-left pb-3 pr-4">Packet Loss</th>
                <th className="text-left pb-3">SLA</th>
              </tr>
            </thead>
            <tbody>
              {services.map(svc => (
                <tr key={svc.name} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span className="font-medium text-[#0F172A] text-sm">{svc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${svc.status === "healthy" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`} />
                      <span className={`text-xs font-semibold capitalize ${svc.status === "healthy" ? "text-[#10B981]" : "text-[#F59E0B]"}`}>{svc.status}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#475569] font-mono">{svc.latency}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[#F1F5F9] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{
                          width: `${(svc.availability - 98) / 2 * 100}%`,
                          backgroundColor: svc.availability >= 99.9 ? "#10B981" : "#F59E0B"
                        }} />
                      </div>
                      <span className="text-xs text-[#0F172A] font-semibold">{svc.availability}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#475569] font-mono">{svc.loss}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      svc.availability >= 99.9 ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}>
                      {svc.availability >= 99.9 ? "Meeting" : "At Risk"}
                    </span>
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
