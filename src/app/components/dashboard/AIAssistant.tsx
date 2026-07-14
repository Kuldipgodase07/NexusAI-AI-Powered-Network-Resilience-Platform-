import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Wifi, Layers, Globe, Network, Server, Database,
  Monitor, Shield, ChevronRight, X, Zap, AlertTriangle,
  CheckCircle2, Brain, Activity, RefreshCw, Maximize2,
  ZoomIn, ZoomOut, Filter, Clock, ArrowRight
} from "lucide-react";

/* ─── Cisco tokens ─────────────────────── */
const C_BLUE  = "#049FD9";
const C_TEAL  = "#005073";
const C_NAVY  = "#001E32";

/* ─── Status config ────────────────────── */
type Status = "healthy" | "warning" | "critical" | "predicted" | "remediated";

const STATUS: Record<Status, { color: string; bg: string; label: string; glow: string }> = {
  healthy:    { color: "#6EBE4A", bg: "#E8F7DC", label: "Healthy",    glow: "#6EBE4A40" },
  warning:    { color: "#FF7300", bg: "#FFF3E0", label: "Warning",    glow: "#FF730040" },
  critical:   { color: "#E2231A", bg: "#FFEBEE", label: "Critical",   glow: "#E2231A50" },
  predicted:  { color: "#7C3AED", bg: "#F5F3FF", label: "AI Risk",    glow: "#7C3AED50" },
  remediated: { color: C_BLUE,    bg: "#E5F6FD", label: "Remediated", glow: `${C_BLUE}50` },
};

/* ─── Graph data ────────────────────────── */
interface GraphNode {
  id: string; label: string; sub: string; x: number; y: number;
  status: Status; metric?: string; icon: string; desc: string;
}

interface GraphEdge {
  from: string; to: string; status: Status; curved?: "up" | "down";
}

const DEFAULT_NODES: GraphNode[] = [
  { id: "internet",  label: "Internet",      sub: "External Traffic",  x: 55,  y: 145, status: "healthy",   icon: "globe",    desc: "External internet traffic entering the network perimeter via firewall clusters." },
  { id: "branch",    label: "Branch Router", sub: "Cisco ISR 4451",    x: 185, y: 145, status: "healthy",   icon: "wifi",     desc: "Primary branch router. CPU 24%, all BGP peers stable, 2ms latency." },
  { id: "sdwan",     label: "SD-WAN Edge",   sub: "Cisco vEdge 2000",  x: 325, y: 145, status: "warning",   metric:"87% util",icon: "layers",   desc: "SD-WAN edge node. Utilization at 87% — approaching threshold. Nexus Predict flags 92% risk in 3h." },
  { id: "wanlink",   label: "WAN Link",      sub: "WAN-EAST-01",       x: 465, y: 145, status: "critical",  metric:"Loss 18%",icon: "link",     desc: "CRITICAL: WAN-EAST-01 experiencing 18% packet loss due to upstream ISP congestion. Nexus Resolve executing failover." },
  { id: "core",      label: "Core Switch",   sub: "AS-CORE-01",        x: 600, y: 145, status: "warning",   metric:"CPU 72%", icon: "network",  desc: "Core switching fabric. CPU at 72% — elevated due to traffic rerouting. Threshold is 85%." },
  { id: "appserver", label: "App Server",    sub: "APP-SVR-03",        x: 730, y: 145, status: "predicted", metric:"AI Risk",  icon: "server",   desc: "Application server cluster. Nexus Cortex predicts 78% probability of service degradation within 90 minutes." },
  { id: "crm",       label: "CRM Service",   sub: "Salesforce DC",     x: 855, y: 145, status: "critical",  metric:"SLA Breach",icon:"database",  desc: "CRM experiencing high latency (890ms). SLA breach imminent. 4,200 users impacted." },
  // Branch: backup path
  { id: "backup",    label: "Backup WAN",    sub: "WAN-WEST-02",       x: 465, y: 275, status: "healthy",   metric:"32% util",icon: "wifi",     desc: "Backup WAN path via WAN-WEST-02. Currently at 32% utilization — ready for failover traffic." },
  { id: "dr",        label: "DR Datacenter", sub: "Secondary DC",      x: 600, y: 275, status: "healthy",   icon: "server",   desc: "Disaster recovery datacenter. All replication streams healthy. RTO: 4 minutes." },
  // Branch: analytics
  { id: "analytics", label: "Analytics DB",  sub: "BigQuery / ETL",    x: 730, y: 30,  status: "healthy",   icon: "database", desc: "Analytics data pipeline. Running 12 ETL jobs. No impact from WAN-EAST-01 issue." },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { from: "internet",  to: "branch",    status: "healthy"  },
  { from: "branch",    to: "sdwan",     status: "healthy"  },
  { from: "sdwan",     to: "wanlink",   status: "warning"  },
  { from: "wanlink",   to: "core",      status: "critical" },
  { from: "core",      to: "appserver", status: "warning"  },
  { from: "appserver", to: "crm",       status: "critical" },
  { from: "wanlink",   to: "backup",    status: "healthy",   curved: "down" },
  { from: "backup",    to: "dr",        status: "healthy"  },
  { from: "core",      to: "analytics", status: "healthy",   curved: "up"   },
];

