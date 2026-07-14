import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Network, CheckCircle2, AlertTriangle, RefreshCw, Settings,
  ExternalLink, ArrowRight, X, Zap, Activity, Clock, Database,
  Shield, Globe, Wifi, Layers, Eye, Key
} from "lucide-react";

const NB  = "#049FD9"; // Cisco Blue
const NBP = "#E5F6FD";
const CB  = "#049FD9"; // Cisco Blue
const CBD = "#005073";
const TT  = "#005073"; // Cisco Teal

const integrations = [
  { id:"meraki",   name:"Cisco Meraki",        sub:"Network Intelligence",        status:"connected", events:"124K", sync:"2m ago",  icon: Wifi,    color: CB,  desc:"SD-Access, wireless telemetry, and switch health data feeds into Nexus Fabric for real-time topology intelligence.", webhooks:3, apiCalls:"1.2M/day" },
  { id:"webex",    name:"Cisco Webex",          sub:"AI Meetings & Messaging",     status:"connected", events:"89K",  sync:"5m ago",  icon: MessageSquare_,color:NB, desc:"Transcription, meeting intelligence, and collaboration signals processed by Nexus Cortex for productivity insights.", webhooks:2, apiCalls:"890K/day" },
  { id:"securex",  name:"Cisco SecureX",        sub:"Threat Detection AI",         status:"connected", events:"67K",  sync:"1m ago",  icon: Shield,  color: TT,  desc:"Unified threat intelligence, IOC feeds, and incident response automation powered by Nexus Sentinel integration.", webhooks:5, apiCalls:"670K/day" },
  { id:"catalyst", name:"Catalyst Center",      sub:"Network Automation",          status:"connected", events:"41K",  sync:"8m ago",  icon: Layers,  color: CB,  desc:"Intent-based networking, device provisioning, and software image management orchestrated via Nexus Fabric agents.", webhooks:4, apiCalls:"410K/day" },
  { id:"duo",      name:"Duo Security",         sub:"Identity AI",                 status:"error",     events:"0",    sync:"Failed",  icon: Key,     color:"#FF5252", desc:"Adaptive MFA and device trust signals. Currently experiencing authentication errors — check API credentials.", webhooks:1, apiCalls:"0/day" },
  { id:"thousandeyes",name:"ThousandEyes",      sub:"Network Observability",       status:"syncing",   events:"28K",  sync:"Syncing", icon: Eye,     color: NB,  desc:"Internet and cloud network visibility with path visualization — actively syncing 28K events from global agents.", webhooks:2, apiCalls:"280K/day" },
  { id:"umbrella", name:"Cisco Umbrella",       sub:"DNS Security AI",             status:"connected", events:"55K",  sync:"3m ago",  icon: Globe,   color: TT,  desc:"DNS-layer security and cloud-delivered security powered by Nexus Sentinel for proactive threat blocking.", webhooks:3, apiCalls:"550K/day" },
  { id:"appdynamics",name:"AppDynamics",        sub:"Application Intelligence",    status:"connected", events:"19K",  sync:"12m ago", icon: Activity,color: CB,  desc:"APM telemetry and business transaction monitoring feeding into Nexus Cortex for service dependency mapping.", webhooks:2, apiCalls:"190K/day" },
];

