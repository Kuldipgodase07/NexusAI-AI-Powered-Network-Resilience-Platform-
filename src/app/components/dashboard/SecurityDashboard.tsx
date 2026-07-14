import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield, AlertTriangle, CheckCircle2, Activity, Eye,
  Lock, Zap, Server, Globe, Network, TrendingUp,
  Clock, Database, Wifi
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

/* ─── Mock Data ─────────────────────────── */
const threatTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  threats:   Math.max(0, 8 + Math.sin(i * 0.5) * 5 + (i > 14 ? (i - 14) * 1.2 : 0)),
  blocked:   Math.max(0, 6 + Math.sin(i * 0.4) * 4 + (i > 14 ? (i - 14) * 1.0 : 0)),
  anomalies: Math.max(0, 2 + Math.sin(i * 0.3) * 2),
}));

const riskBySegment = [
  { name: "Branch Office",  risk: 82, color: "#EF4444" },
  { name: "Remote Users",   risk: 74, color: "#F59E0B" },
  { name: "Data Center",    risk: 41, color: "#10B981" },
  { name: "Cloud (AWS)",    risk: 55, color: "#F59E0B" },
  { name: "Cloud (Azure)",  risk: 38, color: "#10B981" },
  { name: "IoT Devices",    risk: 91, color: "#EF4444" },
  { name: "Partner VPN",    risk: 63, color: "#F59E0B" },
];

const threats = [
  { id: "T-001", type: "Lateral Movement",        source: "10.24.18.45",     target: "AS-CORE-01",    severity: "critical", status: "Active",     confidence: 91, time: "2m ago" },
  { id: "T-002", type: "Anomalous DNS Query",      source: "EDGE-RTR-02",     target: "8.8.8.8",       severity: "high",     status: "Blocked",    confidence: 87, time: "8m ago" },
  { id: "T-003", type: "Port Scan Detected",       source: "192.168.50.12",   target: "DMZ Subnet",    severity: "high",     status: "Monitoring", confidence: 79, time: "15m ago" },
  { id: "T-004", type: "Unusual Traffic Volume",   source: "WAN-EAST-01",     target: "Branch-A",      severity: "medium",   status: "Blocked",    confidence: 74, time: "22m ago" },
  { id: "T-005", type: "Unauthorized SSH Attempt", source: "198.51.100.22",   target: "DC-SERVER-07",  severity: "critical", status: "Blocked",    confidence: 96, time: "31m ago" },
];

const zeroTrustPolicies = [
  { name: "Device Trust Verification",  coverage: 94, status: "enforced" },
  { name: "User Identity Assurance",    coverage: 87, status: "enforced" },
  { name: "Micro-Segmentation",         coverage: 72, status: "partial" },
  { name: "Encrypted Traffic Inspection",coverage: 61, status: "partial" },
  { name: "Least-Privilege Access",     coverage: 88, status: "enforced" },
  { name: "Continuous Risk Scoring",    coverage: 95, status: "enforced" },
];

const postureSections = [
  { label: "Firewall Compliance",  score: 96, color: "#10B981" },
  { label: "Patch Coverage",       score: 83, color: "#F59E0B" },
  { label: "MFA Enforcement",      score: 91, color: "#10B981" },
  { label: "Encryption at Rest",   score: 78, color: "#F59E0B" },
  { label: "Network Segmentation", score: 72, color: "#F59E0B" },
  { label: "Log Coverage",         score: 88, color: "#10B981" },
];

const sevColor: Record<string, string> = {
  critical: "#EF4444", high: "#F59E0B", medium: "#1BA0D7",
};
const sevBg: Record<string, string> = {
  critical: "bg-[#FEF2F2] text-[#EF4444]",
  high:     "bg-[#FFFBEB] text-[#F59E0B]",
  medium:   "bg-[#EFF6FF] text-[#1BA0D7]",
};
const statusBg: Record<string, string> = {
  Active:     "bg-[#FEF2F2] text-[#EF4444]",
  Blocked:    "bg-[#F0FDF4] text-[#10B981]",
  Monitoring: "bg-[#FFFBEB] text-[#F59E0B]",
};

const kpis = [
  { label: "Security Score",      value: "74",     unit: "/100", color: "#F59E0B", icon: Shield,      delta: "+3" },
  { label: "Active Threats",      value: "12",     unit: "",     color: "#EF4444", icon: AlertTriangle,delta: "-5" },
  { label: "Blocked Today",       value: "1,847",  unit: "",     color: "#10B981", icon: CheckCircle2, delta: "+12%" },
  { label: "Zero Trust Score",    value: "84%",    unit: "",     color: "#8B5CF6", icon: Lock,         delta: "+2%" },
  { label: "Anomalies Detected",  value: "38",     unit: "",     color: "#F97316", icon: Eye,          delta: "-8" },
  { label: "Mean Detection Time", value: "4.2min", unit: "",     color: "#1BA0D7", icon: Clock,        delta: "-1.1m" },
];

