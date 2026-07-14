import { useState } from "react";
import { Download, Share2, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const NB = "#049FD9"; // Cisco Blue const NBL = "#0390C5"; const NBP = "#E5F6FD";
const CB = "#049FD9"; const TT = "#005073"; const TTP = "#E5F0F5";

const ranges = ["Last 7d","30d","90d","Custom range"];

const apiUsage = Array.from({length:30},(_,i)=>({
  day: `D${i+1}`,
  requests: Math.round(70000+Math.sin(i*0.4)*25000+i*1000),
  errors:   Math.round(200+Math.sin(i*0.3)*150),
}));

const latencyByModel = [
  { model:"Nexus-7B",  p50:8,  p95:14, p99:24 },
  { model:"Nexus-13B", p50:14, p95:22, p99:38 },
  { model:"Claude",    p50:11, p95:18, p99:32 },
  { model:"GPT-4",     p50:16, p95:28, p99:45 },
];

const modelPerf = [
  { model:"Nexus-7B",  accuracy:94.2, throughput:8200, cost:0.0008 },
  { model:"Nexus-13B", accuracy:96.1, throughput:4100, cost:0.0018 },
  { model:"Claude",    accuracy:95.3, throughput:5800, cost:0.0024 },
  { model:"GPT-4",     accuracy:97.1, throughput:3200, cost:0.0045 },
];

const costData = [
  { name:"Platform Eng",  value:34, color: NB },
  { name:"Data Science",  value:22, color: CB },
  { name:"Security",      value:18, color: TT },
  { name:"Operations",    value:14, color:"#7C3AED" },
  { name:"Other",         value:12, color:"#94A3B8" },
];

const anomalies = Array.from({length:40},(_,i)=>({
  t: i*6,
  v: Math.random()*100,
  sev: Math.random() > 0.85 ? "high" : Math.random() > 0.7 ? "medium" : "low",
  r: Math.random()*8+4,
}));

const correlation = Array.from({length:24},(_,i)=>({
  h:`${i}:00`,
  netEvents: Math.round(400+Math.sin(i*0.5)*200+(i>12?i*15:0)),
  aiCalls:   Math.round(80000+Math.sin(i*0.4)*30000+(i>12?i*1500:0)),
}));

const kpis = [
  { label:"Total Requests (30d)", value:"72.4M", delta:"+18%", up:true, color: NB },
  { label:"Avg Latency",          value:"10.2ms", delta:"-1.4ms", up:false, color: TT },
  { label:"Success Rate",         value:"99.84%", delta:"+0.2%",  up:true,  color:"#66BB6A" },
  { label:"Compute Cost",         value:"$14.2K", delta:"-8%",   up:false, color: CB },
];

const sevColor: Record<string,string> = { high:"#FF5252", medium:"#FFB300", low: NB };

export function NexusAnalytics() {
  const [range, setRange] = useState("Last 7d");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0D1117]" style={{ fontFamily:"Inter,sans-serif" }}>Analytics & Intelligence</h1>
          <p className="text-[#64748B] text-sm mt-0.5">AI platform performance · Model benchmarks · Cost attribution</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-1">
            {ranges.map(r => (
              <button key={r} onClick={()=>setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range===r?"bg-white shadow-sm text-[#0D1117]":"text-[#64748B]"}`}>{r}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-[#E2E8F0] rounded-xl text-[#475569] bg-white">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-[#E2E8F0] rounded-xl text-[#475569] bg-white">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
            <div className="text-[#0D1117] font-bold text-2xl mb-0.5" style={{ fontFamily:"Inter,sans-serif", color: k.color }}>{k.value}</div>
            <div className="text-[#64748B] text-xs mb-2">{k.label}</div>
            <div className={`flex items-center gap-1 text-xs font-bold ${k.up ? "text-[#66BB6A]" : "text-[#00897B]"}`}>
              {k.up ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}{k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-4">
        {/* API Usage */}
        <div className="col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[#0D1117] font-semibold text-sm">API Usage Over Time</div>
              <div className="text-[#64748B] text-xs">Requests vs. errors (30 days)</div>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor:NB}}/><span className="text-[#64748B]">Requests</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FF5252]"/><span className="text-[#64748B]">Errors</span></div>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apiUsage}>
                <defs>
                  <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={NB} stopOpacity={0.25}/><stop offset="95%" stopColor={NB} stopOpacity={0}/></linearGradient>
                  <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF5252" stopOpacity={0.2}/><stop offset="95%" stopColor="#FF5252" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="day" tick={{fontSize:9,fill:"#94A3B8"}} interval={4}/>
                <YAxis tick={{fontSize:9,fill:"#94A3B8"}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                <Tooltip contentStyle={{background:"#0D1117",border:"none",borderRadius:8,fontSize:11}} labelStyle={{color:"#94A3B8"}} itemStyle={{color:"#fff"}}/>
                <Area type="monotone" dataKey="requests" stroke={NB} strokeWidth={2} fill="url(#ag1)"/>
                <Area type="monotone" dataKey="errors" stroke="#FF5252" strokeWidth={1.5} fill="url(#ag2)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Attribution */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <div className="text-[#0D1117] font-semibold text-sm mb-1">Cost Attribution</div>
          <div className="text-[#64748B] text-xs mb-3">By team / department</div>
          <div className="h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {costData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"#0D1117",border:"none",borderRadius:8,fontSize:11}} itemStyle={{color:"#fff"}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-1">
            {costData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor:d.color}}/><span className="text-[#64748B]">{d.name}</span></div>
                <span className="font-bold text-[#0D1117]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Model Performance */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <div className="text-[#0D1117] font-semibold text-sm mb-1">Model Performance Comparison</div>
          <div className="text-[#64748B] text-xs mb-4">Accuracy · Throughput (req/s) · Cost ($/K tokens)</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelPerf} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="model" tick={{fontSize:9,fill:"#94A3B8"}}/>
                <YAxis yAxisId="left" tick={{fontSize:9,fill:"#94A3B8"}}/>
                <YAxis yAxisId="right" orientation="right" tick={{fontSize:9,fill:"#94A3B8"}}/>
                <Tooltip contentStyle={{background:"#0D1117",border:"none",borderRadius:8,fontSize:11}} itemStyle={{color:"#fff"}}/>
                <Bar yAxisId="left" dataKey="accuracy" fill={NB} radius={[4,4,0,0]} maxBarSize={20}/>
                <Bar yAxisId="left" dataKey="throughput" fill={TT} radius={[4,4,0,0]} maxBarSize={20}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Distribution */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <div className="text-[#0D1117] font-semibold text-sm mb-1">Latency Distribution</div>
          <div className="text-[#64748B] text-xs mb-4">P50 / P95 / P99 by model (ms)</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyByModel} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="model" tick={{fontSize:9,fill:"#94A3B8"}}/>
                <YAxis tick={{fontSize:9,fill:"#94A3B8"}}/>
                <Tooltip contentStyle={{background:"#0D1117",border:"none",borderRadius:8,fontSize:11}} itemStyle={{color:"#fff"}}/>
                <Bar dataKey="p50" fill={TT}  radius={[4,4,0,0]} maxBarSize={16}/>
                <Bar dataKey="p95" fill={NB}  radius={[4,4,0,0]} maxBarSize={16}/>
                <Bar dataKey="p99" fill="#FF5252" radius={[4,4,0,0]} maxBarSize={16}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3 - full width correlation */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[#0D1117] font-semibold text-sm">Cisco Network × AI Event Correlation</div>
            <div className="text-[#64748B] text-xs">Network events (left axis) vs. AI inference calls (right axis) — correlated spikes highlighted</div>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor:CB}}/><span className="text-[#64748B]">Network Events</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{backgroundColor:TT}}/><span className="text-[#64748B]">AI Inference Calls</span></div>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={correlation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="h" tick={{fontSize:9,fill:"#94A3B8"}} interval={2}/>
              <YAxis yAxisId="net" tick={{fontSize:9,fill:"#94A3B8"}} tickFormatter={v=>`${v}`}/>
              <YAxis yAxisId="ai" orientation="right" tick={{fontSize:9,fill:"#94A3B8"}} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={{background:"#0D1117",border:"none",borderRadius:8,fontSize:11}} labelStyle={{color:"#94A3B8"}} itemStyle={{color:"#fff"}}/>
              <Line yAxisId="net" type="monotone" dataKey="netEvents" stroke={CB} strokeWidth={2} dot={false}/>
              <Line yAxisId="ai" type="monotone" dataKey="aiCalls" stroke={TT} strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
