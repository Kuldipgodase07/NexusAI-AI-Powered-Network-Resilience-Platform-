import { motion } from "motion/react";
import {
  Zap, Activity, Network, AlertTriangle, TrendingUp, TrendingDown,
  Brain, CheckCircle2, RefreshCw, Terminal, Search, BarChart3,
  ArrowUpRight, Clock, Server, Shield, Cpu, Database
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const NB  = "#049FD9"; // Cisco Blue
const NBL = "#0390C5";
const NBP = "#E5F6FD";
const CB  = "#049FD9"; // Cisco Blue
const TT  = "#005073"; // Cisco Teal
const TTP = "#E5F0F5";

/* ── Mock data ── */
const inferenceData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  requests: Math.round(80000 + Math.sin(i * 0.4) * 30000 + i * 2000),
  errors:   Math.round(200  + Math.sin(i * 0.3) * 150),
}));

const kpis = [
  { label: "Total API Requests", value: "2.4M",  delta: "+12%", up: true,  icon: Zap,       color: NB  },
  { label: "Active AI Agents",   value: "147",    delta: "+3",   up: true,  icon: Brain,     color: TT  },
  { label: "Network Events",     value: "890K",   delta: "+8%",  up: true,  icon: Activity,  color: CB  },
  { label: "Anomalies Detected", value: "12",     delta: "↓40%", up: false, icon: AlertTriangle, color: "#66BB6A" },
];

const agents = [
  { name: "NLP-Router-01",    model: "Nexus-7B", status: "Active",    reqs: "124K",  latency: "8ms",  success: "99.8%" },
  { name: "SecureX-Watcher",  model: "Claude",   status: "Active",    reqs: "89K",   latency: "11ms", success: "99.2%" },
  { name: "Meraki-Monitor",   model: "Nexus-7B", status: "Active",    reqs: "67K",   latency: "9ms",  success: "100%"  },
  { name: "Inference-Scale",  model: "GPT-4",    status: "Deploying", reqs: "41K",   latency: "14ms", success: "98.7%" },
  { name: "Anomaly-Detect",   model: "Nexus-7B", status: "Idle",      reqs: "12K",   latency: "7ms",  success: "99.9%" },
  { name: "Cost-Optimizer",   model: "Claude",   status: "Active",    reqs: "8K",    latency: "13ms", success: "97.4%" },
];

const events = [
  { type: "alert",   icon: AlertTriangle, color: "#FF5252", label: "Meraki MR52 — link flap detected",              time: "2m ago",  sev: "High"   },
  { type: "info",    icon: CheckCircle2,  color: TT,         label: "SecureX threat bundle ingested (847 IOCs)",      time: "5m ago",  sev: "Info"   },
  { type: "warn",    icon: Activity,      color: "#FFB300",  label: "Catalyst Center — BGP route withdrawal WAN-E2",  time: "9m ago",  sev: "Medium" },
  { type: "alert",   icon: AlertTriangle, color: "#FF5252",  label: "ThousandEyes — path latency spike +340ms",       time: "14m ago", sev: "High"   },
  { type: "info",    icon: Network,       color: CB,         label: "Webex AI transcript job completed",              time: "18m ago", sev: "Info"   },
  { type: "info",    icon: CheckCircle2,  color: TT,         label: "Duo MFA policy sync — 1,240 identities",         time: "22m ago", sev: "Info"   },
  { type: "warn",    icon: Cpu,           color: "#FFB300",  label: "Nexus-7B model — GPU utilization 87%",            time: "31m ago", sev: "Medium" },
  { type: "info",    icon: Database,      color: NB,         label: "Embedding index re-indexed (2.1M vectors)",      time: "45m ago", sev: "Info"   },
];

const ciscoIntegrations = [
  { name: "Meraki",        status: "ok"  },
  { name: "Webex",         status: "ok"  },
  { name: "SecureX",       status: "ok"  },
  { name: "Catalyst",      status: "ok"  },
  { name: "Duo",           status: "err" },
  { name: "ThousandEyes",  status: "sync"},
];

