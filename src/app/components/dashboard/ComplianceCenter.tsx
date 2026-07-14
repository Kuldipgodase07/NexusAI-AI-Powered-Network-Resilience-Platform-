import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield, CheckCircle2, AlertTriangle, Clock, Key, Eye,
  Download, RefreshCw, Plus, Trash2, Copy, Globe, Lock
} from "lucide-react";

const NB  = "#049FD9";
const NBP = "#E5F6FD";
const TT  = "#005073";
const TTP = "#E5F0F5";
const CB  = "#049FD9";

const tabs = ["Compliance Scorecard","Access Control","Audit Log","API Keys","Security Alerts"];

const compliance = [
  { name:"SOC 2 Type II", pct:98, color: TT,    status:"Certified"    },
  { name:"ISO 27001",     pct:100,color: TT,    status:"Certified"    },
  { name:"FedRAMP",       pct:72, color: CB,    status:"In Progress"  },
  { name:"HIPAA",         pct:95, color: TT,    status:"Compliant"    },
  { name:"GDPR",          pct:100,color: TT,    status:"Certified"    },
];

function Ring({ pct, color, size=80 }: { pct:number, color:string, size?:number }) {
  const r = size/2 - 8;
  const circ = 2 * Math.PI * r;
  const dash = (pct/100)*circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={7}/>
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeLinecap="round" strokeDasharray={`${circ}`} strokeDashoffset={circ}
        style={{ transformOrigin:"center", transform:"rotate(-90deg)" }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration:1.2, ease:"easeOut" }}/>
      <text x={size/2} y={size/2+5} textAnchor="middle" fill="#0D1117" fontSize={14} fontWeight="700" fontFamily="Inter,sans-serif">{pct}%</text>
    </svg>
  );
}

const roleMatrix = [
  { role:"Super Admin", read:true,  write:true,  delete:true,  deploy:true,  audit:true  },
  { role:"Admin",       read:true,  write:true,  delete:true,  deploy:true,  audit:true  },
  { role:"Developer",   read:true,  write:true,  delete:false, deploy:true,  audit:false },
  { role:"Analyst",     read:true,  write:false, delete:false, deploy:false, audit:true  },
  { role:"Viewer",      read:true,  write:false, delete:false, deploy:false, audit:false },
];
const permissions = ["Read","Write","Delete","Deploy","Audit"];

const auditLog = [
  { id:"AL-9012", user:"A. Chen",    action:"Deployed NLP-Router-01 to production",          resource:"Agent",      ts:"2m ago",   sev:"Info"   },
  { id:"AL-9011", user:"System",     action:"SecureX IOC sync — 847 new indicators",          resource:"Integration",ts:"5m ago",   sev:"Info"   },
  { id:"AL-9010", user:"P. Nair",    action:"Exported SOC 2 compliance report",               resource:"Compliance",  ts:"18m ago",  sev:"Info"   },
  { id:"AL-9009", user:"D. Okafor", action:"Modified inference pipeline routing rules",      resource:"Pipeline",   ts:"24m ago",  sev:"Medium" },
  { id:"AL-9008", user:"Unknown",    action:"Failed login attempt from 198.51.100.22",        resource:"Auth",       ts:"31m ago",  sev:"High"   },
  { id:"AL-9007", user:"A. Chen",    action:"Created API key — scope: read:agents,write:jobs",resource:"API Key",    ts:"44m ago",  sev:"Info"   },
  { id:"AL-9006", user:"System",     action:"Myalosis fine-tune job FT-447 completed",        resource:"Model",      ts:"58m ago",  sev:"Info"   },
  { id:"AL-9005", user:"P. Nair",    action:"Revoked API key nx-k8d2...3f9a",                resource:"API Key",    ts:"1h ago",   sev:"Medium" },
];

