import { useState } from "react";
import { motion } from "motion/react";
import { Server, RefreshCw } from "lucide-react";

const nodes = [
  { id: "core1", x: 50, y: 18, type: "core", label: "AS-CORE-01", status: "critical", links: 8, load: 87 },
  { id: "core2", x: 70, y: 22, type: "core", label: "AS-CORE-02", status: "healthy", links: 8, load: 62 },
  { id: "dist1", x: 28, y: 38, type: "distribution", label: "DIST-WEST-01", status: "healthy", links: 4, load: 45 },
  { id: "dist2", x: 50, y: 40, type: "distribution", label: "DIST-CENT-01", status: "warning", links: 4, load: 79 },
  { id: "dist3", x: 72, y: 38, type: "distribution", label: "DIST-EAST-01", status: "healthy", links: 4, load: 53 },
  { id: "edge1", x: 15, y: 58, type: "edge", label: "EDGE-WAN-01", status: "healthy", links: 2, load: 34 },
  { id: "edge2", x: 38, y: 60, type: "edge", label: "EDGE-RTR-02", status: "warning", links: 2, load: 81 },
  { id: "edge3", x: 62, y: 60, type: "edge", label: "EDGE-RTR-03", status: "healthy", links: 2, load: 48 },
  { id: "edge4", x: 85, y: 58, type: "edge", label: "EDGE-WAN-02", status: "healthy", links: 2, load: 41 },
  { id: "acc1", x: 10, y: 78, type: "access", label: "ACC-SW-01", status: "healthy", links: 1, load: 22 },
  { id: "acc2", x: 30, y: 80, type: "access", label: "ACC-SW-02", status: "healthy", links: 1, load: 31 },
  { id: "acc3", x: 50, y: 78, type: "access", label: "ACC-SW-03", status: "healthy", links: 1, load: 28 },
  { id: "acc4", x: 70, y: 80, type: "access", label: "ACC-SW-04", status: "healthy", links: 1, load: 19 },
  { id: "acc5", x: 90, y: 78, type: "access", label: "ACC-SW-05", status: "healthy", links: 1, load: 25 },
  { id: "cloud1", x: 88, y: 10, type: "cloud", label: "AWS-VPC-US", status: "healthy", links: 2, load: 58 },
  { id: "cloud2", x: 12, y: 12, type: "cloud", label: "AZURE-VNET", status: "healthy", links: 2, load: 44 },
];

const edges = [
  ["core1", "core2"], ["core1", "dist1"], ["core1", "dist2"], ["core2", "dist2"], ["core2", "dist3"],
  ["dist1", "edge1"], ["dist1", "edge2"], ["dist2", "edge2"], ["dist2", "edge3"], ["dist3", "edge3"], ["dist3", "edge4"],
  ["edge1", "acc1"], ["edge2", "acc2"], ["edge2", "acc3"], ["edge3", "acc3"], ["edge3", "acc4"], ["edge4", "acc5"],
  ["core2", "cloud1"], ["core1", "cloud2"],
];

const typeConfig: Record<string, { color: string; size: number; label: string }> = {
  core: { color: "#1BA0D7", size: 14, label: "Core Router" },
  distribution: { color: "#0A84FF", size: 10, label: "Distribution Switch" },
  edge: { color: "#06B6D4", size: 8, label: "Edge Router" },
  access: { color: "#64748B", size: 6, label: "Access Switch" },
  cloud: { color: "#10B981", size: 10, label: "Cloud Gateway" },
};

const statusColor: Record<string, string> = {
  healthy: "#10B981",
  warning: "#F59E0B",
  critical: "#EF4444",
};

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

