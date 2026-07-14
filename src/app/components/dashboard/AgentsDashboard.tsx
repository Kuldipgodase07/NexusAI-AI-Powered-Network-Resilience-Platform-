import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, Filter, Brain, Zap, Activity, MessageSquare,
  CheckCircle2, AlertTriangle, Clock, X, Copy, Trash2,
  ChevronDown, MoreHorizontal, Play, Pause, Settings,
  TrendingUp, BarChart3, RefreshCw
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const NB  = "#049FD9"; // Cisco Blue
const NBP = "#E5F6FD";
const CB  = "#049FD9"; // Cisco Blue
const TT  = "#005073"; // Cisco Teal
const TTP = "#E5F0F5";

const typeColors: Record<string,{bg:string,text:string}> = {
  Inference:  { bg: NBP,    text: NB  },
  Automation: { bg: TTP,    text: TT  },
  Monitoring: { bg: "#EBF5FF", text: CB },
  NLP:        { bg: "#F3E8FF", text: "#7C3AED" },
};
const statusColors: Record<string,string> = {
  Active: "#66BB6A", Idle: "#FFB300", Error: "#FF5252", Deploying: CB,
};

const mockAgents = [
  { id:"a1", name:"NLP-Router-01",    type:"NLP",        model:"Nexus-7B", status:"Active",    reqs:"124K", latency:"8ms",  success:"99.8%", ciscoSvcs:["Meraki","Webex"],            spark:[40,55,70,65,80,90,88] },
  { id:"a2", name:"SecureX-Watcher",  type:"Monitoring", model:"Claude",   status:"Active",    reqs:"89K",  latency:"11ms", success:"99.2%", ciscoSvcs:["SecureX","ThousandEyes"],     spark:[30,42,55,48,62,70,74] },
  { id:"a3", name:"Meraki-Monitor",   type:"Monitoring", model:"Nexus-7B", status:"Active",    reqs:"67K",  latency:"9ms",  success:"100%",  ciscoSvcs:["Meraki","Catalyst"],          spark:[20,35,45,40,55,60,65] },
  { id:"a4", name:"Inference-Scale",  type:"Inference",  model:"GPT-4",    status:"Deploying", reqs:"41K",  latency:"14ms", success:"98.7%", ciscoSvcs:["Webex"],                     spark:[10,20,30,25,35,40,38] },
  { id:"a5", name:"Anomaly-Detect",   type:"Inference",  model:"Nexus-7B", status:"Idle",      reqs:"12K",  latency:"7ms",  success:"99.9%", ciscoSvcs:["ThousandEyes","SecureX"],    spark:[5,8,12,9,14,16,15]   },
  { id:"a6", name:"Cost-Optimizer",   type:"Automation", model:"Claude",   status:"Active",    reqs:"8K",   latency:"13ms", success:"97.4%", ciscoSvcs:["Catalyst"],                  spark:[3,5,7,6,9,11,10]     },
  { id:"a7", name:"Webex-NLP-Agent",  type:"NLP",        model:"Nexus-7B", status:"Active",    reqs:"55K",  latency:"10ms", success:"98.9%", ciscoSvcs:["Webex","Meraki"],            spark:[22,38,52,47,61,68,72] },
  { id:"a8", name:"Threat-Classifier",type:"Inference",  model:"GPT-4",    status:"Error",     reqs:"0",    latency:"—",    success:"0%",    ciscoSvcs:["SecureX"],                   spark:[30,28,25,20,10,5,0]  },
  { id:"a9", name:"Route-Optimizer",  type:"Automation", model:"Nexus-7B", status:"Idle",      reqs:"3K",   latency:"6ms",  success:"100%",  ciscoSvcs:["Catalyst","Meraki"],         spark:[2,4,6,4,7,8,6]       },
];

const tabs = ["All Agents","Active","Scheduled","Archived","My Agents"];