const activity = [
  { user: "System",   action: "Auto-remediated BGP flap via Nexus Resolve",    time: "2m ago"  },
  { user: "A. Chen",  action: "Deployed NLP-Router-01 agent to prod",           time: "8m ago"  },
  { user: "System",   action: "Myalosis fine-tune job #FT-447 completed",       time: "15m ago" },
  { user: "P. Nair",  action: "Exported compliance report — SOC 2 Q4",         time: "22m ago" },
  { user: "System",   action: "Cisco SecureX threat sync — 847 new IOCs",      time: "31m ago" },
  { user: "D. Okafor",action: "Updated inference pipeline routing rules",       time: "44m ago" },
  { user: "System",   action: "Embedding namespace 'prod-v3' re-indexed",       time: "58m ago" },
  { user: "A. Chen",  action: "Invited 3 team members to Nexus AI workspace",  time: "1h ago"  },
];

const statusColor: Record<string, string> = {
  Active:    "#66BB6A", Idle: "#FFB300", Deploying: CB, Error: "#FF5252",
};
const sevBg: Record<string, string> = {
  High:   "bg-[#FFEBEE] text-[#FF5252]",
  Medium: "bg-[#FFF8E1] text-[#FFB300]",
  Info:   "bg-[#E0F2F1] text-[#00897B]",
};

