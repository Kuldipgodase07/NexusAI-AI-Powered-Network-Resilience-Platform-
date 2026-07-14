import { useState } from "react";
import { motion } from "motion/react";
import {
  Database, Cpu, Zap, FileText, Search, Plus,
  CheckCircle2, Clock, AlertTriangle, RefreshCw,
  Copy, Download, TrendingDown, Layers, Activity, Server
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TT  = "#005073"; // Cisco Teal
const TTP = "#E5F0F5";
const NB  = "#049FD9"; // Cisco Blue
const NBP = "#E5F6FD";
const CB  = "#049FD9"; // Cisco Blue

const tabs = ["Model Registry","Inference Pipeline","Fine-tuning Studio","Prompt Library","Context Monitor","Embedding Index"];

const models = [
  { name:"nexus-7b-v2",   version:"2.4.1", size:"7B",  accuracy:"94.2%", status:"Serving",   gpu:"A100×4",  latency:"8ms"  },
  { name:"nexus-13b-v1",  version:"1.9.0", size:"13B", accuracy:"96.1%", status:"Serving",   gpu:"A100×8",  latency:"14ms" },
  { name:"nexus-7b-ft01", version:"1.0.0", size:"7B",  accuracy:"97.4%", status:"Serving",   gpu:"A100×4",  latency:"9ms"  },
  { name:"nexus-3b-edge", version:"3.1.2", size:"3B",  accuracy:"91.0%", status:"Standby",   gpu:"T4×2",    latency:"4ms"  },
  { name:"nexus-70b-exp", version:"0.1.0", size:"70B", accuracy:"98.7%", status:"Training",  gpu:"H100×16", latency:"—"    },
  { name:"embed-v3",      version:"3.0.0", size:"350M",accuracy:"—",     status:"Serving",   gpu:"A10×2",   latency:"2ms"  },
];

const lossData = Array.from({length:20},(_,i)=>({ step:i*50, loss: Math.max(0.08, 2.4*Math.exp(-i*0.18)+0.08+(Math.random()-0.5)*0.05) }));

const pipelineNodes = [
  { id:"in",    label:"Input",          color: NB,  x:40,  y:120, w:80,  h:40 },
  { id:"tok",   label:"Tokenizer",      color: CB,  x:160, y:120, w:90,  h:40 },
  { id:"pre",   label:"Pre-processor",  color: CB,  x:290, y:80,  w:100, h:40 },
  { id:"emb",   label:"Embedding",      color: CB,  x:290, y:160, w:100, h:40 },
  { id:"model", label:"Nexus-7B Model", color: NB,  x:440, y:120, w:110, h:40 },
  { id:"post",  label:"Post-processor", color: TT,  x:600, y:120, w:110, h:40 },
  { id:"out",   label:"Output",         color: TT,  x:760, y:120, w:80,  h:40 },
];
const pipelineEdges = [
  ["in","tok"],["tok","pre"],["tok","emb"],["pre","model"],["emb","model"],["model","post"],["post","out"]
];

const prompts = [
  { name:"Network RCA",         tags:["analysis","cisco"],   tokens:248, uses:"4.2K" },
  { name:"Threat Classification",tags:["security","securex"]  , tokens:312, uses:"2.8K" },
  { name:"Meeting Summary",     tags:["nlp","webex"],        tokens:189, uses:"6.1K" },
  { name:"Capacity Forecast",   tags:["prediction","meraki"],tokens:276, uses:"1.4K" },
  { name:"Incident Runbook",    tags:["automation"],         tokens:420, uses:"980"  },
  { name:"Code Reviewer",       tags:["dev","general"],      tokens:156, uses:"3.3K" },
];

const sessions = [
  { id:"sess-A1B2", model:"nexus-7b-v2",  tokens:3840, max:8192, user:"A.Chen" },
  { id:"sess-C3D4", model:"nexus-13b-v1", tokens:6100, max:8192, user:"P.Nair" },
  { id:"sess-E5F6", model:"nexus-7b-ft01",tokens:1240, max:4096, user:"System" },
  { id:"sess-G7H8", model:"nexus-3b-edge",tokens:890,  max:2048, user:"D.Okafor"},
];

const namespaces = [
  { name:"prod-v3",    docs:"2.1M", dims:1536, status:"Ready",   searched:"12K/hr"  },
  { name:"staging-v2", docs:"890K", dims:1536, status:"Ready",   searched:"340/hr"  },
  { name:"cisco-rag",  docs:"450K", dims:768,  status:"Indexing", searched:"—"      },
  { name:"archive-v1", docs:"5.4M", dims:1024, status:"Ready",   searched:"12/hr"   },
];

const statusColor: Record<string,string> = { Serving:"#66BB6A", Standby:"#FFB300", Training: NB, Indexing:CB };
const statusBg:    Record<string,string> = { Serving:"#E0F2F1", Standby:"#FFF8E1", Training:NBP, Indexing:"#EBF5FF" };

export function MyalosisConsole() {
  const [activeTab, setActiveTab] = useState("Model Registry");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: TTP }}>
            <Cpu className="w-5 h-5" style={{ color: TT }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[#0D1117]" style={{ fontFamily:"Inter,sans-serif" }}>Myalosis Core Console</h1>
              <div className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: TTP, color: TT }}>Core Engine</div>
            </div>
            <p className="text-[#64748B] text-sm mt-0.5">Model registry · Inference pipeline · Fine-tuning · Embeddings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ backgroundColor: TTP, color: TT }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: TT }} />Engine Healthy
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab===t ? "bg-white shadow-sm text-[#0D1117]" : "text-[#64748B] hover:text-[#0D1117]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Model Registry */}
      {activeTab === "Model Registry" && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="text-[#0D1117] font-semibold text-sm">Deployed Models</div>
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-white" style={{ backgroundColor: TT }}>
              <Plus className="w-3 h-3" /> Register Model
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F1F5F9]">
                {["Model","Version","Size","Accuracy","Status","GPU","Latency","Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-[#64748B] py-2.5 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {models.map(m => (
                <tr key={m.name} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#0D1117] font-semibold">{m.name}</td>
                  <td className="py-3 px-4 text-xs font-mono text-[#64748B]">v{m.version}</td>
                  <td className="py-3 px-4 text-xs font-bold" style={{ color: TT }}>{m.size}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-[#0D1117]">{m.accuracy}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: statusBg[m.status]||"#F8FAFC", color: statusColor[m.status]||"#94A3B8" }}>{m.status}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-[#64748B]">{m.gpu}</td>
                  <td className="py-3 px-4 text-xs font-mono text-[#475569]">{m.latency}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="text-[9px] font-semibold px-2 py-0.5 rounded border border-[#E2E8F0] text-[#475569] hover:border-[#00897B] hover:text-[#00897B] transition-colors">Inspect</button>
                      <button className="text-[9px] font-semibold px-2 py-0.5 rounded border border-[#E2E8F0] text-[#475569] hover:border-[#FF5252] hover:text-[#FF5252] transition-colors">Retire</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inference Pipeline */}
      {activeTab === "Inference Pipeline" && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[#0D1117] font-semibold text-sm">Visual Inference Pipeline Builder</div>
            <div className="flex gap-2">
              <button className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-[#475569]">Save Pipeline</button>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white" style={{ backgroundColor: TT }}>Deploy</button>
            </div>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 overflow-x-auto">
            <svg viewBox="0 0 900 220" className="w-full h-40">
              {pipelineEdges.map(([fid,tid],i) => {
                const fn = pipelineNodes.find(n=>n.id===fid)!;
                const tn = pipelineNodes.find(n=>n.id===tid)!;
                const x1 = fn.x+fn.w, y1 = fn.y+fn.h/2;
                const x2 = tn.x, y2 = tn.y+tn.h/2;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CBD5E1" strokeWidth={1.5} markerEnd="url(#arr)" />;
              })}
              <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#CBD5E1"/></marker></defs>
              {pipelineNodes.map(n => (
                <g key={n.id}>
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8} fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                  <text x={n.x+n.w/2} y={n.y+n.h/2+4} textAnchor="middle" fill={n.color} fontSize={9} fontWeight="700" fontFamily="Inter,sans-serif">{n.label}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-center">
            {[{label:"Avg Throughput",value:"8.2K req/s"},{label:"P99 Latency",value:"24ms"},{label:"Error Rate",value:"0.02%"},{label:"Active Routes",value:"7"}].map(m=>(
              <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                <div className="font-bold text-sm text-[#0D1117]">{m.value}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fine-tuning Studio */}
      {activeTab === "Fine-tuning Studio" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="text-[#0D1117] font-semibold text-sm mb-4">Active Training Job — FT-447</div>
            <div className="space-y-3 mb-4">
              {[{label:"Base Model",value:"nexus-7b-v2"},{label:"Dataset",value:"cisco-rag-v3 (44K samples)"},{label:"Epochs",value:"3 / 5"},{label:"Learning Rate",value:"2e-5"},{label:"GPU",value:"H100×4"},{label:"ETA",value:"~2h 18m"}].map(f=>(
                <div key={f.label} className="flex justify-between text-xs border-b border-[#F8FAFC] pb-2">
                  <span className="text-[#64748B]">{f.label}</span>
                  <span className="font-semibold text-[#0D1117] font-mono">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="mb-2 text-xs text-[#64748B]">Progress — Epoch 3/5</div>
            <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-4">
              <motion.div initial={{width:0}} animate={{width:"62%"}} transition={{duration:0.8}} className="h-full rounded-full" style={{backgroundColor:TT}} />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#475569]">Pause</button>
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{backgroundColor:"#FF5252"}}>Cancel</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="text-[#0D1117] font-semibold text-sm mb-4">Training Loss</div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lossData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="step" tick={{fontSize:9,fill:"#94A3B8"}} />
                  <YAxis tick={{fontSize:9,fill:"#94A3B8"}} />
                  <Tooltip contentStyle={{background:"#0D1117",border:"none",borderRadius:8,fontSize:10}} itemStyle={{color:"#fff"}} />
                  <Line type="monotone" dataKey="loss" stroke={TT} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Library */}
      {activeTab === "Prompt Library" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
              <input placeholder="Search prompts..." className="flex-1 bg-transparent text-xs text-[#0D1117] placeholder-[#94A3B8] outline-none" />
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white" style={{backgroundColor:TT}}><Plus className="w-3.5 h-3.5"/>New Prompt</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {prompts.map(p => (
              <div key={p.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:shadow-sm transition-all">
                <div className="text-[#0D1117] font-semibold text-sm mb-2">{p.name}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.map(t => <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{backgroundColor:TTP,color:TT}}>{t}</span>)}
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>{p.tokens} tokens</span>
                  <span className="font-semibold" style={{color:NB}}>{p.uses} uses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context Monitor */}
      {activeTab === "Context Monitor" && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#0D1117]">Live Token Usage — Active Sessions</div>
          <div className="space-y-3">
            {sessions.map(s => {
              const pct = Math.round((s.tokens/s.max)*100);
              return (
                <div key={s.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#64748B]">{s.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{backgroundColor:NBP,color:NB}}>{s.model}</span>
                      <span className="text-xs text-[#64748B]">{s.user}</span>
                    </div>
                    <div className="text-xs font-bold" style={{color:pct>80?"#FF5252":pct>60?"#FFB300":TT}}>
                      {s.tokens.toLocaleString()} / {s.max.toLocaleString()} tokens ({pct}%)
                    </div>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.6}}
                      className="h-full rounded-full" style={{backgroundColor:pct>80?"#FF5252":pct>60?"#FFB300":TT}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embedding Index */}
      {activeTab === "Embedding Index" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {namespaces.map(ns => (
              <div key={ns.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#0D1117] font-semibold text-sm font-mono">{ns.name}</div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{backgroundColor:ns.status==="Ready"?TTP:"#EBF5FF",color:ns.status==="Ready"?TT:CB}}>{ns.status}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-[#64748B]">Documents</span><span className="font-mono font-semibold text-[#0D1117]">{ns.docs}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748B]">Dimensions</span><span className="font-mono font-semibold text-[#0D1117]">{ns.dims}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748B]">Searches</span><span className="font-mono font-semibold" style={{color:TT}}>{ns.searched}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="text-[#0D1117] font-semibold text-sm mb-3">Test Semantic Search</div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                <input defaultValue="WAN link flap remediation playbook" className="flex-1 bg-transparent text-xs text-[#0D1117] outline-none font-mono" />
              </div>
              <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{backgroundColor:TT}}>Search</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
