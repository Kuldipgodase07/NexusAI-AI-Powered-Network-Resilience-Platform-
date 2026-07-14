import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GitBranch, AlertTriangle, Clock, Server, ChevronRight, Brain, CheckCircle2, ArrowRight, Layers, Zap } from "lucide-react";

const incidents = [
  { id: "INC-2847", title: "Core Router Packet Loss >15%", node: "AS-CORE-01", severity: "critical", started: "14 min ago", status: "investigating" },
  { id: "INC-2846", title: "BGP Peer Session Down", node: "EDGE-RTR-02", severity: "warning", started: "2h 8m ago", status: "resolved" },
  { id: "INC-2845", title: "WAN Link High Latency", node: "WAN-EAST-01", severity: "warning", started: "38m ago", status: "resolved" },
];

const timelineEvents = [
  { time: "14:32:01", type: "alert", msg: "Packet loss threshold breached — 15.3% on AS-CORE-01 → DIST-CENT-01" },
  { time: "14:31:48", type: "detection", msg: "AI anomaly detection flagged abnormal interface error counters" },
  { time: "14:30:22", type: "change", msg: "Interface GigE0/0/1 counters showing CRC error spike (+340%)" },
  { time: "14:28:15", type: "baseline", msg: "Traffic pattern deviation detected — 3σ above normal baseline" },
  { time: "14:15:00", type: "info", msg: "Scheduled maintenance completed on upstream provider circuit" },
  { time: "13:47:30", type: "info", msg: "Normal operation — all metrics within expected thresholds" },
];

const impactedServices = [
  { service: "Customer Portal", impact: "High", degradation: "12% error rate", nodes: 3 },
  { service: "API Gateway", impact: "Medium", degradation: "Elevated latency +180ms", nodes: 2 },
  { service: "Monitoring Pipeline", impact: "Low", degradation: "Occasional packet drops", nodes: 1 },
  { service: "Internal VPN", impact: "None", degradation: "Unaffected", nodes: 0 },
];

const causalChain = [
  { step: 1, node: "Physical Layer", detail: "CRC errors on GigE0/0/1 — possible cable/SFP degradation", confidence: 94, type: "root" },
  { step: 2, node: "Interface", detail: "Error counters triggering input queue drops on AS-CORE-01", confidence: 91, type: "propagation" },
  { step: 3, node: "Routing Layer", detail: "OSPF cost recalculation causing suboptimal path selection", confidence: 87, type: "propagation" },
  { step: 4, node: "Traffic Flow", detail: "Packet loss cascading to downstream distribution switches", confidence: 89, type: "impact" },
];

const SEV: Record<string, string> = {
  critical: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  warning: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  info: "bg-[#1BA0D7]/10 text-[#1BA0D7] border-[#1BA0D7]/20",
};

const EVENT_COLOR: Record<string, string> = {
  alert: "#EF4444", detection: "#8B5CF6", change: "#F59E0B", baseline: "#1BA0D7", info: "#94A3B8",
};

export function RootCauseAnalysis() {
  const [selectedInc, setSelectedInc] = useState("INC-2847");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Root Cause Analysis</h1>
          <p className="text-[#64748B] text-sm mt-0.5">AI-powered causal graph analysis · Incident correlation engine active</p>
        </div>
        <button className="flex items-center gap-2 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#EF4444]/20 transition-colors">
          <AlertTriangle className="w-4 h-4" />
          1 Critical Open
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Incident Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#0F172A] text-sm">Incidents</h3>
          {incidents.map(inc => (
            <motion.div
              key={inc.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelectedInc(inc.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedInc === inc.id
                  ? "bg-white border-[#1BA0D7]/40 shadow-md ring-2 ring-[#1BA0D7]/20"
                  : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${SEV[inc.severity]}`}>{inc.severity.toUpperCase()}</span>
                <span className="text-[10px] font-mono text-[#94A3B8]">{inc.id}</span>
              </div>
              <div className="font-medium text-[#0F172A] text-sm mb-1">{inc.title}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">{inc.node}</span>
                <span className={`text-xs font-semibold ${inc.status === "resolved" ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                  {inc.status}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-[#94A3B8]">
                <Clock className="w-3 h-3" />
                {inc.started}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main RCA Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Summary */}
          <div className="bg-gradient-to-r from-[#8B5CF6]/5 to-[#1BA0D7]/5 rounded-2xl p-5 border border-[#8B5CF6]/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <div className="font-semibold text-[#0F172A] mb-1 flex items-center gap-2">
                  AI Root Cause Analysis
                  <span className="text-[10px] bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded-full font-bold">94% Confidence</span>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  The primary root cause is identified as <strong>physical layer degradation on interface GigE0/0/1 of AS-CORE-01</strong>,
                  manifesting as CRC errors indicative of a faulty SFP module or damaged fiber patch cable.
                  This triggered a cascade: interface input queue drops → OSPF metric recalculation → suboptimal traffic distribution →
                  packet loss affecting downstream services. <strong>Recommended immediate action: Replace SFP on GigE0/0/1 and re-baseline OSPF costs.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Causal Chain */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
            <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1BA0D7]" />
              Causal Chain Analysis
            </h3>
            <div className="space-y-3">
              {causalChain.map((step, i) => (
                <div key={step.step} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                      step.type === "root" ? "bg-[#EF4444]" : step.type === "impact" ? "bg-[#F59E0B]" : "bg-[#1BA0D7]"
                    }`}>
                      {step.step}
                    </div>
                    {i < causalChain.length - 1 && <div className="w-0.5 h-6 bg-[#E2E8F0] mt-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[#0F172A] text-sm">{step.node}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        step.type === "root" ? "bg-[#EF4444]/10 text-[#EF4444]" :
                        step.type === "impact" ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#1BA0D7]/10 text-[#1BA0D7]"
                      }`}>{step.type}</span>
                      <span className="text-xs text-[#1BA0D7] font-semibold ml-auto">{step.confidence}% conf.</span>
                    </div>
                    <p className="text-xs text-[#64748B]">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1BA0D7]" />
                Incident Timeline
              </h3>
              <div className="space-y-3 relative">
                <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-[#F1F5F9]" />
                {timelineEvents.map((ev, i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 z-10" style={{ backgroundColor: EVENT_COLOR[ev.type] }} />
                    <div>
                      <div className="text-[10px] font-mono text-[#94A3B8] mb-0.5">{ev.time}</div>
                      <div className="text-xs text-[#475569] leading-snug">{ev.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Assessment */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-4">Impact Assessment</h3>
              <div className="space-y-3">
                {impactedServices.map(svc => (
                  <div key={svc.service} className="p-3 bg-[#F8FAFC] rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#0F172A] text-sm">{svc.service}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        svc.impact === "High" ? "bg-[#EF4444]/10 text-[#EF4444]" :
                        svc.impact === "Medium" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                        svc.impact === "Low" ? "bg-[#1BA0D7]/10 text-[#1BA0D7]" :
                        "bg-[#10B981]/10 text-[#10B981]"
                      }`}>{svc.impact}</span>
                    </div>
                    <div className="text-xs text-[#64748B]">{svc.degradation}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                <button className="w-full flex items-center justify-center gap-2 bg-[#1BA0D7] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0A84FF] transition-colors">
                  <Zap className="w-4 h-4" />
                  Initiate Remediation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