export function CommandCenter() {
  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-[#0D1117]" style={{ fontFamily:"Inter,sans-serif" }}>Command Center</h1>
            <div className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style={{ backgroundColor: TTP, color: TT }}>Powered by Myalosis</div>
          </div>
          <p className="text-[#64748B] text-sm">Real-time AI operations · Cisco network fabric · Live telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#475569] border border-[#E2E8F0] rounded-xl bg-white hover:border-[#CBD5E1]">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: NBP, color: NB }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: NB }} /> Live
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: k.color }} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${k.up ? "text-[#66BB6A]" : "text-[#66BB6A]"}`}>
                  {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3 text-[#66BB6A]" />}
                  {k.delta}
                </div>
              </div>
              <div className="text-[#0D1117] font-bold text-2xl mb-0.5" style={{ fontFamily:"Inter,sans-serif" }}>{k.value}</div>
              <div className="text-[#64748B] text-xs">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">

        {/* Left 65% */}
        <div className="col-span-8 space-y-4">

          {/* Inference chart */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[#0D1117] font-semibold text-sm">Real-time Inference Engine</div>
                <div className="text-[#64748B] text-xs mt-0.5">API requests vs. errors · Last 24 hours</div>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: NB }} /><span className="text-[#64748B]">Requests</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FF5252]" /><span className="text-[#64748B]">Errors</span></div>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inferenceData}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={NB} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={NB} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#FF5252" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FF5252" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="h" tick={{ fontSize:9, fill:"#94A3B8" }} interval={3} />
                  <YAxis tick={{ fontSize:9, fill:"#94A3B8" }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                  <Tooltip contentStyle={{ background:"#0D1117", border:"none", borderRadius:8, fontSize:11 }} labelStyle={{ color:"#94A3B8" }} itemStyle={{ color:"#fff" }} />
                  <Area type="monotone" dataKey="requests" stroke={NB}      strokeWidth={2} fill="url(#reqGrad)" />
                  <Area type="monotone" dataKey="errors"   stroke="#FF5252" strokeWidth={1.5} fill="url(#errGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active agents table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="text-[#0D1117] font-semibold text-sm">Active Agent Table</div>
              <button className="text-xs font-semibold flex items-center gap-1" style={{ color: NB }}>View All <ArrowUpRight className="w-3 h-3" /></button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {["Agent Name","Model","Status","Requests","Latency","Success","Action"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-[#64748B] py-2.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {agents.map(a => (
                  <tr key={a.name} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: NB }}>{a.name[0]}</div>
                        <span className="text-[#0D1117] font-medium text-xs">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#E3F2FD] text-[#1565C0]">{a.model}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor[a.status] || "#94A3B8" }} />
                        <span className="text-xs" style={{ color: statusColor[a.status] || "#94A3B8" }}>{a.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-[#475569]">{a.reqs}</td>
                    <td className="py-3 px-4 text-xs font-mono text-[#475569]">{a.latency}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-[#66BB6A]">{a.success}</td>
                    <td className="py-3 px-4">
                      <button className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#E2E8F0] text-[#475569] hover:border-[#1565C0] hover:text-[#1565C0] transition-colors">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cisco Network Events Feed */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="text-[#0D1117] font-semibold text-sm">Cisco Network Events</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: TT }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: TT }} /> Live
              </div>
            </div>
            <div className="divide-y divide-[#F8FAFC] max-h-52 overflow-y-auto">
              {events.map((e, i) => {
                const Icon = e.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#F8FAFC]">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${e.color}15` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: e.color }} />
                    </div>
                    <span className="flex-1 text-xs text-[#0D1117]">{e.label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${sevBg[e.sev]}`}>{e.sev}</span>
                    <span className="text-[#94A3B8] text-[10px] flex-shrink-0">{e.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 35% */}
        <div className="col-span-4 space-y-4">

          {/* AI Insight Card */}
          <div className="bg-white rounded-2xl border-2 border-[#E3F2FD] p-4 shadow-sm" style={{ borderColor: `${NB}30` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: NBP }}>
                <Brain className="w-3.5 h-3.5" style={{ color: NB }} />
              </div>
              <div className="text-[#0D1117] font-semibold text-sm">Top AI Insight</div>
              <div className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: NBP, color: NB }}>Priority 1</div>
            </div>
            <p className="text-[#0D1117] text-xs leading-relaxed mb-3">
              <strong>Anomaly cluster detected:</strong> ThousandEyes shows +340ms latency spike on WAN-EAST correlating with Meraki link flap on MR52. SecureX has 3 related threat IOCs.
            </p>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#64748B]">AI Confidence</span>
                <span className="font-bold" style={{ color: NB }}>91%</span>
              </div>
              <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:"91%" }} transition={{ duration:0.8 }}
                  className="h-full rounded-full" style={{ backgroundColor: NB }} />
              </div>
            </div>
            <button className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all" style={{ background:`linear-gradient(135deg,${NB},${NBL})` }}>
              Investigate with Nexus Cortex →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="text-[#0D1117] font-semibold text-sm mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:"Deploy Agent", icon: Zap,      color: NB },
                { label:"View Logs",   icon: Terminal,  color: TT },
                { label:"Run Query",   icon: Search,    color: CB },
                { label:"Escalate",    icon: AlertTriangle, color:"#FF5252" },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#E2E8F0] hover:border-current transition-all" style={{ color: a.color }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${a.color}15` }}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#0D1117]">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cisco Integration Status */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="text-[#0D1117] font-semibold text-sm mb-3">Cisco Integration Status</div>
            <div className="grid grid-cols-3 gap-2">
              {ciscoIntegrations.map(c => (
                <div key={c.name} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    c.status==="ok" ? "bg-[#66BB6A]" : c.status==="err" ? "bg-[#FF5252]" : "bg-[#FFB300]"
                  }`}>
                    {c.status==="ok" && <CheckCircle2 className="w-3 h-3 text-white" />}
                    {c.status==="err" && <AlertTriangle className="w-3 h-3 text-white" />}
                    {c.status==="sync" && <RefreshCw className="w-3 h-3 text-white animate-spin" />}
                  </div>
                  <span className="text-[9px] font-semibold text-[#475569] text-center">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E2E8F0]">
              <div className="text-[#0D1117] font-semibold text-sm">Recent Activity</div>
            </div>
            <div className="divide-y divide-[#F8FAFC] max-h-52 overflow-y-auto">
              {activity.map((a, i) => (
                <div key={i} className="px-4 py-2.5 hover:bg-[#F8FAFC]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold" style={{ color: a.user === "System" ? NB : TT }}>{a.user}</span>
                    <span className="text-[#94A3B8] text-[9px]">{a.time}</span>
                  </div>
                  <div className="text-[#475569] text-[10px] leading-snug">{a.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
