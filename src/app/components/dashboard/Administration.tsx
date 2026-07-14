import { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Shield, Key, Settings2, FileText,
  Plus, Search, CheckCircle2, AlertTriangle, Edit, Trash2
} from "lucide-react";

type AdminTab = "users" | "roles" | "integrations" | "security" | "audit";

const users = [
  { name: "James Chen", email: "james.chen@acme.corp", role: "NOC Manager", status: "active", lastLogin: "2 hours ago", mfa: true },
  { name: "Sarah Kim", email: "sarah.kim@acme.corp", role: "Network Engineer", status: "active", lastLogin: "4 hours ago", mfa: true },
  { name: "David Park", email: "david.park@acme.corp", role: "Network Architect", status: "active", lastLogin: "1 day ago", mfa: true },
  { name: "Rachel Torres", email: "rachel.torres@acme.corp", role: "Executive (CIO)", status: "active", lastLogin: "3 days ago", mfa: false },
  { name: "Michael Lee", email: "m.lee@acme.corp", role: "Network Engineer", status: "inactive", lastLogin: "14 days ago", mfa: false },
  { name: "Emily Zhang", email: "e.zhang@acme.corp", role: "Read Only", status: "active", lastLogin: "5 hours ago", mfa: true },
];

const roles = [
  { name: "NOC Manager", users: 3, permissions: 48, desc: "Full operational access including remediation approval" },
  { name: "Network Engineer", users: 8, permissions: 36, desc: "Read/write access to network configs and diagnostics" },
  { name: "Network Architect", users: 4, permissions: 40, desc: "Design, topology, and capacity planning access" },
  { name: "Executive (CIO)", users: 2, permissions: 12, desc: "Read-only dashboards and executive reporting" },
  { name: "Read Only", users: 6, permissions: 8, desc: "Observe-only access to dashboards" },
  { name: "AI Operator", users: 1, permissions: 52, desc: "Full AI agent and automation control" },
];

const integrations = [
  { name: "Cisco DNA Center", category: "Network", status: "connected", lastSync: "30s ago", icon: "🔵" },
  { name: "AWS CloudWatch", category: "Cloud", status: "connected", lastSync: "1m ago", icon: "🟠" },
  { name: "Azure Monitor", category: "Cloud", status: "connected", lastSync: "2m ago", icon: "🔷" },
  { name: "PagerDuty", category: "Alerting", status: "connected", lastSync: "Real-time", icon: "🟢" },
  { name: "ServiceNow ITSM", category: "ITSM", status: "connected", lastSync: "5m ago", icon: "🟣" },
  { name: "Datadog APM", category: "Monitoring", status: "warning", lastSync: "8m ago", icon: "🐶" },
  { name: "Splunk SIEM", category: "Security", status: "connected", lastSync: "Real-time", icon: "🟡" },
  { name: "Terraform", category: "IaC", status: "disconnected", lastSync: "N/A", icon: "🔮" },
];

const auditLogs = [
  { time: "14:32:01", user: "AI Agent", action: "Initiated BGP failover workflow WF-0089", category: "Remediation", severity: "high" },
  { time: "14:28:14", user: "AI Agent", action: "Queued WAN rebalance APQ-041 for approval", category: "Automation", severity: "medium" },
  { time: "14:15:00", user: "James Chen", action: "Approved workflow WF-0085 — OSPF re-optimization", category: "Approval", severity: "medium" },
  { time: "13:55:00", user: "Sarah Kim", action: "Ran diagnostics on AS-CORE-01 GigE0/0/1", category: "Diagnostics", severity: "low" },
  { time: "12:30:15", user: "System", action: "Scheduled backup completed — 1,371 node configs archived", category: "Maintenance", severity: "low" },
  { time: "11:02:47", user: "David Park", action: "Updated OSPF cost policy for DIST-CENT-01", category: "Config Change", severity: "high" },
  { time: "09:15:30", user: "James Chen", action: "Exported Q2 2026 Executive Network Report", category: "Reporting", severity: "low" },
];

const securityPolicies = [
  { name: "MFA Enforcement", status: "enforced", scope: "All users", lastReview: "Jun 1, 2026" },
  { name: "Session Timeout", status: "enforced", scope: "8 hours", lastReview: "May 15, 2026" },
  { name: "IP Allowlisting", status: "partial", scope: "Admin roles only", lastReview: "May 1, 2026" },
  { name: "API Rate Limiting", status: "enforced", scope: "1000 req/min", lastReview: "Apr 20, 2026" },
  { name: "Audit Log Retention", status: "enforced", scope: "365 days", lastReview: "Apr 15, 2026" },
  { name: "Encryption at Rest", status: "enforced", scope: "AES-256", lastReview: "Mar 30, 2026" },
];

const tabs: { id: AdminTab; label: string; icon: typeof Users }[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: Key },
  { id: "integrations", label: "Integrations", icon: Settings2 },
  { id: "security", label: "Security Policies", icon: Shield },
  { id: "audit", label: "Audit Logs", icon: FileText },
];

