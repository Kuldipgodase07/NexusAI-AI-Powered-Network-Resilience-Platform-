import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hexagon, Eye, EyeOff, ArrowRight, ArrowLeft, Shield,
  CheckCircle2, Smartphone, Mail, Lock, User, Building2,
  Brain, Activity, BarChart3, Network, TrendingUp, Cpu
} from "lucide-react";
import type { UserPersona } from "./RoleSelection";

const C_BLUE = "#049FD9";
const C_NAVY = "#00364A";
const C_DARK = "#001E32";
const C_TEAL = "#005073";
const C_PALE = "#E5F6FD";
const C_SUCC = "#6EBE4A";

/* ─── Persona config ──────────────────── */
const personas: {
  id: UserPersona; icon: typeof Cpu; label: string; sub: string;
  color: string; bg: string; features: string[];
}[] = [
  {
    id: "engineer", icon: Cpu, label: "Platform Engineer",
    sub: "AI Agents · Pipelines · API Config",
    color: C_BLUE, bg: C_PALE,
    features: ["Deploy & monitor AI agents", "Inference pipeline builder", "Myalosis Core console"],
  },
  {
    id: "architect", icon: Network, label: "Solutions Architect",
    sub: "Network Topology · Dependencies",
    color: "#7C3AED", bg: "#F5F3FF",
    features: ["Network topology explorer", "Service dependency maps", "Capacity planning"],
  },
  {
    id: "manager", icon: BarChart3, label: "IT Operations Manager",
    sub: "Incidents · SLAs · Team KPIs",
    color: C_TEAL, bg: "#E5F0F5",
    features: ["Incident queue & SLA tracking", "Team performance boards", "Escalation workflows"],
  },
  {
    id: "cio", icon: TrendingUp, label: "CIO / Executive",
    sub: "Business Impact · ROI · Strategy",
    color: "#005A9C", bg: "#E8F0F8",
    features: ["Executive business impact", "ROI & cost dashboards", "Strategic KPI board"],
  },
];

/* ─── OTP Input ──────────────────────── */
function OtpInput({ onComplete }: { onComplete: (code: string) => void }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handle = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputRefs[i + 1].current?.focus();
    if (next.every(Boolean) && val) onComplete(next.join(""));
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} ref={inputRefs[i]} value={d} maxLength={1} inputMode="numeric"
          onChange={e => handle(i, e.target.value)}
          onKeyDown={e => e.key === "Backspace" && !d && i > 0 && inputRefs[i-1].current?.focus()}
          className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
          style={{
            borderColor: d ? C_BLUE : "#D4D9DD",
            backgroundColor: d ? C_PALE : "#F5F7FA",
            color: "#1D2228",
          }} />
      ))}
    </div>
  );
}

