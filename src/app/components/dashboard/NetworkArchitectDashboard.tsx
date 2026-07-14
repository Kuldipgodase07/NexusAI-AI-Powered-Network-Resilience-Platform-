import { useState } from "react";
import { motion } from "motion/react";
import { Network, TrendingUp, Server, AlertTriangle, Brain, BarChart3, Layers, ArrowUpRight, Shield } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/* ── Network Topology (SVG) ── */
const topoNodes = [
  { id: "core1",  x: 48, y: 14, type: "core",  label: "AS-CORE-01", status: "critical", cap: 87 },
  { id: "core2",  x: 70, y: 18, type: "core",  label: "AS-CORE-02", status: "healthy",  cap: 61 },
  { id: "dist1",  x: 25, y: 36, type: "dist",  label: "DIST-WEST",  status: "healthy",  cap: 45 },
  { id: "dist2",  x: 50, y: 38, type: "dist",  label: "DIST-CENT",  status: "warning",  cap: 79 },
  { id: "dist3",  x: 75, y: 36, type: "dist",  label: "DIST-EAST",  status: "healthy",  cap: 53 },
  { id: "edge1",  x: 14, y: 58, type: "edge",  label: "EDGE-01",    status: "healthy",  cap: 34 },
  { id: "edge2",  x: 38, y: 60, type: "edge",  label: "EDGE-02",    status: "warning",  cap: 82 },
  { id: "edge3",  x: 62, y: 60, type: "edge",  label: "EDGE-03",    status: "healthy",  cap: 47 },
  { id: "edge4",  x: 86, y: 58, type: "edge",  label: "EDGE-04",    status: "healthy",  cap: 41 },
  { id: "cloud1", x: 88, y: 10, type: "cloud", label: "AWS VPC",    status: "healthy",  cap: 58 },
  { id: "cloud2", x: 12, y: 14, type: "cloud", label: "Azure VNET", status: "healthy",  cap: 44 },
];
const topoEdges = [
  ["core1","core2"],["core1","dist1"],["core1","dist2"],["core2","dist2"],["core2","dist3"],
  ["dist1","edge1"],["dist1","edge2"],["dist2","edge2"],["dist2","edge3"],["dist3","edge3"],["dist3","edge4"],
  ["core2","cloud1"],["core1","cloud2"],
];
const nodeMap = Object.fromEntries(topoNodes.map(n => [n.id, n]));
const typeColor: Record<string, string> = { core: "#1BA0D7", dist: "#0A84FF", edge: "#06B6D4", cloud: "#10B981" };
const statusColor: Record<string, string> = { healthy: "#10B981", warning: "#F59E0B", critical: "#EF4444" };

/* ── Capacity data ── */
const capacityData = [
  { segment: "Core Layer",    used: 74, total: 100, trend: "+3%" },
  { segment: "Distribution",  used: 62, total: 100, trend: "+1%" },
  { segment: "Edge/WAN",      used: 55, total: 100, trend: "+8%" },
  { segment: "Cloud Connect", used: 51, total: 100, trend: "+5%" },
];

const riskForecast = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i],
  risk: 40 + Math.sin(i * 0.6) * 15 + i * 1.5,
  capacity: 60 + i * 2,
}));

const radarData = [
  { subject: "Routing",   A: 87 }, { subject: "WAN",   A: 64 },
  { subject: "Switching", A: 92 }, { subject: "Cloud", A: 89 },
  { subject: "Security",  A: 96 }, { subject: "Edge",  A: 73 },
];

const inventory = [
  { type: "Core Routers",    count: 4,  healthy: 3, vendor: "Cisco" },
  { type: "Dist Switches",   count: 12, healthy: 11, vendor: "Cisco" },
  { type: "Edge Routers",    count: 8,  healthy: 7,  vendor: "Juniper" },
  { type: "Access Switches", count: 84, healthy: 84, vendor: "Cisco" },
  { type: "WAN Gateways",    count: 6,  healthy: 6,  vendor: "Cisco" },
  { type: "Cloud Gateways",  count: 4,  healthy: 4,  vendor: "AWS/Azure" },
];