/* ─── AI Canned replies ─────────────────── */
const QUERIES = [
  "Why is Branch A experiencing latency?",
  "Show active failure propagation path",
  "Simulate WAN failover to backup path",
  "What is the blast radius of WAN-EAST-01 failure?",
];

const REPLIES: Record<string, string> = {
  "why is branch a experiencing latency?": "Analyzing Branch A connectivity...\n\n**Root Cause identified**: WAN-EAST-01 packet loss at 18% due to upstream ISP congestion.\n\nThe failure propagates: **Branch Router → SD-WAN Edge → WAN Link** *(critical)* **→ Core Switch → App Server → CRM Service**.\n\nNexus Resolve has pre-staged a failover route via **WAN-WEST-02**. Confidence: **94%**. Shall I execute?",
  "show active failure propagation path": "Tracing failure propagation across 5 hops...\n\n**WAN-EAST-01** is the origin node. Impact cascades:\n- SD-WAN Edge: **87% utilization** ⚠️\n- Core Switch: **CPU 72%** ⚠️\n- App Server: **78% failure probability** (AI prediction) 🔮\n- CRM Service: **SLA breach — 890ms latency** 🔴\n\nGraph updated. Red path shows blast radius.",
  "simulate wan failover to backup path": "Executing WAN-WEST-02 failover simulation...\n\n✅ **Failover route pre-provisioned**\n✅ **BGP route advertisement updated**\n✅ **Traffic rerouted: 67% via WAN-WEST-02**\n\nPost-failover prediction:\n- WAN-WEST-02 utilization: **62%** (within threshold)\n- CRM latency: **↓ to 140ms**\n- SLA compliance restored\n\nNexus Assure will validate in 2 minutes.",
  "what is the blast radius of wan-east-01 failure?": "**Blast Radius Analysis — WAN-EAST-01 Failure**\n\nDirectly impacted services:\n- Branch A connectivity (**critical**)\n- CRM, ERP, VoIP (**high impact**)\n- App Server cluster (**predicted degradation**)\n\nUsers affected: **4,200 direct** · 12,400 indirect\nBusiness impact: **$14,200/hour** downtime cost\nMTTR with Nexus Resolve: **~4 minutes**\n\nMTTR without automation: **~2.4 hours**",
};

function getReply(q: string): string {
  const k = Object.keys(REPLIES).find(key => q.toLowerCase().includes(key.slice(0, 15).toLowerCase()));
  return k ? REPLIES[k] : "I've analyzed current telemetry across the Cisco fabric. The **Connectivity Intelligence Graph** reflects the latest network state. Ask me about specific nodes, failure paths, or remediation options.";
}