/* ─── Left Panel ──────────────────────── */
function LeftPanel({ step }: { step: number }) {
  const feats = [
    { icon: Brain,    label: "10M+ AI inferences per day" },
    { icon: Shield,   label: "SOC 2 · FedRAMP · HIPAA certified" },
    { icon: Activity, label: "8 native Cisco product integrations" },
    { icon: CheckCircle2, label: "99.99% platform uptime SLA" },
  ];
  const steps = ["Authenticate", "Select Role", "Dashboard"];
  const nodePositions = [
    { x: 180, y: 100, r: 30, main: true },
    { x: 60,  y: 55,  r: 18 }, { x: 300, y: 55,  r: 18 },
    { x: 40,  y: 190, r: 15 }, { x: 320, y: 190, r: 15 },
    { x: 120, y: 270, r: 13 }, { x: 240, y: 270, r: 13 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,3],[2,4]];

  return (
    <div className="flex flex-col h-full px-10 py-12" style={{ background: `linear-gradient(160deg, ${C_DARK} 0%, ${C_NAVY} 65%, ${C_TEAL} 100%)` }}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})`, boxShadow: `0 4px 16px ${C_BLUE}50` }}>
          <Hexagon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold">Nexus AI</div>
          <div className="text-[10px] font-semibold" style={{ color: "#7BC4D3" }}>Powered by Myalosis · Cisco Alliance</div>
        </div>
      </div>

      {/* Headline */}
      <div className="mb-8">
        <h2 className="text-white mb-2" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.25 }}>
          Enterprise Intelligence.<br />
          <span style={{ color: C_BLUE }}>Revived.</span> Unified.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#B0BEC5" }}>
          Real-time AI across every layer of your Cisco network fabric.
        </p>
      </div>

      {/* Network SVG */}
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 360 300" className="w-full max-w-xs">
          {edges.map(([a, b], i) => {
            const na = nodePositions[a], nb = nodePositions[b];
            return (
              <g key={i}>
                <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={C_BLUE} strokeWidth={1.5} opacity={0.25} strokeDasharray="4 3" />
                <motion.circle r={3} fill={C_BLUE}
                  animate={{ cx: [na.x, nb.x], cy: [na.y, nb.y] }}
                  transition={{ duration: 2 + i * 0.35, repeat: Infinity, ease: "linear", delay: i * 0.4 }} />
              </g>
            );
          })}
          {nodePositions.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r + 8} fill={C_BLUE} opacity={0.07} />
              <circle cx={n.x} cy={n.y} r={n.r} fill={C_BLUE} opacity={n.main ? 1 : 0.65} />
              {n.main && (
                <motion.circle cx={n.x} cy={n.y} r={n.r + 6} stroke={C_BLUE} strokeWidth={2} fill="none"
                  animate={{ r: [n.r + 6, n.r + 18], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }} />
              )}
              {n.main && <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize={8} fontWeight="700" fontFamily="Inter">Myalosis</text>}
            </g>
          ))}
        </svg>
      </div>

      {/* Feature list */}
      <div className="space-y-3 mb-10">
        {feats.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C_BLUE}25` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: C_BLUE }} />
              </div>
              <span className="text-sm" style={{ color: "#B0BEC5" }}>{f.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={{
                  backgroundColor: i < step ? C_SUCC : i === step ? C_BLUE : "rgba(255,255,255,0.08)",
                  color: i <= step ? "white" : "rgba(255,255,255,0.35)",
                }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="text-[8px] font-medium whitespace-nowrap" style={{ color: i <= step ? "#B0BEC5" : "rgba(255,255,255,0.25)" }}>{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-0.5 mb-5 mx-1" style={{ backgroundColor: i < step ? `${C_SUCC}80` : "rgba(255,255,255,0.1)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────── */
interface AuthPagesProps {
  onSuccess: (persona: UserPersona) => void;
  onBack: () => void;
  initialView: "login" | "signup";
}

export function AuthPages({ onSuccess, onBack, initialView }: AuthPagesProps) {
  const [view, setView] = useState<"login"|"signup">(initialView);
  const [step, setStep] = useState<"creds"|"persona"|"mfa">("creds");
  const [selectedPersona, setSelectedPersona] = useState<UserPersona|null>(null);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const stepIdx = step === "creds" ? 0 : step === "persona" ? 1 : 2;

  const iStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10,
    border: "1.5px solid #D4D9DD", backgroundColor: "#F5F7FA", color: "#1D2228",
    fontSize: 14, outline: "none", transition: "all 0.2s", fontFamily: "Inter, sans-serif",
  };
  const iFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = C_BLUE; e.currentTarget.style.backgroundColor = "white"; };
  const iBlur  = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "#D4D9DD"; e.currentTarget.style.backgroundColor = "#F5F7FA"; };

  const SSOButtons = () => (
    <div className="space-y-2.5 mb-6">
      {[
        { label: "Continue with Cisco SecureX", color: C_TEAL,    icon: Shield },
        { label: "Continue with Microsoft",     color: "#0078D4", icon: Building2 },
        { label: "Continue with Okta",          color: "#007DC1", icon: Lock },
      ].map(s => {
        const Icon = s.icon;
        return (
          <button key={s.label} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left"
            style={{ borderColor: "#E8ECF0", color: "#1D2228", backgroundColor: "white" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.color; (e.currentTarget as HTMLElement).style.color = s.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF0"; (e.currentTarget as HTMLElement).style.color = "#1D2228"; }}>
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
            {s.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-full h-screen flex overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left */}
      <div className="hidden md:block w-[400px] flex-shrink-0 overflow-hidden">
        <LeftPanel step={stepIdx} />
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "#E8ECF0" }}>
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#8C949A" }}
            onMouseEnter={e => (e.currentTarget.style.color = C_BLUE)} onMouseLeave={e => (e.currentTarget.style.color = "#8C949A")}>
            <ArrowLeft className="w-4 h-4" /> Back to nexus.ai
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
              <Hexagon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: "#1D2228" }}>Nexus AI</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[460px]">
            <AnimatePresence mode="wait">

              {/* Step 1 — Credentials */}
              {step === "creds" && (
                <motion.div key="creds" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.22 }}>
                  <h1 className="mb-1" style={{ fontSize: "1.875rem", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.025em" }}>
                    {view === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="text-sm mb-8" style={{ color: "#8C949A" }}>
                    {view === "login" ? "Sign in to your Nexus AI enterprise workspace." : "Start your 14-day free trial. No credit card required."}
                  </p>

                  <SSOButtons />

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: "#E8ECF0" }} />
                    <span className="text-xs font-medium" style={{ color: "#8C949A" }}>or continue with email</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "#E8ECF0" }} />
                  </div>

                  <form onSubmit={e => { e.preventDefault(); setStep("persona"); }} className="space-y-4">
                    {view === "signup" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 w-4 h-4" style={{ color: "#8C949A" }} />
                          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                            style={iStyle} onFocus={iFocus} onBlur={iBlur} />
                        </div>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3.5 w-4 h-4" style={{ color: "#8C949A" }} />
                          <input required value={company} onChange={e => setCompany(e.target.value)} placeholder="Company"
                            style={iStyle} onFocus={iFocus} onBlur={iBlur} />
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4" style={{ color: "#8C949A" }} />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Work email address"
                        style={iStyle} onFocus={iFocus} onBlur={iBlur} />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4" style={{ color: "#8C949A" }} />
                      <input type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                        style={{ ...iStyle, paddingRight: 44 }} onFocus={iFocus} onBlur={iBlur} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5" style={{ color: "#8C949A" }}>
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {view === "login" && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs" style={{ color: "#8C949A" }}>Secured with Cisco enterprise encryption</span>
                        <button type="button" className="text-xs font-semibold" style={{ color: C_BLUE }}>Forgot password?</button>
                      </div>
                    )}
                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm mt-2"
                      style={{ backgroundColor: C_BLUE, boxShadow: `0 4px 16px ${C_BLUE}40` }}>
                      {view === "login" ? "Sign In to Nexus AI" : "Create Account"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <p className="text-center text-sm mt-6" style={{ color: "#8C949A" }}>
                    {view === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setView(view === "login" ? "signup" : "login")} className="font-semibold" style={{ color: C_BLUE }}>
                      {view === "login" ? "Sign up free" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              )}

              {/* Step 2 — Persona / Role selection */}
              {step === "persona" && (
                <motion.div key="persona" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.22 }}>
                  <button onClick={() => setStep("creds")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "#8C949A" }}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4"
                    style={{ backgroundColor: "#E0F5E8", color: "#3D8B3D" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authentication verified
                  </div>

                  <h2 className="mb-1" style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.02em" }}>
                    Select your workspace
                  </h2>
                  <p className="text-sm mb-7" style={{ color: "#8C949A" }}>
                    Welcome, <strong style={{ color: "#1D2228" }}>{email || "user@company.com"}</strong>. Choose your role to personalize your Nexus AI dashboard.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {personas.map(p => {
                      const Icon = p.icon;
                      const sel = selectedPersona === p.id;
                      return (
                        <motion.button key={p.id} onClick={() => setSelectedPersona(p.id)} whileTap={{ scale: 0.97 }}
                          className="text-left p-4 rounded-2xl border-2 transition-all"
                          style={{
                            borderColor: sel ? p.color : "#E8ECF0",
                            backgroundColor: sel ? p.bg : "white",
                            boxShadow: sel ? `0 4px 20px ${p.color}25` : "none",
                          }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: sel ? p.bg : "#F5F7FA" }}>
                              <Icon className="w-5 h-5" style={{ color: p.color }} />
                            </div>
                            {sel && (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: p.color }}>
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-sm mb-0.5" style={{ color: "#1D2228" }}>{p.label}</div>
                          <div className="text-[10px] leading-snug mb-2" style={{ color: "#8C949A" }}>{p.sub}</div>
                          {sel && (
                            <div className="space-y-1 pt-1 border-t" style={{ borderColor: `${p.color}25` }}>
                              {p.features.map(f => (
                                <div key={f} className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: p.color }}>
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />{f}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <button onClick={() => { if (selectedPersona) setStep("mfa"); }} disabled={!selectedPersona}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: selectedPersona ? C_BLUE : "#D4D9DD",
                      boxShadow: selectedPersona ? `0 4px 16px ${C_BLUE}40` : "none",
                      cursor: selectedPersona ? "pointer" : "not-allowed",
                    }}>
                    Continue to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 3 — MFA */}
              {step === "mfa" && (
                <motion.div key="mfa" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.22 }}>
                  <button onClick={() => setStep("persona")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "#8C949A" }}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: C_PALE }}>
                      <Smartphone className="w-8 h-8" style={{ color: C_BLUE }} />
                    </div>
                    <h2 className="mb-2" style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.02em" }}>
                      Two-factor authentication
                    </h2>
                    <p className="text-sm" style={{ color: "#8C949A" }}>
                      Enter the 6-digit verification code from your authenticator app.
                    </p>
                  </div>

                  <div className="mb-6">
                    <OtpInput onComplete={() => selectedPersona && onSuccess(selectedPersona)} />
                  </div>

                  <button onClick={() => selectedPersona && onSuccess(selectedPersona)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm mb-4"
                    style={{ backgroundColor: C_BLUE, boxShadow: `0 4px 16px ${C_BLUE}40` }}>
                    Verify & Enter Dashboard <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-sm" style={{ color: "#8C949A" }}>
                    Didn't receive a code?{" "}
                    <button className="font-semibold" style={{ color: C_BLUE }}>Resend code</button>
                  </p>

                  <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: "#F5F7FA", borderColor: "#E8ECF0" }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="w-4 h-4" style={{ color: C_TEAL }} />
                      <span className="text-xs font-bold" style={{ color: C_TEAL }}>Enterprise Security Active</span>
                    </div>
                    <p className="text-xs" style={{ color: "#8C949A" }}>
                      Session secured with 256-bit AES encryption and Cisco SecureX integration. Zero-trust policy enforced.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t text-center" style={{ borderColor: "#E8ECF0" }}>
          <p className="text-xs" style={{ color: "#8C949A" }}>
            By continuing, you agree to{" "}
            <a href="#" className="font-semibold" style={{ color: C_BLUE }}>Terms</a> and{" "}
            <a href="#" className="font-semibold" style={{ color: C_BLUE }}>Privacy Policy</a> ·
            SOC 2 Type II · ISO 27001 · FedRAMP Ready · Cisco Verified
          </p>
        </div>
      </div>
    </div>
  );
}