const apiKeys = [
  { name:"Production Read",   key:"nx-k4a1...9f2d", scopes:["read:agents","read:events"],       lastUsed:"2m ago",  created:"2025-01-15" },
  { name:"CI/CD Deploy",      key:"nx-b8e2...7c4f", scopes:["write:agents","deploy:pipelines"], lastUsed:"12m ago", created:"2025-02-20" },
  { name:"Analytics Export",  key:"nx-f3d9...2b1e", scopes:["read:analytics"],                  lastUsed:"1h ago",  created:"2025-03-01" },
  { name:"SecureX Webhook",   key:"nx-a7c5...8d3b", scopes:["write:events","read:threats"],     lastUsed:"3m ago",  created:"2025-03-10" },
];

const alerts = [
  { id:"SA-001", sev:"Critical", title:"Unauthorized API key usage from unknown IP",    time:"2m ago",  remediation:"Block IP via Cisco Umbrella DNS policy — 1-click auto-remediation available." },
  { id:"SA-002", sev:"High",     title:"Duo Security integration auth failure × 8",    time:"31m ago", remediation:"Rotate Duo API credentials in Settings → Integrations → Duo Security." },
  { id:"SA-003", sev:"Medium",   title:"FedRAMP control CM-7 gap detected",            time:"2h ago",  remediation:"Enable strict application allowlisting in Nexus Sentinel configuration." },
  { id:"SA-004", sev:"Medium",   title:"90-day audit log export overdue",              time:"3h ago",  remediation:"Export audit logs to your SIEM immediately to maintain compliance posture." },
  { id:"SA-005", sev:"Low",      title:"3 API keys unused for 60+ days",              time:"1d ago",  remediation:"Review and revoke stale API keys in API Keys management panel." },
];

const sevConfig: Record<string,{bg:string,text:string,border:string}> = {
  Critical:{ bg:"#FFEBEE", text:"#FF5252", border:"#FFCDD2" },
  High:    { bg:"#FFF8E1", text:"#FFB300", border:"#FFE082" },
  Medium:  { bg:NBP,       text:NB,        border:"#BBDEFB" },
  Low:     { bg:TTP,       text:TT,        border:"#B2DFDB" },
  Info:    { bg:"#F8FAFC", text:"#64748B", border:"#E2E8F0" },
};