export function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<"threats"|"posture"|"zerotrust">("threats");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Security Intelligence</h1>
          <p className="text-[#64748B] text-sm mt-0.5">AI-powered threat correlation · Zero Trust visibility · Network security posture</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20">
            <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-[#EF4444] text-xs font-semibold">3 Critical Threats Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Shield className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[#10B981] text-xs font-semibold">AI Shield Active</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          const isPos = k.delta.startsWith("+");
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                <span className={`text-[10px] font-bold ${isPos ? "text-[#10B981]" : "text-[#EF4444]"}`}>{k.delta}</span>
              </div>
              <div className="text-[#0F172A] font-bold text-xl" style={{ fontFamily: "Sora, sans-serif" }}>
                {k.value}<span className="text-sm text-[#64748B]">{k.unit}</span>
              </div>
              <div className="text-[#64748B] text-xs mt-0.5">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Threat trend chart */}
        <div className="col-span-8 bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[#0F172A] font-semibold text-sm">24-Hour Threat Activity</div>
              <div className="text-[#64748B] text-xs">Detected threats · Blocked attacks · Anomalies</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[{ c: "#EF4444", l: "Threats" }, { c: "#1BA0D7", l: "Blocked" }, { c: "#8B5CF6", l: "Anomalies" }].map(x => (
                <div key={x.l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: x.c }} />
                  <span className="text-[#64748B]">{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatTrend}>
                <defs>
                  {[
                    { id: "tg", color: "#EF4444" },
                    { id: "bg", color: "#1BA0D7" },
                    { id: "ag", color: "#8B5CF6" },
                  ].map(({ id, color }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94A3B8" }} interval={3} />
                <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "none", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94A3B8" }} itemStyle={{ color: "#fff" }} />
                <Area type="monotone" dataKey="threats"   stroke="#EF4444" fill="url(#tg)" strokeWidth={2} />
                <Area type="monotone" dataKey="blocked"   stroke="#1BA0D7" fill="url(#bg)" strokeWidth={2} />
                <Area type="monotone" dataKey="anomalies" stroke="#8B5CF6" fill="url(#ag)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk by segment */}
        <div className="col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="text-[#0F172A] font-semibold text-sm mb-4">Risk by Network Segment</div>
          <div className="space-y-3">
            {riskBySegment.map(seg => (
              <div key={seg.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569]">{seg.name}</span>
                  <span className="font-bold" style={{ color: seg.color }}>{seg.risk}</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.risk}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex border-b border-[#E2E8F0]">
          {([
            { id: "threats",   label: "Active Threats",    count: 12 },
            { id: "posture",   label: "Security Posture",  count: null },
            { id: "zerotrust", label: "Zero Trust Policies",count: null },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-[#1BA0D7] text-[#1BA0D7]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444]">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Threats tab */}
        {activeTab === "threats" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {["ID", "Threat Type", "Source", "Target", "Severity", "Status", "AI Confidence", "Time"].map(h => (
                    <th key={h} className="text-left text-xs text-[#64748B] font-medium py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {threats.map(t => (
                  <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 text-[#64748B] font-mono text-xs">{t.id}</td>
                    <td className="py-3 px-4 text-[#0F172A] font-medium text-xs">{t.type}</td>
                    <td className="py-3 px-4 text-[#64748B] font-mono text-xs">{t.source}</td>
                    <td className="py-3 px-4 text-[#64748B] text-xs">{t.target}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${sevBg[t.severity]}`}>{t.severity}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBg[t.status]}`}>{t.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${t.confidence}%`, backgroundColor: sevColor[t.severity] }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: sevColor[t.severity] }}>{t.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#94A3B8] text-xs">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Posture tab */}
        {activeTab === "posture" && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {postureSections.map(p => (
                <div key={p.label} className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[#0F172A] font-semibold text-sm">{p.label}</div>
                    <span className="font-bold text-lg" style={{ color: p.color, fontFamily: "Sora, sans-serif" }}>{p.score}%</span>
                  </div>
                  <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.score}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                  <div className="mt-2 text-xs" style={{ color: p.color }}>
                    {p.score >= 90 ? "✓ Compliant" : p.score >= 75 ? "⚠ Needs attention" : "✗ At Risk"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zero Trust tab */}
        {activeTab === "zerotrust" && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {zeroTrustPolicies.map(policy => (
                <div key={policy.name} className="flex items-center gap-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    policy.status === "enforced" ? "bg-[#10B981]/15" : "bg-[#F59E0B]/15"
                  }`}>
                    {policy.status === "enforced"
                      ? <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                      : <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[#0F172A] font-semibold text-sm truncate">{policy.name}</div>
                      <span className={`text-[10px] font-bold ml-2 px-2 py-0.5 rounded-full flex-shrink-0 ${
                        policy.status === "enforced" ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#F59E0B]/15 text-[#F59E0B]"
                      }`}>{policy.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#1BA0D7]" style={{ width: `${policy.coverage}%` }} />
                      </div>
                      <span className="text-xs font-bold text-[#1BA0D7] flex-shrink-0">{policy.coverage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