function MessageSquare_({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}

const statusConfig: Record<string,{label:string,color:string,bg:string,icon:typeof CheckCircle2}> = {
  connected: { label:"Connected",  color:"#66BB6A", bg:"#E0F2F1",  icon: CheckCircle2 },
  error:     { label:"Error",      color:"#FF5252", bg:"#FFEBEE",  icon: AlertTriangle },
  syncing:   { label:"Syncing",    color: CB,       bg:"#EBF5FF",  icon: RefreshCw    },
};

const dataFlow = ["Cisco Product", "Event Stream", "Nexus Ingest", "Myalosis Core", "AI Output"];

export function CiscoHub() {
  const [selected, setSelected] = useState<typeof integrations[0]|null>(null);
  const [toggles, setToggles] = useState<Record<string,boolean>>(() =>
    Object.fromEntries(integrations.map(i => [i.id, i.status === "connected"]))
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: CBD }}>
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[#0D1117]" style={{ fontFamily:"Inter,sans-serif" }}>Nexus AI × Cisco Integration Hub</h1>
                <div className="text-[9px] font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: CBD }}>Alliance Partner</div>
              </div>
              <p className="text-[#64748B] text-sm mt-0.5">8 integrations · {integrations.filter(i=>i.status==="connected").length} connected · Powered by Myalosis Core</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label:"Total Events", value:"423K", color: NB },
              { label:"Connected",    value:"6 / 8",  color:"#66BB6A" },
              { label:"Avg Latency",  value:"9ms",  color: TT },
            ].map(s => (
              <div key={s.label} className="text-center px-4 py-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="font-bold text-sm" style={{ color: s.color, fontFamily:"Inter,sans-serif" }}>{s.value}</div>
                <div className="text-[10px] text-[#64748B]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data flow diagram */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
        <div className="text-[#0D1117] font-semibold text-xs mb-3">Data Flow Architecture</div>
        <div className="flex items-center justify-between">
          {dataFlow.map((node, i) => (
            <div key={node} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-center" style={{
                  backgroundColor: i===0 ? CBD : i===3 ? NB : i===4 ? TT : "#F8FAFC",
                  color: i===0||i===3||i===4 ? "white" : "#475569",
                  border: `1px solid ${i===0 ? CBD : i===3 ? NB : i===4 ? TT : "#E2E8F0"}`
                }}>{node}</div>
              </div>
              {i < dataFlow.length - 1 && (
                <div className="flex-1 flex items-center px-2">
                  <div className="flex-1 h-0.5 relative" style={{ backgroundColor: `${CB}30` }}>
                    <motion.div
                      animate={{ left: ["0%","100%"] }} transition={{ duration:1.5, repeat:Infinity, ease:"linear", delay:i*0.3 }}
                      style={{ width:8, height:"100%", backgroundColor:CB, borderRadius:4, position:"absolute", top:0, left:0 }} />
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#CBD5E1] flex-shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Integration grid */}
      <div className="grid grid-cols-3 gap-4">
        {integrations.map(intg => {
          const Icon = intg.icon;
          const sc = statusConfig[intg.status];
          const StatusIcon = sc.icon;
          const isSelected = selected?.id === intg.id;
          return (
            <motion.div key={intg.id} whileHover={{ y:-2 }}
              className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all shadow-sm hover:shadow-md ${isSelected ? "" : "border-[#E2E8F0]"}`}
              style={isSelected ? { borderColor: intg.color } : {}}
              onClick={() => setSelected(isSelected ? null : intg)}>

              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${intg.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: intg.color }} />
                  </div>
                  <div>
                    <div className="text-[#0D1117] font-semibold text-sm">{intg.name}</div>
                    <div className="text-[#64748B] text-[10px]">{intg.sub}</div>
                  </div>
                </div>
                {/* Toggle */}
                <button onClick={e => { e.stopPropagation(); setToggles(t => ({ ...t, [intg.id]: !t[intg.id] })); }}
                  className={`w-9 h-5 rounded-full transition-colors relative ${toggles[intg.id] ? "" : "bg-[#E2E8F0]"}`}
                  style={toggles[intg.id] ? { backgroundColor: intg.color } : {}}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${toggles[intg.id] ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-center">
                  <div className="text-[#0D1117] font-bold text-sm">{intg.events}</div>
                  <div className="text-[#94A3B8] text-[9px]">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-[#0D1117] font-bold text-sm">{intg.apiCalls}</div>
                  <div className="text-[#94A3B8] text-[9px]">API Calls</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm" style={{ color: sc.color }}>{intg.sync}</div>
                  <div className="text-[#94A3B8] text-[9px]">Last Sync</div>
                </div>
              </div>

              {/* Status + action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.color }}>
                  <StatusIcon className={`w-3 h-3 ${intg.status==="syncing" ? "animate-spin" : ""}`} />
                  {sc.label}
                </div>
                <button onClick={e=>e.stopPropagation()} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[#475569] hover:border-[#1565C0] hover:text-[#1565C0] transition-colors">
                  Configure
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${selected.color}15` }}>
                  <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
                </div>
                <div>
                  <div className="text-[#0D1117] font-bold">{selected.name}</div>
                  <div className="text-[#64748B] text-xs">{selected.sub}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8]"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-[#475569] text-sm leading-relaxed mb-5">{selected.desc}</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label:"Events / day", value:selected.events },
                { label:"API Calls",    value:selected.apiCalls },
                { label:"Webhooks",     value:`${selected.webhooks} configured` },
              ].map(m => (
                <div key={m.label} className="bg-[#F8FAFC] rounded-xl p-3 text-center">
                  <div className="text-[#0D1117] font-bold text-sm">{m.value}</div>
                  <div className="text-[#64748B] text-xs mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: NB }}>
                <Zap className="w-3.5 h-3.5" /> Test Connection
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#1565C0] hover:text-[#1565C0] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Resync
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#1565C0] hover:text-[#1565C0] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> View Docs →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