const archInsights = [
  { severity: "critical", title: "Single Point of Failure — DIST-CENT-01",  desc: "No redundant path if DIST-CENT-01 fails. Recommend ECMP implementation." },
  { severity: "warning",  title: "WAN East Capacity Risk",                   desc: "Projected to exceed 95% utilization in 6 weeks at current growth rate." },
  { severity: "info",     title: "BGP Route Optimization Opportunity",       desc: "15 suboptimal BGP paths identified. AI recommends route policy update." },
];

export function NetworkArchitectDashboard() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
              <Network className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Network Architect Dashboard</h1>
          </div>
          <p className="text-[#64748B] text-sm">Infrastructure design & resilience planning view</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#8B5CF6]/10 px-3 py-1.5 rounded-lg border border-[#8B5CF6]/20">
            <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-xs text-[#8B5CF6] font-semibold">Resilience Index: 87/100</span>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Nodes",    value: "118",  icon: Server,       color: "#1BA0D7", sub: "Across 3 layers" },
          { label: "At-Risk Paths",  value: "7",    icon: AlertTriangle,color: "#EF4444", sub: "Redundancy gaps" },
          { label: "Capacity Avg",   value: "62%",  icon: BarChart3,    color: "#F59E0B", sub: "WAN peaking at 82%" },
          { label: "AI Risk Score",  value: "28",   icon: Brain,        color: "#8B5CF6", sub: "Low-medium zone" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#CBD5E1]" />
              </div>
              <div className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{k.value}</div>
              <div className="text-xs text-[#64748B]">{k.label}</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">{k.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Explorer */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="font-semibold text-[#0F172A]">Topology Explorer</h3>
            <div className="flex gap-3 text-xs">
              {[["#1BA0D7","Core"],["#0A84FF","Dist"],["#06B6D4","Edge"],["#10B981","Cloud"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} /><span className="text-[#64748B]">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-[#F8FAFC] relative" style={{ height: 280 }}>
            <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs><pattern id="archGrid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M 5 0 L 0 0 0 5" fill="none" stroke="#E2E8F0" strokeWidth="0.12" /></pattern></defs>
              <rect width="100" height="80" fill="url(#archGrid)" />
              {topoEdges.map(([a, b], i) => {
                const from = nodeMap[a]; const to = nodeMap[b];
                const isCrit = from?.status === "critical" || to?.status === "critical";
                const isWarn = from?.status === "warning" || to?.status === "warning";
                return (
                  <line key={i} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
                    stroke={isCrit ? "#EF4444" : isWarn ? "#F59E0B" : "#CBD5E1"}
                    strokeWidth={isCrit ? "0.7" : "0.4"} strokeOpacity="0.7"
                    strokeDasharray={isCrit ? "1 0.5" : "none"} />
                );
              })}
              {topoNodes.map((n) => {
                const r = n.type === "core" ? 5 : n.type === "cloud" ? 4 : n.type === "dist" ? 3.5 : 2.5;
                const sel = selectedNode === n.id;
                return (
                  <g key={n.id} onClick={() => setSelectedNode(sel ? null : n.id)} style={{ cursor: "pointer" }}>
                    {n.status !== "healthy" && (
                      <motion.circle cx={`${n.x}%`} cy={`${n.y}%`} r={r + 2} fill="none" stroke={statusColor[n.status]} strokeWidth="0.5"
                        animate={{ r: [r + 1, r + 3.5, r + 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
                    )}
                    <circle cx={`${n.x}%`} cy={`${n.y}%`} r={r} fill={typeColor[n.type]} stroke={statusColor[n.status]} strokeWidth={sel ? 1.5 : 0.7} opacity="0.9" />
                    <circle cx={`${n.x + r * 0.55}%`} cy={`${n.y - r * 0.55}%`} r="0.9" fill={statusColor[n.status]} />
                    <text x={`${n.x}%`} y={`${n.y + r + 2.2}%`} textAnchor="middle" fontSize="2" fill="#475569" fontWeight="500">
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-3 left-3 bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-sm text-xs">
              {selectedNode ? (
                <div>
                  <div className="font-bold text-[#0F172A]">{nodeMap[selectedNode].label}</div>
                  <div className="text-[#64748B]">Capacity: <span className="font-semibold text-[#0F172A]">{nodeMap[selectedNode].cap}%</span></div>
                  <div className="text-[#64748B]">Status: <span className={`font-semibold capitalize ${nodeMap[selectedNode].status === "healthy" ? "text-[#10B981]" : nodeMap[selectedNode].status === "warning" ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>{nodeMap[selectedNode].status}</span></div>
                </div>
              ) : (
                <span className="text-[#94A3B8]">Click a node to inspect</span>
              )}
            </div>
          </div>
        </div>

        {/* Resilience Radar */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">Resilience Radar</h3>
          <p className="text-xs text-[#64748B] mb-2">Domain health assessment</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748B" }} />
              <Radar name="Health" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {radarData.filter(d => d.A < 80).map(d => (
              <div key={d.subject} className="flex items-center gap-2 p-2 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                <span className="text-xs text-[#475569]">{d.subject} needs attention ({d.A}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Planning */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-4">Capacity Planning</h3>
          <div className="space-y-4">
            {capacityData.map(c => (
              <div key={c.segment}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#475569] font-medium">{c.segment}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8]">{c.trend}</span>
                    <span className="font-bold text-[#0F172A]">{c.used}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-[#F1F5F9] rounded-full">
                  <div className="h-2.5 rounded-full transition-all" style={{
                    width: `${c.used}%`,
                    backgroundColor: c.used > 80 ? "#EF4444" : c.used > 65 ? "#F59E0B" : "#10B981"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Forecast */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-1">Risk & Capacity Forecast</h3>
          <p className="text-xs text-[#64748B] mb-3">12-month projection</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={riskForecast}>
              <defs>
                <linearGradient id="riskFG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="capFG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="risk" stroke="#EF4444" fill="url(#riskFG)" strokeWidth={2} dot={false} name="Risk" />
              <Area type="monotone" dataKey="capacity" stroke="#8B5CF6" fill="url(#capFG)" strokeWidth={2} dot={false} name="Capacity %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Network Inventory */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="font-semibold text-[#0F172A]">Network Inventory</h3>
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {inventory.map(item => (
              <div key={item.type} className="px-5 py-3 flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#1BA0D7]/10 flex items-center justify-center flex-shrink-0">
                  <Server className="w-4 h-4 text-[#1BA0D7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#0F172A] text-sm">{item.type}</div>
                  <div className="text-xs text-[#64748B]">{item.vendor}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#0F172A] text-sm">{item.count}</div>
                  <div className={`text-xs font-semibold ${item.healthy === item.count ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                    {item.healthy}/{item.count} healthy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Insights */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F1F5F9]">
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <h3 className="font-semibold text-[#0F172A]">Architecture Insights</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#F1F5F9]">
          {archInsights.map((ins, i) => (
            <div key={i} className={`p-5 border-l-4 ${ins.severity === "critical" ? "border-[#EF4444]" : ins.severity === "warning" ? "border-[#F59E0B]" : "border-[#1BA0D7]"}`}>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${
                ins.severity === "critical" ? "bg-[#EF4444]/10 text-[#EF4444]" :
                ins.severity === "warning"  ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#1BA0D7]/10 text-[#1BA0D7]"
              }`}>{ins.severity.toUpperCase()}</span>
              <div className="font-semibold text-[#0F172A] text-sm mb-1">{ins.title}</div>
              <p className="text-xs text-[#64748B] leading-relaxed">{ins.desc}</p>
              <button className="mt-3 text-xs text-[#8B5CF6] font-semibold hover:underline">View Recommendation →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
