import { motion } from "motion/react";
import { Users, CheckCircle2, AlertTriangle, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, BarChart3, Shield, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const slaData = [
  { week: "W1", sla: 99.94, target: 99.9 }, { week: "W2", sla: 99.97, target: 99.9 },
  { week: "W3", sla: 99.71, target: 99.9 }, { week: "W4", sla: 99.98, target: 99.9 },
  { week: "W5", sla: 99.99, target: 99.9 }, { week: "W6", sla: 99.97, target: 99.9 },
];

const incidentTrend = [
  { day: "Mon", p1: 2, p2: 5, p3: 8 }, { day: "Tue", p1: 1, p2: 3, p3: 6 },
  { day: "Wed", p1: 3, p2: 7, p3: 10 }, { day: "Thu", p1: 1, p2: 4, p3: 7 },
  { day: "Fri", p1: 0, p2: 2, p3: 5 }, { day: "Sat", p1: 0, p2: 1, p3: 3 },
  { day: "Sun", p1: 1, p2: 3, p3: 4 },
];

const teamPerf = [
  { name: "Sarah Kim",      role: "Sr. Engineer", incidents: 12, mttr: 18, sla: 99.8, status: "online" },
  { name: "Alex Johnson",   role: "Engineer",     incidents: 9,  mttr: 27, sla: 99.5, status: "online" },
  { name: "Michael Torres", role: "Engineer",     incidents: 7,  mttr: 31, sla: 99.2, status: "break" },
  { name: "Priya Sharma",   role: "Sr. Engineer", incidents: 14, mttr: 15, sla: 99.9, status: "online" },
  { name: "David Lee",      role: "Jr. Engineer", incidents: 5,  mttr: 42, sla: 98.8, status: "offline" },
];

const escalations = [
  { id: "ESC-041", title: "Core Router Failure — CORE-01",  priority: "P1", assignee: "Sarah Kim",    sla: "23m remaining", breached: false },
  { id: "ESC-040", title: "Multi-site WAN Degradation",     priority: "P1", assignee: "Priya Sharma", sla: "SLA BREACHED",  breached: true },
  { id: "ESC-039", title: "BGP Peer Instability",           priority: "P2", assignee: "Alex Johnson", sla: "2h 14m remain", breached: false },
];

const serviceAvailability = [
  { service: "Core Network",    avail: 99.98, trend: 0.01 },
  { service: "WAN East",        avail: 98.72, trend: -1.28 },
  { service: "WAN West",        avail: 99.94, trend: 0.04 },
  { service: "Cloud Connect",   avail: 99.95, trend: 0.02 },
  { service: "SD-WAN Fabric",   avail: 99.89, trend: -0.01 },
];

const riskOverview = [
  { name: "Critical", value: 1, color: "#EF4444" },
  { name: "High",     value: 4, color: "#F59E0B" },
  { name: "Medium",   value: 11, color: "#1BA0D7" },
  { name: "Low",      value: 23, color: "#10B981" },
];

export function NOCManagerDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>NOC Manager Dashboard</h1>
          </div>
          <p className="text-[#64748B] text-sm">Operations management · Team performance · SLA compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F59E0B]/10 px-3 py-1.5 rounded-lg border border-[#F59E0B]/20">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs text-[#F59E0B] font-semibold">1 SLA Breach</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
            <Users className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs text-[#10B981] font-semibold">3 Engineers Online</span>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SLA Compliance",     value: "99.87%", icon: CheckCircle2, color: "#10B981", trend: "+0.3%", up: true },
          { label: "Open Incidents",      value: "3",      icon: AlertTriangle,color: "#EF4444", trend: "-2 today", up: true },
          { label: "Team Avg MTTR",       value: "27min",  icon: Clock,        color: "#F59E0B", trend: "-8min", up: true },
          { label: "Escalations Active",  value: "3",      icon: ArrowUpRight, color: "#8B5CF6", trend: "1 breached", up: false },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                {k.up ? <ArrowUpRight className="w-4 h-4 text-[#10B981]" /> : <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />}
              </div>
              <div className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{k.value}</div>
              <div className="text-xs text-[#64748B]">{k.label}</div>
              <div className={`text-[10px] font-semibold mt-0.5 ${k.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{k.trend}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Chart */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">SLA Compliance — Weekly</h3>
              <p className="text-xs text-[#64748B]">Availability % vs 99.9% target</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981]">5/6 Met</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={slaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} domain={[99.5, 100]} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(3)}%`]} />
              <Bar dataKey="sla" radius={[4, 4, 0, 0]} name="SLA %">
                {slaData.map((entry, i) => (
                  <Cell key={i} fill={entry.sla >= 99.9 ? "#10B981" : "#EF4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Trend */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Incident Trends — This Week</h3>
              <p className="text-xs text-[#64748B]">By priority P1/P2/P3</p>
            </div>
            <div className="flex gap-3 text-xs">
              {[["#EF4444","P1"],["#F59E0B","P2"],["#1BA0D7","P3"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} /><span className="text-[#64748B]">{l}</span></div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={incidentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Bar dataKey="p1" stackId="a" fill="#EF4444" name="P1" />
              <Bar dataKey="p2" stackId="a" fill="#F59E0B" name="P2" />
              <Bar dataKey="p3" stackId="a" fill="#1BA0D7" radius={[4, 4, 0, 0]} name="P3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="font-semibold text-[#0F172A]">Team Performance Today</h3>
            <button className="text-xs text-[#1BA0D7] font-medium hover:underline">Full Report →</button>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {teamPerf.map(m => (
              <div key={m.name} className="px-5 py-3 flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{m.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${m.status === "online" ? "bg-[#10B981]" : m.status === "break" ? "bg-[#F59E0B]" : "bg-[#94A3B8]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#0F172A] text-sm">{m.name}</div>
                  <div className="text-xs text-[#64748B]">{m.role}</div>
                </div>
                <div className="flex gap-4 text-xs text-right">
                  <div>
                    <div className="font-bold text-[#0F172A]">{m.incidents}</div>
                    <div className="text-[#94A3B8]">resolved</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A]">{m.mttr}m</div>
                    <div className="text-[#94A3B8]">avg MTTR</div>
                  </div>
                  <div>
                    <div className={`font-bold ${m.sla >= 99.9 ? "text-[#10B981]" : m.sla >= 99.5 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>{m.sla}%</div>
                    <div className="text-[#94A3B8]">SLA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Escalations */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <h3 className="font-semibold text-[#0F172A]">Active Escalations</h3>
              <span className="text-xs bg-[#EF4444]/10 text-[#EF4444] font-bold px-2 py-0.5 rounded-full">{escalations.length}</span>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {escalations.map(e => (
                <div key={e.id} className={`px-5 py-3 hover:bg-[#F8FAFC] transition-colors ${e.breached ? "bg-[#FEF2F2]" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${e.priority === "P1" ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>{e.priority}</span>
                    <span className="text-xs font-mono text-[#94A3B8]">{e.id}</span>
                    {e.breached && <span className="text-[10px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full">BREACHED</span>}
                  </div>
                  <div className="font-medium text-[#0F172A] text-sm">{e.title}</div>
                  <div className="flex justify-between mt-1 text-xs text-[#64748B]">
                    <span>→ {e.assignee}</span>
                    <span className={e.breached ? "text-[#EF4444] font-semibold" : "text-[#64748B]"}>{e.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Availability */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h3 className="font-semibold text-[#0F172A]">Service Availability</h3>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {serviceAvailability.map(s => (
                <div key={s.service} className="px-5 py-2.5 flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.avail >= 99.9 ? "bg-[#10B981]" : s.avail >= 99.5 ? "bg-[#F59E0B]" : "bg-[#EF4444]"}`} />
                  <span className="flex-1 text-sm text-[#475569] font-medium">{s.service}</span>
                  <span className="font-bold text-[#0F172A] text-sm">{s.avail}%</span>
                  <span className={`text-xs font-semibold ${s.trend >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {s.trend >= 0 ? "+" : ""}{s.trend.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#0F172A]">Risk Overview — Current Environment</h3>
          <div className="flex gap-2">
            {riskOverview.map(r => (
              <div key={r.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${r.color}10` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-xs font-bold" style={{ color: r.color }}>{r.value} {r.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 h-8">
          {riskOverview.map(r => (
            <div key={r.name} className="rounded-lg transition-all hover:opacity-80 flex items-center justify-center" style={{
              width: `${(r.value / riskOverview.reduce((a,b) => a + b.value, 0)) * 100}%`,
              backgroundColor: r.color,
              minWidth: 32
            }}>
              <span className="text-white text-xs font-bold">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