const linkTable = [
  { from: "AS-CORE-01", to: "DIST-CENT-01", bandwidth: "10Gbps", utilization: 87, latency: "0.8ms", status: "warning" },
  { from: "AS-CORE-01", to: "DIST-WEST-01", bandwidth: "10Gbps", utilization: 54, latency: "0.5ms", status: "healthy" },
  { from: "AS-CORE-02", to: "DIST-EAST-01", bandwidth: "10Gbps", utilization: 62, latency: "0.6ms", status: "healthy" },
  { from: "EDGE-RTR-02", to: "ACC-SW-02", bandwidth: "1Gbps", utilization: 81, latency: "1.2ms", status: "warning" },
  { from: "AZURE-VNET", to: "AS-CORE-01", bandwidth: "5Gbps", utilization: 44, latency: "2.1ms", status: "healthy" },
];

export function NetworkIntelligence() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const selectedNode = selected ? nodeMap[selected] : null;

  const filteredNodes = nodes.filter(n => filter === "all" || n.status === filter);

  return (
    <div className="flex h-full gap-0">
      {/* Main Topology Panel */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 bg-white border-b border-[#E2E8F0]">
          <h2 className="font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Network Topology</h2>
          <div className="flex-1" />
          <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1">
            {["all", "healthy", "warning", "critical"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${filter === f ? "bg-white shadow text-[#0F172A]" : "text-[#64748B] hover:text-[#0F172A]"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]">
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {Object.entries(typeConfig).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="text-[10px] text-[#64748B]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Topology */}
        <div className="flex-1 bg-[#F8FAFC] relative overflow-hidden p-4" style={{ minHeight: 400 }}>
          <svg viewBox="0 0 100 95" className="w-full h-full" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#E2E8F0" strokeWidth="0.15" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width="100" height="95" fill="url(#grid)" />

            {/* Edges */}
            {edges.map(([fromId, toId], i) => {
              const from = nodeMap[fromId];
              const to = nodeMap[toId];
              if (!from || !to) return null;
              const isFromCritical = from.status === "critical" || to.status === "critical";
              const isWarning = from.status === "warning" || to.status === "warning";
              return (
                <motion.line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={isFromCritical ? "#EF4444" : isWarning ? "#F59E0B" : "#CBD5E1"}
                  strokeWidth={isFromCritical ? "0.6" : "0.35"}
                  strokeOpacity={isFromCritical ? "1" : "0.6"}
                  strokeDasharray={isFromCritical ? "1 0.5" : "none"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.03 }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const cfg = typeConfig[node.type];
              const isSelected = selected === node.id;
              const isFiltered = filter !== "all" && node.status !== filter;
              const r = cfg.size / 2;
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isFiltered ? 0.2 : 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setSelected(selected === node.id ? null : node.id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Pulse ring for non-healthy */}
                  {node.status !== "healthy" && (
                    <motion.circle
                      cx={node.x} cy={node.y} r={r + 2}
                      fill="none"
                      stroke={statusColor[node.status]}
                      strokeWidth="0.5"
                      animate={{ r: [r + 1, r + 4, r + 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {/* Node circle */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={isSelected ? cfg.color : `${cfg.color}DD`}
                    stroke={statusColor[node.status]}
                    strokeWidth={isSelected ? "1.5" : "0.8"}
                    filter={isSelected ? "url(#glow)" : "none"}
                  />
                  {/* Status dot */}
                  <circle
                    cx={node.x + r * 0.6} cy={node.y - r * 0.6} r="1"
                    fill={statusColor[node.status]}
                    stroke="white"
                    strokeWidth="0.3"
                  />
                  {/* Label */}
                  <text
                    x={node.x} y={node.y + r + 2.5}
                    textAnchor="middle"
                    fontSize="2"
                    fill="#475569"
                    fontWeight="500"
                  >
                    {node.label.length > 12 ? node.label.slice(0, 12) + "…" : node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          {/* Status Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-sm">
            <div className="text-xs font-semibold text-[#64748B] mb-2">Node Status</div>
            {[["#10B981", "Healthy"], ["#F59E0B", "Warning"], ["#EF4444", "Critical"]].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-[#64748B]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Link Table */}
        <div className="bg-white border-t border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">Link Health Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#94A3B8] uppercase text-[10px] tracking-wider">
                  <th className="text-left pb-2">From</th>
                  <th className="text-left pb-2">To</th>
                  <th className="text-left pb-2">Bandwidth</th>
                  <th className="text-left pb-2">Utilization</th>
                  <th className="text-left pb-2">Latency</th>
                  <th className="text-left pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {linkTable.map((link, i) => (
                  <tr key={i} className="border-t border-[#F8FAFC]">
                    <td className="py-2 font-medium text-[#0F172A]">{link.from}</td>
                    <td className="py-2 text-[#475569]">{link.to}</td>
                    <td className="py-2 text-[#475569]">{link.bandwidth}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#F1F5F9] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${link.utilization}%`,
                              backgroundColor: link.utilization > 80 ? "#EF4444" : link.utilization > 60 ? "#F59E0B" : "#10B981"
                            }}
                          />
                        </div>
                        <span className="text-[#0F172A] font-semibold">{link.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-2 text-[#475569]">{link.latency}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        link.status === "healthy" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}>
                        {link.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Panel - Node Detail */}
      <div className="w-72 bg-white border-l border-[#E2E8F0] flex flex-col overflow-y-auto">
        {selectedNode ? (
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Node Detail</span>
                <button onClick={() => setSelected(null)} className="text-xs text-[#94A3B8] hover:text-[#64748B]">✕</button>
              </div>
              <h3 className="font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>{selectedNode.label}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#64748B] capitalize">{typeConfig[selectedNode.type].label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  selectedNode.status === "healthy" ? "bg-[#10B981]/10 text-[#10B981]" :
                  selectedNode.status === "warning" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                  "bg-[#EF4444]/10 text-[#EF4444]"
                }`}>{selectedNode.status}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {[
                { label: "CPU Load", value: selectedNode.load, unit: "%" },
                { label: "Memory", value: Math.round(selectedNode.load * 0.8), unit: "%" },
                { label: "Throughput", value: Math.round(selectedNode.load * 0.95), unit: "%" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#64748B]">{m.label}</span>
                    <span className="font-semibold text-[#0F172A]">{m.value}{m.unit}</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${m.value}%`,
                        backgroundColor: m.value > 80 ? "#EF4444" : m.value > 60 ? "#F59E0B" : "#1BA0D7"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Properties */}
            <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-2 text-xs">
              {[
                { k: "IP Address", v: `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254)}` },
                { k: "Active Links", v: selectedNode.links },
                { k: "Uptime", v: "127d 14h 22m" },
                { k: "Last Event", v: "2 minutes ago" },
                { k: "Location", v: "DC-WEST Rack A12" },
              ].map(p => (
                <div key={p.k} className="flex justify-between">
                  <span className="text-[#64748B]">{p.k}</span>
                  <span className="font-medium text-[#0F172A]">{p.v}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full bg-[#1BA0D7] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#0A84FF] transition-colors">
                Run Diagnostics
              </button>
              <button className="w-full border border-[#E2E8F0] text-[#475569] py-2 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] transition-colors">
                View Logs
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
              <Server className="w-8 h-8 text-[#CBD5E1]" />
            </div>
            <div className="text-sm font-semibold text-[#475569]">Select a Node</div>
            <div className="text-xs text-[#94A3B8] mt-1">Click any node in the topology to view detailed metrics and diagnostics</div>
            <div className="mt-6 w-full space-y-2">
              <div className="text-xs font-semibold text-[#64748B] text-left">Quick Stats</div>
              {[
                { label: "Total Nodes", value: nodes.length, color: "#1BA0D7" },
                { label: "Healthy", value: nodes.filter(n => n.status === "healthy").length, color: "#10B981" },
                { label: "Warning", value: nodes.filter(n => n.status === "warning").length, color: "#F59E0B" },
                { label: "Critical", value: nodes.filter(n => n.status === "critical").length, color: "#EF4444" },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center p-2 bg-[#F8FAFC] rounded-lg">
                  <span className="text-xs text-[#64748B]">{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