export function ComplianceCenter() {
  const [activeTab, setActiveTab] = useState("Compliance Scorecard");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:NBP}}>
            <Shield className="w-5 h-5" style={{color:NB}}/>
          </div>
          <div>
            <h1 className="text-[#0D1117]" style={{fontFamily:"Inter,sans-serif"}}>Security & Compliance Center</h1>
            <p className="text-[#64748B] text-sm mt-0.5">5 frameworks · SOC 2 certified · AI-assisted remediation</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:`linear-gradient(135deg,${NB},#1976D2)`}}>
          <Download className="w-3.5 h-3.5"/> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-1">
        {tabs.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab===t?"bg-white shadow-sm text-[#0D1117]":"text-[#64748B]"}`}>{t}</button>
        ))}
      </div>

      {/* Compliance Scorecard */}
      {activeTab==="Compliance Scorecard" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="text-[#0D1117] font-semibold text-sm mb-6">Compliance Framework Coverage</div>
            <div className="flex items-center justify-around flex-wrap gap-8">
              {compliance.map(c => (
                <div key={c.name} className="flex flex-col items-center gap-3">
                  <Ring pct={c.pct} color={c.color}/>
                  <div className="text-center">
                    <div className="text-[#0D1117] font-semibold text-sm">{c.name}</div>
                    <div className="text-xs font-bold mt-0.5" style={{color:c.color}}>{c.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {label:"Last Audit",     value:"2025-03-01",     icon:Clock,  color:NB},
              {label:"Open Controls", value:"3 gaps (FedRAMP)",icon:AlertTriangle,color:"#FFB300"},
              {label:"Next Review",   value:"2025-06-15",     icon:CheckCircle2,color:TT},
            ].map(m=>{const Icon=m.icon;return(
              <div key={m.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{backgroundColor:`${m.color}15`}}>
                  <Icon className="w-4.5 h-4.5" style={{color:m.color}}/>
                </div>
                <div><div className="text-[#0D1117] font-bold text-sm">{m.value}</div><div className="text-[#64748B] text-xs">{m.label}</div></div>
              </div>
            );})}
          </div>
        </div>
      )}

      {/* Access Control */}
      {activeTab==="Access Control" && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E2E8F0] text-[#0D1117] font-semibold text-sm">Role × Permission Matrix</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  <th className="text-left text-xs font-medium text-[#64748B] py-3 px-5">Role</th>
                  {permissions.map(p=><th key={p} className="text-center text-xs font-medium text-[#64748B] py-3 px-4">{p}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {roleMatrix.map(r=>(
                  <tr key={r.role} className="hover:bg-[#F8FAFC]">
                    <td className="py-3.5 px-5 font-semibold text-sm text-[#0D1117]">{r.role}</td>
                    {[r.read,r.write,r.delete,r.deploy,r.audit].map((v,i)=>(
                      <td key={i} className="py-3.5 px-4 text-center">
                        {v ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{color:TT}}/> : <div className="w-4 h-4 mx-auto rounded-full bg-[#F1F5F9]"/>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log */}
      {activeTab==="Audit Log" && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="text-[#0D1117] font-semibold text-sm">Audit Log — 90-day retention</div>
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-[#475569]"><Download className="w-3 h-3"/>Export</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#F1F5F9]">
              {["ID","User","Action","Resource","Time","Severity"].map(h=><th key={h} className="text-left text-xs font-medium text-[#64748B] py-2.5 px-4">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {auditLog.map(l=>{const sc=sevConfig[l.sev];return(
                <tr key={l.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-mono text-xs text-[#64748B]">{l.id}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-[#0D1117]">{l.user}</td>
                  <td className="py-3 px-4 text-xs text-[#475569]">{l.action}</td>
                  <td className="py-3 px-4"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{backgroundColor:NBP,color:NB}}>{l.resource}</span></td>
                  <td className="py-3 px-4 text-xs text-[#94A3B8]">{l.ts}</td>
                  <td className="py-3 px-4"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{backgroundColor:sc.bg,color:sc.text}}>{l.sev}</span></td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      )}

      {/* API Keys */}
      {activeTab==="API Keys" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white" style={{backgroundColor:NB}}><Plus className="w-3.5 h-3.5"/>New API Key</button>
          </div>
          <div className="space-y-3">
            {apiKeys.map(k=>(
              <div key={k.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:NBP}}><Key className="w-4.5 h-4.5" style={{color:NB}}/></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-[#0D1117] font-semibold text-sm">{k.name}</div>
                    <code className="text-xs font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded">{k.key}</code>
                    <button className="text-[#94A3B8] hover:text-[#1565C0]"><Copy className="w-3.5 h-3.5"/></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {k.scopes.map(s=><span key={s} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{backgroundColor:TTP,color:TT}}>{s}</span>)}
                  </div>
                </div>
                <div className="text-right mr-4">
                  <div className="text-[#0D1117] text-xs font-semibold">Last used: {k.lastUsed}</div>
                  <div className="text-[#94A3B8] text-[10px]">Created {k.created}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] hover:border-[#FFB300] hover:text-[#FFB300] transition-colors">Rotate</button>
                  <button className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#FFEBEE] text-[#FF5252] hover:bg-[#FFEBEE] transition-colors">Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Alerts */}
      {activeTab==="Security Alerts" && (
        <div className="space-y-3">
          {alerts.map(a=>{const sc=sevConfig[a.sev];return(
            <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border-l-4" style={{borderColor:sc.text,border:`1px solid ${sc.border}`,borderLeft:`4px solid ${sc.text}`}}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{backgroundColor:sc.bg,color:sc.text}}>{a.sev}</span>
                  <div className="text-[#0D1117] font-semibold text-sm">{a.title}</div>
                </div>
                <span className="text-[#94A3B8] text-xs flex-shrink-0">{a.time}</span>
              </div>
              <div className="flex items-start gap-2 bg-[#F8FAFC] rounded-xl p-3">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:NB}}/>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{color:NB}}>AI Remediation</div>
                  <div className="text-[#475569] text-xs leading-relaxed">{a.remediation}</div>
                </div>
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}
