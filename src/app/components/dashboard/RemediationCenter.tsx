import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, CheckCircle2, Clock, AlertTriangle, Play, Pause, RotateCcw, ChevronRight, Terminal, Shield, User, Bot, ArrowRight } from "lucide-react";

const workflows = [
  {
    id: "WF-0089", title: "BGP Failover — AS-CORE-01", status: "running", progress: 67,
    trigger: "AI-Auto", startedAt: "14:32:01", eta: "~4 min",
    steps: [
      { name: "Validate backup path", status: "done", duration: "0.8s" },
      { name: "Pre-check BGP neighbors", status: "done", duration: "1.2s" },
      { name: "Initiate graceful restart", status: "running", duration: "..." },
      { name: "Reroute traffic via CORE-02", status: "pending", duration: "-" },
      { name: "Verify convergence", status: "pending", duration: "-" },
      { name: "Update monitoring baselines", status: "pending", duration: "-" },
    ]
  },
  {
    id: "WF-0088", title: "WAN Load Rebalance — EAST", status: "approval", progress: 0,
    trigger: "AI-Suggest", startedAt: "14:28:14", eta: "Awaiting approval",
    steps: [
      { name: "Analyze current traffic matrix", status: "done", duration: "1.1s" },
      { name: "Calculate optimal distribution", status: "done", duration: "2.3s" },
      { name: "Awaiting NOC Manager approval", status: "approval", duration: "-" },
      { name: "Apply ECMP policy changes", status: "pending", duration: "-" },
      { name: "Validate SLA compliance", status: "pending", duration: "-" },
    ]
  },
  {
    id: "WF-0087", title: "SFP Health Check — CORE-01", status: "completed", progress: 100,
    trigger: "Manual", startedAt: "13:55:00", eta: "Completed",
    steps: [
      { name: "Run optical power diagnostics", status: "done", duration: "3.2s" },
      { name: "Check error counters", status: "done", duration: "0.9s" },
      { name: "Generate health report", status: "done", duration: "1.4s" },
    ]
  },
  {
    id: "WF-0086", title: "OSPF Cost Re-optimization", status: "failed", progress: 45,
    trigger: "Scheduled", startedAt: "13:00:00", eta: "Failed",
    steps: [
      { name: "Snapshot current OSPF config", status: "done", duration: "0.7s" },
      { name: "Calculate optimal costs", status: "done", duration: "4.1s" },
      { name: "Apply cost changes", status: "failed", duration: "Error" },
      { name: "Rollback initiated", status: "done", duration: "0.9s" },
    ]
  },
];

const approvalQueue = [
  { id: "APQ-041", title: "WAN Load Rebalance — DC-EAST", risk: "Low", requestedBy: "AI Agent", time: "6m ago", detail: "Redistribute 23% of WAN-EAST traffic via WAN-WEST secondary path." },
  { id: "APQ-040", title: "Emergency ACL Push — EDGE-02", risk: "Medium", requestedBy: "AI Agent", time: "18m ago", detail: "Apply temporary ACL to block suspicious traffic pattern from 203.0.113.0/24." },
];

const execLogs = [
  { time: "14:32:45", level: "info", msg: "WF-0089: Initiating graceful BGP restart on AS-CORE-01" },
  { time: "14:32:43", level: "success", msg: "WF-0089: Pre-check complete — backup path AS-CORE-02 healthy" },
  { time: "14:32:41", level: "success", msg: "WF-0089: BGP neighbor validation passed (8/8 peers)" },
  { time: "14:32:39", level: "info", msg: "WF-0089: Workflow triggered by AI anomaly detection (confidence 91%)" },
  { time: "14:32:01", level: "warning", msg: "ALERT: AS-CORE-01 packet loss threshold breached — 15.3%" },
  { time: "14:28:22", level: "info", msg: "WF-0088: AI recommendation queued for NOC Manager approval" },
  { time: "13:55:12", level: "success", msg: "WF-0087: SFP diagnostic complete — degradation confirmed on GigE0/0/1" },
  { time: "13:05:44", level: "error", msg: "WF-0086: OSPF cost change failed — config validation error. Rollback executed." },
];

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  running:   { label: "Running",   bg: "bg-[#1BA0D7]/10",  text: "text-[#1BA0D7]",  dot: "#1BA0D7" },
  approval:  { label: "Approval",  bg: "bg-[#F59E0B]/10",  text: "text-[#F59E0B]",  dot: "#F59E0B" },
  completed: { label: "Completed", bg: "bg-[#10B981]/10",  text: "text-[#10B981]",  dot: "#10B981" },
  failed:    { label: "Failed",    bg: "bg-[#EF4444]/10",  text: "text-[#EF4444]",  dot: "#EF4444" },
  pending:   { label: "Pending",   bg: "bg-[#94A3B8]/10",  text: "text-[#94A3B8]",  dot: "#94A3B8" },
  done:      { label: "Done",      bg: "bg-[#10B981]/10",  text: "text-[#10B981]",  dot: "#10B981" },
};