export function Administration() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Sora, sans-serif" }}>Administration</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Manage users, roles, integrations, and security policies</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs text-[#10B981] font-semibold">SOC 2 Compliant</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white shadow text-[#0F172A]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="p-4 border-b border-[#F1F5F9] flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-[#94A3B8]" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none flex-1"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#1BA0D7] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0A84FF] transition-colors">
                <Plus className="w-4 h-4" />
                Invite User
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[#94A3B8] text-xs uppercase tracking-wider border-b border-[#F1F5F9]">
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">MFA</th>
                  <th className="text-left px-4 py-3">Last Login</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                  <tr key={u.email} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1BA0D7] to-[#0A84FF] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{u.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                          <div className="font-medium text-[#0F172A] text-sm">{u.name}</div>
                          <div className="text-xs text-[#64748B]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#475569]">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.status === "active" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#94A3B8]/10 text-[#94A3B8]"
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${u.mfa ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        {u.mfa ? "✓ Enabled" : "✗ Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#1BA0D7] transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEF2F2] text-[#94A3B8] hover:text-[#EF4444] transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {roles.map(r => (
              <div key={r.name} className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#1BA0D7]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1BA0D7]/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-[#1BA0D7]" />
                  </div>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">{r.name}</h3>
                <p className="text-xs text-[#64748B] mb-3">{r.desc}</p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="text-[#64748B]">{r.users} users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="text-[#64748B]">{r.permissions} permissions</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="bg-[#F8FAFC] rounded-2xl p-5 border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2 hover:border-[#1BA0D7]/40 hover:bg-[#EFF6FF] transition-all cursor-pointer">
              <Plus className="w-6 h-6 text-[#CBD5E1]" />
              <span className="text-sm font-medium text-[#94A3B8]">Create Role</span>
            </button>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {integrations.map(intg => (
              <div key={intg.name} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{intg.icon}</div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    intg.status === "connected" ? "bg-[#10B981]/10 text-[#10B981]" :
                    intg.status === "warning" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                    "bg-[#EF4444]/10 text-[#EF4444]"
                  }`}>{intg.status}</span>
                </div>
                <h4 className="font-semibold text-[#0F172A] text-sm mb-0.5">{intg.name}</h4>
                <div className="text-xs text-[#64748B] mb-2">{intg.category}</div>
                <div className="text-xs text-[#94A3B8]">Last sync: {intg.lastSync}</div>
                <button className="mt-3 w-full border border-[#E2E8F0] text-[#475569] text-xs py-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors font-medium">
                  Configure
                </button>
              </div>
            ))}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2 hover:border-[#1BA0D7]/40 hover:bg-[#EFF6FF] transition-all cursor-pointer">
              <Plus className="w-6 h-6 text-[#CBD5E1]" />
              <span className="text-xs font-medium text-[#94A3B8]">Add Integration</span>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Security Score", value: "94/100", color: "#10B981" },
                { label: "MFA Adoption", value: "67%", color: "#F59E0B" },
                { label: "Open Violations", value: "0", color: "#1BA0D7" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] text-center">
                  <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: "Sora, sans-serif" }}>{s.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="p-4 border-b border-[#F1F5F9]">
                <h3 className="font-semibold text-[#0F172A]">Security Policies</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-[#94A3B8] text-xs uppercase tracking-wider border-b border-[#F1F5F9]">
                    <th className="text-left px-4 py-3">Policy</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Scope</th>
                    <th className="text-left px-4 py-3">Last Review</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {securityPolicies.map(p => (
                    <tr key={p.name} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#0F172A] text-sm">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.status === "enforced" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#475569]">{p.scope}</td>
                      <td className="px-4 py-3 text-xs text-[#64748B]">{p.lastReview}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-[#1BA0D7] hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="p-4 border-b border-[#F1F5F9] flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-[#94A3B8]" />
                <input placeholder="Search audit logs..." className="bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none flex-1" />
              </div>
              <button className="flex items-center gap-2 border border-[#E2E8F0] text-[#475569] px-3 py-2 rounded-xl text-sm hover:bg-[#F8FAFC] transition-colors">
                <FileText className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 px-4 py-3 hover:bg-[#F8FAFC] transition-colors">
                  <span className="font-mono text-xs text-[#94A3B8] whitespace-nowrap pt-0.5">{log.time}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-[#0F172A] text-sm">{log.user}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        log.category === "Remediation" ? "bg-[#1BA0D7]/10 text-[#1BA0D7]" :
                        log.category === "Config Change" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                        log.category === "Approval" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                        "bg-[#94A3B8]/10 text-[#94A3B8]"
                      }`}>{log.category}</span>
                    </div>
                    <div className="text-xs text-[#64748B]">{log.action}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                    log.severity === "high" ? "bg-[#EF4444]/10 text-[#EF4444]" :
                    log.severity === "medium" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                    "bg-[#10B981]/10 text-[#10B981]"
                  }`}>{log.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
