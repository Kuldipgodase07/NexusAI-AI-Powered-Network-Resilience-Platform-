import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Activity, Server, Clock, Brain, Wifi, CheckCircle2, ArrowUpRight, Zap, RefreshCw } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const alerts = [
  { id: "INC-2847", sev: "critical", title: "Core Router Packet Loss >15%",   node: "AS-CORE-01",   time: "14 min", status: "Remediating" },
  { id: "INC-2846", sev: "warning",  title: "BGP Peer Session Flapping",      node: "EDGE-RTR-02",  time: "2h 8m",  status: "Monitoring" },
  { id: "INC-2845", sev: "warning",  title: "WAN Link High Latency +340%",    node: "WAN-EAST-01",  time: "38m",    status: "Resolved" },
  { id: "INC-2844", sev: "info",     title: "OSPF Neighbor Hello Drift",      node: "EDGE-RTR-03",  time: "1h 2m",  status: "Resolved" },
];

const deviceHealth = [
  { name: "AS-CORE-01", type: "Core Router",   cpu: 87, mem: 72, status: "critical" },
  { name: "AS-CORE-02", type: "Core Router",   cpu: 61, mem: 58, status: "healthy" },
  { name: "DIST-CENT",  type: "Dist Switch",   cpu: 79, mem: 65, status: "warning" },
  { name: "EDGE-RTR-02",type: "Edge Router",   cpu: 81, mem: 70, status: "warning" },
  { name: "WAN-EAST-01",type: "WAN Gateway",   cpu: 44, mem: 41, status: "healthy" },
  { name: "ACC-SW-01",   type: "Access Switch", cpu: 22, mem: 19, status: "healthy" },
];

const latencyData = Array.from({ length: 40 }, (_, i) => ({
  t: i, core: 0.8 + Math.sin(i * 0.4) * 0.3, wan: 12 + Math.sin(i * 0.3) * 4 + (i > 18 && i < 26 ? 28 : 0),
}));

const packetLossData = Array.from({ length: 40 }, (_, i) => ({
  t: i, loss: Math.max(0, 0.05 + Math.random() * 0.2 + (i > 18 && i < 26 ? 15 : 0)),
}));

const mttrData = [
  { day: "Mon", mttr: 42 }, { day: "Tue", mttr: 31 }, { day: "Wed", mttr: 67 },
  { day: "Thu", mttr: 28 }, { day: "Fri", mttr: 19 }, { day: "Sat", mttr: 14 }, { day: "Sun", mttr: 23 },
];

const aiRecs = [
  { title: "Replace SFP on GigE0/0/1", conf: 94, impact: "High",   action: "Initiate Work Order" },
  { title: "Pre-route via AS-CORE-02",  conf: 91, impact: "High",   action: "Apply Now" },
  { title: "Adjust OSPF hello timers",  conf: 78, impact: "Medium", action: "Schedule" },
];

const SEV: Record<string, { dot: string; badge: string; text: string }> = {
  critical: { dot: "#EF4444", badge: "bg-[#EF4444]/10 text-[#EF4444]", text: "text-[#EF4444]" },
  warning:  { dot: "#F59E0B", badge: "bg-[#F59E0B]/10 text-[#F59E0B]", text: "text-[#F59E0B]" },
  info:     { dot: "#1BA0D7", badge: "bg-[#1BA0D7]/10 text-[#1BA0D7]", text: "text-[#1BA0D7]" },
};