export function RemediationCenter() {
  const [selectedWf, setSelectedWf] = useState("WF-0089");
  const wf = workflows.find(w => w.id === selectedWf)!;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Remediation Center</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Agentic operations · 1 workflow running · 2 awaiting approval</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1BA0D7]/10 border border-[#1BA0D7]/20">
            <Bot className="w-3.5 h-3.5 text-[#1BA0D7]" />
            <span className="text-xs font-semibold text-[#1BA0D7]">AI Agent · Active</span>
          </div>
          <button className="flex items-center gap-2 bg-[#1BA0D7] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0A84FF] transition-colors">
            <Zap className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Running", value: 1, icon: Play, color: "#1BA0D7" },
          { label: "Awaiting Approval", value: 2, icon: Clock, color: "#F59E0B" },
          { label: "Completed Today", value: 14, icon: CheckCircle2, color: "#10B981" },
          { label: "Failed (7d)", value: 1, icon: AlertTriangle, color: "#EF4444" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{card.value}</div>
              <div className="text-xs text-[#64748B]">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#0F172A] text-sm">Workflows</h3>
          {workflows.map(w => {
            const ss = STATUS_STYLE[w.status];
            return (
              <motion.div
                key={w.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedWf(w.id)}
                className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all ${
                  selectedWf === w.id ? "border-[#1BA0D7]/40 shadow-md ring-2 ring-[#1BA0D7]/20" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#94A3B8]">{w.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ss.bg} ${ss.text}`}>{ss.label}</span>
                </div>
                <div className="font-semibold text-[#0F172A] text-sm mb-1">{w.title}</div>
                <div className="text-xs text-[#64748B] mb-2">Trigger: {w.trigger} · {w.eta}</div>
                {w.status === "running" && (
                  <div>
                    <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1">
                      <span>Progress</span>
                      <span>{w.progress}%</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
                      <motion.div
                        className="h-1.5 rounded-full bg-[#1BA0D7]"
                        initial={{ width: 0 }}
                        animate={{ width: `${w.progress}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Workflow Detail */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl p-5 border border-[#E2E8F0]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-[#94A3B8]">{wf.id}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[wf.status].bg} ${STATUS_STYLE[wf.status].text}`}>
                      {STATUS_STYLE[wf.status].label}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{wf.title}</h3>
                  <div className="text-xs text-[#64748B] mt-0.5">Started {wf.startedAt} · Trigger: {wf.trigger}</div>
                </div>
                <div className="flex gap-2">
                  {wf.status === "running" && (
                    <button className="w-8 h-8 flex items-center justify-center bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/20 transition-colors">
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                  {wf.status === "failed" && (
                    <button className="w-8 h-8 flex items-center justify-center bg-[#1BA0D7]/10 text-[#1BA0D7] rounded-lg hover:bg-[#1BA0D7]/20 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Execution Steps</div>
                {wf.steps.map((step, i) => {
                  const ss = STATUS_STYLE[step.status] || STATUS_STYLE.pending;
                  return (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ss.dot}20` }}>
                        {step.status === "done" && <CheckCircle2 className="w-3 h-3" style={{ color: ss.dot }} />}
                        {step.status === "running" && (
                          <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: ss.dot }}
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                        {step.status === "failed" && <AlertTriangle className="w-3 h-3" style={{ color: ss.dot }} />}
                        {step.status === "approval" && <Clock className="w-3 h-3" style={{ color: ss.dot }} />}
                        {step.status === "pending" && <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />}
                      </div>
                      <span className={`text-sm flex-1 ${step.status === "pending" ? "text-[#94A3B8]" : "text-[#0F172A]"}`}>{step.name}</span>
                      <span className="text-xs text-[#94A3B8] font-mono">{step.duration}</span>
                    </div>
                  );
                })}
              </div>

              {/* Approval Actions */}
              {wf.status === "approval" && (
                <div className="p-4 bg-[#FFFBEB] rounded-xl border border-[#F59E0B]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#F59E0B]" />
                    <span className="font-semibold text-[#0F172A] text-sm">Approval Required</span>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">This workflow requires NOC Manager approval before execution. Review the planned changes carefully.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#10B981] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#059669] transition-colors">
                      Approve & Execute
                    </button>
                    <button className="flex-1 border border-[#EF4444]/30 text-[#EF4444] py-2 rounded-xl text-sm font-semibold hover:bg-[#EF4444]/5 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Approval Queue */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
            <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              Approval Queue
              <span className="ml-auto text-xs bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded-full font-bold">{approvalQueue.length}</span>
            </h3>
            <div className="space-y-3">
              {approvalQueue.map(item => (
                <div key={item.id} className="p-3 bg-[#FFFBEB] rounded-xl border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#0F172A] text-sm">{item.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.risk === "Low" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}>{item.risk} Risk</span>
                  </div>
                  <p className="text-xs text-[#64748B] mb-2">{item.detail}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8]">By {item.requestedBy} · {item.time}</span>
                    <div className="flex gap-2">
                      <button className="text-xs bg-[#10B981] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#059669] transition-colors">Approve</button>
                      <button className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1 rounded-lg font-medium hover:bg-[#F8FAFC] transition-colors">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Logs */}
          <div className="bg-[#0A0F1E] rounded-2xl p-4 border border-[#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-[#1BA0D7]" />
              <span className="font-semibold text-white text-sm">Execution Log</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs text-[#64748B]">Live</span>
              </div>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs">
              {execLogs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[#475569] whitespace-nowrap">{log.time}</span>
                  <span className={`whitespace-nowrap font-bold ${
                    log.level === "success" ? "text-[#10B981]" :
                    log.level === "warning" ? "text-[#F59E0B]" :
                    log.level === "error" ? "text-[#EF4444]" : "text-[#94A3B8]"
                  }`}>[{log.level.toUpperCase()}]</span>
                  <span className="text-[#94A3B8]">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