const DETAIL_CONFIG = `{
  "agent_id": "a1",
  "name": "NLP-Router-01",
  "model": "nexus-7b-v2",
  "version": "2.4.1",
  "created_at": "2025-03-12T08:00:00Z",
  "cisco_integrations": ["meraki","webex"],
  "routing": {
    "strategy": "latency-first",
    "fallback": "claude-3-opus"
  },
  "rate_limit": 50000,
  "timeout_ms": 30000,
  "myalosis_context": {
    "namespace": "prod-nlp-v3",
    "top_k": 8
  }
}`;

const executions = [
  { id:"EX-10041", status:"Success", duration:"142ms", ts:"2m ago"  },
  { id:"EX-10040", status:"Success", duration:"138ms", ts:"4m ago"  },
  { id:"EX-10039", status:"Success", duration:"151ms", ts:"7m ago"  },
  { id:"EX-10038", status:"Timeout", duration:"30s",   ts:"12m ago" },
  { id:"EX-10037", status:"Success", duration:"129ms", ts:"15m ago" },
];

function SparkMini({ data, color }: { data: number[], color: string }) {
  const chartData = data.map((v,i) => ({ i, v }));
  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color.replace("#","")})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AgentsDashboard() {
  const [activeTab, setActiveTab] = useState("All Agents");
  const [selected, setSelected] = useState<typeof mockAgents[0]|null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockAgents.filter(a => {
    const matchTab = activeTab === "All Agents" ? true : activeTab === "Active" ? a.status === "Active" : activeTab === "My Agents" ? ["a1","a3","a7"].includes(a.id) : true;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex h-full">
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#0D1117]" style={{ fontFamily:"Inter,sans-serif" }}>AI Agents</h1>
              <p className="text-[#64748B] text-sm mt-0.5">{mockAgents.length} agents · {mockAgents.filter(a=>a.status==="Active").length} active · Myalosis orchestrated</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-md"
              style={{ background:`linear-gradient(135deg,${NB},#1976D2)`, boxShadow:`0 4px 12px ${NB}40` }}>
              <Plus className="w-4 h-4" /> Deploy New Agent
            </button>
          </div>

          {/* Tabs + search */}
          <div className="flex items-center gap-3">
            <div className="flex bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-1 gap-0.5">
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab===t ? "bg-white shadow-sm text-[#0D1117]" : "text-[#64748B] hover:text-[#0D1117]"}`}>
                  {t} {t==="Active" && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{backgroundColor:`${TT}20`,color:TT}}>{mockAgents.filter(a=>a.status==="Active").length}</span>}
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agents..." className="flex-1 bg-transparent text-xs text-[#0D1117] placeholder-[#94A3B8] outline-none" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs text-[#475569] bg-white hover:border-[#CBD5E1]">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>

          {/* Agent card grid */}
          <div className={`grid gap-4 ${selected ? "grid-cols-2" : "grid-cols-3"}`}>
            {filtered.map(agent => {
              const tc = typeColors[agent.type];
              const sc = statusColors[agent.status];
              const isSelected = selected?.id === agent.id;
              return (
                <motion.div key={agent.id} whileHover={{ y:-2 }}
                  onClick={() => setSelected(isSelected ? null : agent)}
                  className={`bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all shadow-sm hover:shadow-md ${isSelected ? "border-[#1565C0]" : "border-[#E2E8F0]"}`}>

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Hexagon avatar */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background:`linear-gradient(135deg,${NB},${CB})` }}>{agent.name[0]}</div>
                      <div>
                        <div className="text-[#0D1117] font-semibold text-sm leading-tight">{agent.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor:tc.bg, color:tc.text }}>{agent.type}</span>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:sc }} />
                          <span className="text-[9px] font-medium" style={{ color:sc }}>{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[#94A3B8] hover:text-[#475569]" onClick={e=>{e.stopPropagation();}}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label:"Requests", value:agent.reqs },
                      { label:"Latency",  value:agent.latency },
                      { label:"Success",  value:agent.success },
                    ].map(m => (
                      <div key={m.label} className="bg-[#F8FAFC] rounded-lg p-2 text-center">
                        <div className="text-[#0D1117] font-bold text-xs">{m.value}</div>
                        <div className="text-[#94A3B8] text-[9px]">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Sparkline */}
                  <div className="mb-3">
                    <SparkMini data={agent.spark} color={agent.status==="Error" ? "#FF5252" : NB} />
                  </div>

                  {/* Model chip + actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: NBP, color: NB }}>{agent.model}</span>
                    <div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                      <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0D1117] transition-colors"><Settings className="w-3 h-3" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0D1117] transition-colors"><BarChart3 className="w-3 h-3" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0D1117] transition-colors">
                        {agent.status==="Active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ width:0, opacity:0 }} animate={{ width:400, opacity:1 }} exit={{ width:0, opacity:0 }}
            transition={{ duration:0.25 }}
            className="flex-shrink-0 border-l border-[#E2E8F0] bg-white overflow-y-auto overflow-x-hidden"
            style={{ width:400 }}>
            <div className="p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold"
                    style={{ background:`linear-gradient(135deg,${NB},${CB})` }}>{selected.name[0]}</div>
                  <div>
                    <div className="text-[#0D1117] font-bold text-sm">{selected.name}</div>
                    <div className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full inline-block mt-0.5"
                      style={{ backgroundColor: typeColors[selected.type].bg, color: typeColors[selected.type].text }}>{selected.type}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8]"><X className="w-4 h-4" /></button>
              </div>

              {/* 7-day performance */}
              <div className="bg-[#F8FAFC] rounded-2xl p-3">
                <div className="text-xs font-semibold text-[#475569] mb-2">7-Day Performance</div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selected.spark.map((v,i)=>({day:`D${i+1}`,v}))}>
                      <defs>
                        <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={NB} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={NB} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize:8, fill:"#94A3B8" }} />
                      <YAxis tick={{ fontSize:8, fill:"#94A3B8" }} />
                      <Tooltip contentStyle={{ background:"#0D1117", border:"none", borderRadius:8, fontSize:10 }} itemStyle={{ color:"#fff" }} />
                      <Area type="monotone" dataKey="v" stroke={NB} strokeWidth={2} fill="url(#detailGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Config JSON */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-[#475569]">Configuration</div>
                  <button className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: NBP, color: NB }}>
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="bg-[#0D1117] text-[#26A69A] rounded-xl p-3 text-[10px] leading-relaxed overflow-x-auto font-mono">{DETAIL_CONFIG}</pre>
              </div>

              {/* Cisco services */}
              <div>
                <div className="text-xs font-semibold text-[#475569] mb-2">Cisco Integrations</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.ciscoSvcs.map(s => (
                    <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor:"#EBF5FF", color: CB }}>✓ {s}</span>
                  ))}
                </div>
              </div>

              {/* Executions */}
              <div>
                <div className="text-xs font-semibold text-[#475569] mb-2">Recent Executions</div>
                <div className="space-y-1.5">
                  {executions.map(ex => (
                    <div key={ex.id} className="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2">
                      <span className="font-mono text-[10px] text-[#64748B]">{ex.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ex.status==="Success" ? "bg-[#E0F2F1] text-[#00897B]" : "bg-[#FFEBEE] text-[#FF5252]"}`}>{ex.status}</span>
                      <span className="font-mono text-[10px] text-[#475569] ml-auto">{ex.duration}</span>
                      <span className="text-[9px] text-[#94A3B8]">{ex.ts}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
                <button className="py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#1565C0] hover:text-[#1565C0] transition-colors">Edit Config</button>
                <button className="py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#1565C0] hover:text-[#1565C0] transition-colors">Full Logs</button>
                <button className="py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#00897B] hover:text-[#00897B] transition-colors">Clone Agent</button>
                <button className="py-2 rounded-xl text-xs font-semibold border border-[#FFEBEE] text-[#FF5252] hover:bg-[#FFEBEE] transition-colors">Delete</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