/* ─── Icon renderer (inline SVG paths) ─── */
function NodeIcon({ type, color, size = 18 }: { type: string; color: string; size?: number }) {
  const s = size;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "globe":    return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "wifi":     return <svg {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
    case "layers":   return <svg {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "link":     return <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "network":  return <svg {...props}><rect x="2" y="2" width="6" height="6"/><rect x="16" y="2" width="6" height="6"/><rect x="9" y="16" width="6" height="6"/><path d="M5 8v4c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V8"/><line x1="12" y1="14" x2="12" y2="16"/></svg>;
    case "server":   return <svg {...props}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
    case "database": return <svg {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
    default:         return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
  }
}

/* ─── SVG Graph ─────────────────────────── */
function ConnectivityGraph({
  nodes, edges, selectedNode, onSelect, animatedPath,
}: {
  nodes: GraphNode[]; edges: GraphEdge[]; selectedNode: string | null;
  onSelect: (id: string | null) => void; animatedPath: string[];
}) {
  const W = 940, H = 310;

  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  const edgePath = (e: GraphEdge) => {
    const a = getNode(e.from), b = getNode(e.to);
    if (!a || !b) return "";
    const dx = b.x - a.x, dy = b.y - a.y;
    if (e.curved === "down") {
      return `M ${a.x} ${a.y + 30} C ${a.x} ${a.y + 100}, ${b.x} ${b.y - 60}, ${b.x} ${b.y - 30}`;
    }
    if (e.curved === "up") {
      return `M ${a.x} ${a.y - 30} C ${a.x} ${a.y - 90}, ${b.x} ${b.y + 60}, ${b.x} ${b.y + 30}`;
    }
    return `M ${a.x + 30} ${a.y} L ${b.x - 30} ${b.y}`;
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        {(Object.keys(STATUS) as Status[]).map(s => (
          <marker key={s} id={`arr-${s}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={STATUS[s].color} />
          </marker>
        ))}
        {(Object.keys(STATUS) as Status[]).map(s => (
          <filter key={s} id={`glow-${s}`}>
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        ))}
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const sc = STATUS[e.status];
        const inPath = animatedPath.includes(e.from) && animatedPath.includes(e.to);
        const a = getNode(e.from), b = getNode(e.to);
        if (!a || !b) return null;
        const d = edgePath(e);
        const isCurved = !!e.curved;

        return (
          <g key={i}>
            <path d={d} fill="none" stroke={sc.color} strokeWidth={inPath ? 3 : 2}
              strokeDasharray={e.status === "critical" ? "6 3" : e.status === "warning" ? "none" : "none"}
              markerEnd={`url(#arr-${e.status})`} opacity={inPath ? 1 : 0.55} />
            {/* Animated particle on active/critical edges */}
            {(e.status === "critical" || inPath) && (
              <motion.circle r={5} fill={sc.color}
                animate={isCurved
                  ? { cx: [a.x, b.x], cy: [e.curved === "down" ? a.y + 30 : a.y - 30, e.curved === "down" ? b.y - 30 : b.y + 30] }
                  : { cx: [a.x + 30, b.x - 30], cy: [a.y, b.y] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                style={{ filter: `drop-shadow(0 0 4px ${sc.color})` }}
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const sc = STATUS[node.status];
        const isSelected = selectedNode === node.id;
        const inPath = animatedPath.includes(node.id);
        const r = 28;

        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(isSelected ? null : node.id)}>

            {/* Outer glow ring (always) */}
            <circle r={r + 10} fill={sc.color} opacity={0.08} />

            {/* Pulse ring for critical */}
            {node.status === "critical" && (
              <motion.circle r={r + 6} stroke={sc.color} strokeWidth={2} fill="none"
                animate={{ r: [r + 6, r + 18], opacity: [0.7, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }} />
            )}

            {/* Selected ring */}
            {isSelected && (
              <circle r={r + 8} stroke={sc.color} strokeWidth={3} fill="none" strokeDasharray="4 2" />
            )}

            {/* Main circle */}
            <circle r={r} fill="white"
              stroke={sc.color} strokeWidth={isSelected ? 3 : 2.5}
              style={{ filter: (inPath || isSelected) ? `url(#glow-${node.status})` : undefined,
                boxShadow: `0 4px 12px ${sc.glow}` }} />

            {/* Icon */}
            <foreignObject x={-12} y={-12} width={24} height={24}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24 }}>
                <NodeIcon type={node.icon} color={sc.color} size={18} />
              </div>
            </foreignObject>

            {/* Status badge (top-right) */}
            {node.metric && (
              <g>
                <rect x={r - 2} y={-r - 12} width={node.metric.length * 5.5 + 6} height={14} rx={7}
                  fill={sc.color} />
                <text x={r + (node.metric.length * 5.5 + 6) / 2 - 2} y={-r - 2}
                  textAnchor="middle" fill="white" fontSize={7.5} fontWeight="700" fontFamily="Inter, sans-serif">
                  {node.metric}
                </text>
              </g>
            )}

            {/* Status dot */}
            {!node.metric && (
              node.status === "critical"
                ? <motion.circle cx={r - 4} cy={-r + 4} r={6} fill={sc.color}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                : <circle cx={r - 4} cy={-r + 4} r={5} fill={sc.color} />
            )}

            {/* Labels */}
            <text y={r + 14} textAnchor="middle" fill="#1D2228" fontSize={10} fontWeight="700"
              fontFamily="Inter, sans-serif">{node.label}</text>
            <text y={r + 25} textAnchor="middle" fill="#8C949A" fontSize={8.5}
              fontFamily="Inter, sans-serif">{node.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Chat message type ─────────────────── */
type Msg = { role: "user" | "ai"; text: string };

/* ─── Main Component ─────────────────────── */
export function AIAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: "ai",
    text: "Hello! I'm **Nexus AI Copilot**.\n\nI have full visibility into your Cisco network fabric. Ask me about connectivity issues, failure paths, blast radius analysis, or execute remediation actions.\n\nThe **Connectivity Intelligence Graph** on the right shows your live network topology.",
  }]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animatedPath, setAnimatedPath] = useState<string[]>([]);
  const [nodes] = useState(DEFAULT_NODES);
  const [edges] = useState(DEFAULT_EDGES);
  const [zoom, setZoom]         = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);

    // Animate path based on query
    const lc = text.toLowerCase();
    if (lc.includes("branch") || lc.includes("latency") || lc.includes("propagation") || lc.includes("blast")) {
      setAnimatedPath(["internet","branch","sdwan","wanlink","core","appserver","crm"]);
    } else if (lc.includes("failover") || lc.includes("backup")) {
      setAnimatedPath(["wanlink","backup","dr"]);
    }

    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "ai", text: getReply(text) }]);
    }, 1600);
  };

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part.split("\n").map((line, k) =>
        <span key={k}>{line}{k < part.split("\n").length - 1 && <br />}</span>
      )
    );

  const legend: { status: Status; label: string }[] = [
    { status: "healthy",    label: "Healthy"    },
    { status: "warning",    label: "Warning"    },
    { status: "critical",   label: "Critical"   },
    { status: "predicted",  label: "AI Predicted" },
    { status: "remediated", label: "Remediated" },
  ];

  return (
    <div className="h-full flex overflow-hidden" style={{ backgroundColor: "#F5F7FA" }}>

      {/* ── Left: AI Chat ── */}
      <div className="w-[340px] flex-shrink-0 flex flex-col bg-white" style={{ borderRight: "1px solid #E2E8F0" }}>
        {/* Chat header */}
        <div className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ color: "#1D2228" }}>Nexus AI Copilot</div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#8C949A" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#6EBE4A]" />
              Online · Cisco fabric connected
            </div>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex gap-1.5 px-3 py-2 flex-shrink-0 overflow-x-auto" style={{ borderBottom: "1px solid #F5F7FA", backgroundColor: "#FAFBFC" }}>
          {[
            { label: "3 Incidents", color: "#E2231A" },
            { label: "WAN Issue",   color: "#FF7300" },
            { label: "Live Feed",   color: C_BLUE    },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
              style={{ backgroundColor: `${p.color}12`, color: p.color, border: `1px solid ${p.color}25` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.label}
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
                  <Brain className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="max-w-[85%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed"
                style={m.role === "user"
                  ? { background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})`, color: "white", borderTopRightRadius: 4 }
                  : { backgroundColor: "#F5F7FA", color: "#1D2228", border: "1px solid #E2E8F0", borderTopLeftRadius: 4 }}>
                {renderText(m.text)}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
                <Brain className="w-3 h-3 text-white" />
              </div>
              <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm" style={{ backgroundColor: "#F5F7FA", border: "1px solid #E2E8F0" }}>
                <div className="flex gap-1 items-center h-4">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: C_BLUE }}
                      animate={{ y: [0,-4,0], opacity: [0.4,1,0.4] }}
                      transition={{ duration: 0.7, delay: i*0.15, repeat: Infinity }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Preset queries */}
        {msgs.length <= 1 && (
          <div className="px-3 pb-2 grid grid-cols-1 gap-1.5 flex-shrink-0">
            {QUERIES.map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-left px-3 py-2 rounded-xl text-xs transition-all"
                style={{ backgroundColor: "#F5F7FA", border: "1px solid #E2E8F0", color: "#4D5358" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C_BLUE; (e.currentTarget as HTMLElement).style.color = C_BLUE; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLElement).style.color = "#4D5358"; }}>
                <ArrowRight className="w-3 h-3 inline mr-1.5 opacity-60" />{q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
            style={{ backgroundColor: "#F5F7FA", border: "1.5px solid #D4D9DD" }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = C_BLUE)}
            onBlurCapture={e => (e.currentTarget.style.borderColor = "#D4D9DD")}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(input); }}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-xs outline-none" style={{ color: "#1D2228" }} />
            <button onClick={() => send(input)} disabled={!input.trim() || typing}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: C_BLUE }}>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Connectivity Intelligence Graph ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Graph header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-white"
          style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div>
            <div className="font-bold text-sm" style={{ color: "#1D2228" }}>Connectivity Intelligence Graph</div>
            <div className="text-xs mt-0.5" style={{ color: "#8C949A" }}>
              Live dependency graph · {nodes.length} nodes · {edges.length} paths · Cisco fabric
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Legend */}
            <div className="hidden lg:flex items-center gap-3 mr-2">
              {legend.map(l => (
                <div key={l.status} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS[l.status].color }} />
                  <span className="text-[10px]" style={{ color: "#8C949A" }}>{l.label}</span>
                </div>
              ))}
            </div>
            {/* Controls */}
            {[
              { icon: ZoomIn,   action: () => setZoom(z => Math.min(z + 0.2, 2.0)),   title: "Zoom in"  },
              { icon: ZoomOut,  action: () => setZoom(z => Math.max(z - 0.2, 0.5)),   title: "Zoom out" },
              { icon: RefreshCw,action: () => { setAnimatedPath([]); setSelectedNode(null); }, title: "Reset"   },
            ].map(({ icon: Icon, action, title }) => (
              <button key={title} onClick={action} title={title}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "#4D5358", border: "1px solid #E2E8F0", backgroundColor: "white" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C_BLUE; (e.currentTarget as HTMLElement).style.color = C_BLUE; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLElement).style.color = "#4D5358"; }}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Main graph canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 overflow-auto p-6">
            {/* Graph container */}
            <div className="relative bg-white rounded-2xl border overflow-hidden"
              style={{ borderColor: "#E2E8F0", minHeight: 340, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

              {/* Background grid */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #D4D9DD 1px, transparent 1px)`,
                  backgroundSize: "28px 28px", opacity: 0.5,
                }}>
              </div>

              {/* SVG Graph */}
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", padding: "48px 32px 56px" }}>
                <ConnectivityGraph
                  nodes={nodes} edges={edges}
                  selectedNode={selectedNode}
                  onSelect={setSelectedNode}
                  animatedPath={animatedPath}
                />
              </div>
            </div>
          </div>

          {/* Node detail overlay */}
          <AnimatePresence>
            {selectedNode && selectedNodeData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-10 right-10 w-72 bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: `2px solid ${STATUS[selectedNodeData.status].color}40` }}>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ backgroundColor: `${STATUS[selectedNodeData.status].color}10`, borderBottom: "1px solid #E2E8F0" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: STATUS[selectedNodeData.status].bg }}>
                      <NodeIcon type={selectedNodeData.icon} color={STATUS[selectedNodeData.status].color} size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "#1D2228" }}>{selectedNodeData.label}</div>
                      <div className="text-[10px]" style={{ color: "#8C949A" }}>{selectedNodeData.sub}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedNode(null)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ color: "#8C949A" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #F5F7FA" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: "#4D5358" }}>Status</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: STATUS[selectedNodeData.status].bg, color: STATUS[selectedNodeData.status].color }}>
                      {STATUS[selectedNodeData.status].label}
                    </span>
                  </div>
                  {selectedNodeData.metric && (
                    <div className="text-xs font-bold" style={{ color: STATUS[selectedNodeData.status].color }}>
                      {selectedNodeData.metric}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #F5F7FA" }}>
                  <div className="text-xs leading-relaxed" style={{ color: "#4D5358" }}>{selectedNodeData.desc}</div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 flex gap-2">
                  <button onClick={() => { send(`Tell me about ${selectedNodeData.label}`); setSelectedNode(null); }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ backgroundColor: C_BLUE }}>
                    Ask AI
                  </button>
                  <button className="flex-1 py-2 rounded-xl text-xs font-semibold"
                    style={{ border: "1px solid #E2E8F0", color: "#4D5358" }}>
                    View Logs
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: AI Agents + path timeline */}
        <div className="flex-shrink-0 bg-white" style={{ borderTop: "1px solid #E2E8F0" }}>
          {/* Agents */}
          <div className="flex items-center gap-3 px-5 py-2.5 overflow-x-auto">
            <span className="text-[9px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: "#B0BAC4" }}>AI Agents</span>
            {[
              { label: "Scout",   color: "#FF7300", status: "complete", task: "Topology mapped" },
              { label: "Insight", color: C_BLUE,    status: "complete", task: "Root cause found" },
              { label: "Predict", color: "#FF7300", status: "active",   task: "Forecasting..." },
              { label: "Resolve", color: "#6EBE4A", status: "pending",  task: "Awaiting approval" },
              { label: "Assure",  color: "#7C3AED", status: "pending",  task: "Standby" },
            ].map(a => (
              <div key={a.label} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                style={{ backgroundColor: `${a.color}0D`, border: `1px solid ${a.color}25` }}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.status === "active" ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: a.status === "pending" ? "#D4D9DD" : a.color }} />
                <span className="text-[10px] font-bold" style={{ color: a.status === "pending" ? "#8C949A" : "#1D2228" }}>{a.label}</span>
                <span className="text-[9px]" style={{ color: "#8C949A" }}>{a.task}</span>
              </div>
            ))}
          </div>

          {/* Path nodes timeline */}
          {animatedPath.length > 0 && (
            <div className="flex items-center gap-0 px-5 py-2 overflow-x-auto"
              style={{ borderTop: "1px solid #F5F7FA" }}>
              <span className="text-[9px] font-bold uppercase tracking-widest mr-3 flex-shrink-0" style={{ color: "#B0BAC4" }}>Active Path</span>
              {animatedPath.map((id, i) => {
                const n = nodes.find(nd => nd.id === id);
                if (!n) return null;
                const sc = STATUS[n.status];
                return (
                  <div key={id} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                        style={{ borderColor: sc.color, backgroundColor: `${sc.color}20`, color: sc.color }}>
                        {i + 1}
                      </div>
                      <div className="text-[8px] mt-0.5 text-center whitespace-nowrap" style={{ color: "#8C949A" }}>
                        {n.label.split(" ")[0]}
                      </div>
                    </div>
                    {i < animatedPath.length - 1 && (
                      <div className="w-8 h-0.5 mx-0.5" style={{ backgroundColor: sc.color + "60" }} />
                    )}
                  </div>
                );
              })}
              <button onClick={() => setAnimatedPath([])} className="ml-3 flex-shrink-0"
                style={{ color: "#8C949A" }}><X className="w-3 h-3" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