export function NetworkEngineerDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1BA0D7] to-[#0A84FF] flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>NOC Engineer Dashboard</h1>
          </div>
          <p className="text-[#64748B] text-sm">Real-time operations view · 1,371 monitored nodes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#EF4444]/10 px-3 py-1.5 rounded-lg border border-[#EF4444]/20">
            <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-xs text-[#EF4444] font-semibold">1 Critical Open</span>
          </div>
          <button onClick={refresh} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Incidents", value: "3",     icon: AlertTriangle, color: "#EF4444", sub: "1 critical" },
          { label: "Avg MTTR (7d)",    value: "23min",  icon: Clock,         color: "#F59E0B", sub: "−47min vs baseline" },
          { label: "Healthy Devices",  value: "1,247",  icon: CheckCircle2,  color: "#10B981", sub: "of 1,371 total" },
          { label: "AI Recs",          value: "3",      icon: Brain,         color: "#8B5CF6", sub: "Actionable now" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#CBD5E1]" />
              </div>
              <div className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{k.value}</div>
              <div className="text-xs text-[#64748B]">{k.label}</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">{k.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="font-semibold text-[#0F172A]">Incident Queue</h3>
            <span className="text-xs text-[#1BA0D7] font-medium cursor-pointer">View All →</span>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {alerts.map(a => {
              const s = SEV[a.sev];
              return (
                <div key={a.id} className="px-5 py-3 hover:bg-[#F8FAFC] transition-colors flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.badge}`}>{a.sev.toUpperCase()}</span>
                      <span className="text-xs font-mono text-[#94A3B8]">{a.id}</span>
                    </div>
                    <div className="font-medium text-[#0F172A] text-sm truncate">{a.title}</div>
                    <div className="text-xs text-[#64748B]">{a.node} · {a.time} ago</div>
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${a.status === "Resolved" ? "text-[#10B981]" : a.status === "Remediating" ? "text-[#1BA0D7]" : "text-[#F59E0B]"}`}>
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Health */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="font-semibold text-[#0F172A]">Device Health</h3>
            <span className="text-xs text-[#1BA0D7] font-medium cursor-pointer">Full Inventory →</span>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {deviceHealth.map(d => (
              <div key={d.name} className="px-5 py-3 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.status === "healthy" ? "#10B981" : d.status === "warning" ? "#F59E0B" : "#EF4444" }} />
                    <span className="font-medium text-[#0F172A] text-sm">{d.name}</span>
                    <span className="text-[10px] text-[#94A3B8]">{d.type}</span>
                  </div>
                  <span className={`text-xs font-semibold capitalize ${d.status === "healthy" ? "text-[#10B981]" : d.status === "warning" ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>{d.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[["CPU", d.cpu], ["MEM", d.mem]].map(([label, val]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-[10px] text-[#94A3B8] mb-0.5">
                        <span>{label}</span><span className="font-semibold text-[#0F172A]">{val}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F1F5F9] rounded-full">
                        <div className="h-1.5 rounded-full" style={{
                          width: `${val}%`,
                          backgroundColor: (val as number) > 80 ? "#EF4444" : (val as number) > 65 ? "#F59E0B" : "#10B981"
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latency */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">Latency Monitor</h3>
          <p className="text-xs text-[#64748B] mb-3">Core vs WAN (ms) · Last 40 min</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="t" hide />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Line type="monotone" dataKey="core" stroke="#1BA0D7" strokeWidth={2} dot={false} name="Core (ms)" />
              <Line type="monotone" dataKey="wan"  stroke="#F59E0B" strokeWidth={2} dot={false} name="WAN (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Packet Loss */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">Packet Loss</h3>
          <p className="text-xs text-[#64748B] mb-3">Aggregate % · Last 40 min</p>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={packetLossData}>
              <defs>
                <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="t" hide />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="loss" stroke="#EF4444" fill="url(#plGrad)" strokeWidth={2} dot={false} name="Loss %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MTTR Bar */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">MTTR Trend</h3>
          <p className="text-xs text-[#64748B] mb-3">Minutes per day this week</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={mttrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Bar dataKey="mttr" fill="#1BA0D7" radius={[4, 4, 0, 0]} name="MTTR (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F1F5F9] bg-gradient-to-r from-[#8B5CF6]/5 to-transparent">
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0F172A]">AI Recommendations</h3>
            <p className="text-xs text-[#64748B]">Prioritized actions to resolve active incidents</p>
          </div>
        </div>
        <div className="divide-y divide-[#F8FAFC]">
          {aiRecs.map((r, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-[#F8FAFC] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#0F172A] text-sm">{r.title}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 bg-[#F1F5F9] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[#8B5CF6]" style={{ width: `${r.conf}%` }} />
                    </div>
                    <span className="text-xs text-[#8B5CF6] font-semibold">{r.conf}%</span>
                  </div>
                  <span className={`text-xs font-semibold ${r.impact === "High" ? "text-[#EF4444]" : "text-[#F59E0B]"}`}>{r.impact} Impact</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-[#1BA0D7] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#0A84FF] transition-colors flex-shrink-0">
                <Zap className="w-3.5 h-3.5" />
                {r.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
