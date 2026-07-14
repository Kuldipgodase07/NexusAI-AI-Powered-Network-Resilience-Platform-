import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hexagon, Brain, Cpu, Shield, Network, Zap, Activity,
  CheckCircle2, ArrowRight, ChevronRight, Star, Menu, X,
  Globe, TrendingUp, BarChart3, Play, Users, Lock,
  Wifi, Database, Layers, Server
} from "lucide-react";

/* ─── Cisco Design Tokens ────────────────── */
const C_BLUE = "#049FD9";
const C_NAVY = "#00364A";
const C_DARK = "#001E32";
const C_TEAL = "#005073";
const C_PALE = "#E5F6FD";
const C_SUCC = "#6EBE4A";

/* ─── Animated Hero Network ─────────────── */
function HeroNetwork() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const nodes = [
    { id: "core",   label: "Myalosis Core",  x: 380, y: 160, r: 36, color: C_BLUE,  main: true  },
    { id: "meraki", label: "Meraki",          x: 180, y: 80,  r: 22, color: C_TEAL,  main: false },
    { id: "sec",    label: "SecureX",         x: 560, y: 80,  r: 22, color: "#6EBE4A", main: false },
    { id: "web",    label: "Webex",           x: 120, y: 220, r: 20, color: C_TEAL,  main: false },
    { id: "cat",    label: "Catalyst",        x: 620, y: 220, r: 20, color: C_TEAL,  main: false },
    { id: "eye",    label: "ThousandEyes",    x: 220, y: 320, r: 18, color: C_BLUE,  main: false },
    { id: "cortex", label: "Cortex",          x: 520, y: 320, r: 18, color: "#7C3AED", main: false },
    { id: "fab",    label: "Fabric",          x: 380, y: 340, r: 18, color: C_BLUE,  main: false },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,3],[2,4],[5,7],[6,7]];

  return (
    <svg viewBox="0 0 750 420" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C_BLUE} stopOpacity="0.4" />
          <stop offset="100%" stopColor={C_BLUE} stopOpacity="0" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glowStrong"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Background grid */}
      <g opacity="0.06">
        {Array.from({length:8},(_,i) => <line key={`h${i}`} x1={0} y1={i*60} x2={750} y2={i*60} stroke="white" strokeWidth="1"/>)}
        {Array.from({length:13},(_,i) => <line key={`v${i}`} x1={i*60} y1={0} x2={i*60} y2={420} stroke="white" strokeWidth="1"/>)}
      </g>

      {/* Edges */}
      {edges.map(([a,b],i) => {
        const na = nodes[a], nb = nodes[b];
        const active = i < 5;
        return (
          <g key={i}>
            <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={active ? C_BLUE : "rgba(255,255,255,0.15)"} strokeWidth={active ? 1.5 : 1}
              strokeDasharray={active ? "none" : "4 4"} opacity={0.6} />
            {active && (
              <motion.circle r={4} fill={C_BLUE}
                animate={{ cx: [na.x, nb.x], cy: [na.y, nb.y] }}
                transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "linear", delay: i * 0.5 }} />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r + 14} fill={n.color} opacity={0.08} />
          {n.main && <circle cx={n.x} cy={n.y} r={n.r + 8} fill="url(#coreGlow)" />}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.color}
            style={{ filter: n.main ? "url(#glowStrong)" : "url(#glow)" }} />
          {n.main && (
            <motion.circle cx={n.x} cy={n.y} r={n.r + 6} stroke={n.color} strokeWidth={2} fill="none"
              animate={{ r: [n.r + 6, n.r + 20], opacity: [0.7, 0] }}
              transition={{ duration: 2, repeat: Infinity }} />
          )}
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill="white" fontSize={n.main ? 10 : 8} fontWeight="700"
            fontFamily="Inter, sans-serif">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Data ──────────────────────────────── */
const capabilities = [
  {
    icon: Brain, color: C_BLUE, bg: C_PALE, name: "Nexus Cortex",
    sub: "AI Reasoning Engine",
    desc: "Multi-model AI orchestration with self-adaptive reasoning, causal graph analysis, and Myalosis-native context management at enterprise scale.",
    metric: "10M+ inferences/day", badge: "Core Platform",
  },
  {
    icon: Network, color: C_TEAL, bg: "#E5F0F5", name: "Nexus Fabric",
    sub: "Network Intelligence",
    desc: "Deep integration with the full Cisco ecosystem — Meraki, SD-WAN, Catalyst Center, ThousandEyes — for real-time topology intelligence.",
    metric: "<12ms avg latency", badge: "Cisco Native",
  },
  {
    icon: Shield, color: "#005A9C", bg: "#E8F0F8", name: "Nexus Sentinel",
    sub: "Security AI",
    desc: "Real-time threat correlation from Cisco SecureX with autonomous remediation playbooks — FedRAMP High, HIPAA, SOC 2 Type II certified.",
    metric: "99.99% SLA", badge: "Enterprise Security",
  },
];

const aiAgentSteps = [
  { icon: Wifi,    color: "#FFB300", label: "Nexus Scout",   role: "Discover",  desc: "Continuously maps topology changes, new devices, and service dependencies across your Cisco fabric." },
  { icon: Brain,   color: C_BLUE,   label: "Nexus Insight",  role: "Analyze",   desc: "Ingests live telemetry from all Cisco integrations and applies causal AI to identify root failure origins." },
  { icon: TrendingUp, color: "#FF7300", label: "Nexus Predict", role: "Predict", desc: "Forecasts network failures 2–18 hours in advance with 94% accuracy using behavioral ML models." },
  { icon: Zap,     color: C_SUCC,   label: "Nexus Resolve",  role: "Remediate", desc: "Executes approved runbooks, reroutes traffic, and applies policy changes — zero human intervention required." },
  { icon: CheckCircle2, color: "#7C3AED", label: "Nexus Assure", role: "Validate", desc: "Confirms recovery, validates SLA compliance, and generates executive incident post-mortems automatically." },
];

const featureRows = [
  {
    title: "Real-time Inference at Enterprise Scale",
    desc: "The Myalosis Core Engine processes 10M+ API calls per day with sub-12ms average latency. Intelligent model routing dynamically selects the optimal AI model for each request — Nexus-7B, Claude, or GPT-4.",
    bullets: ["Multi-model orchestration with automatic failover", "Adaptive batching & streaming responses", "Enterprise-grade rate limiting & quota management"],
    icon: Cpu, color: C_BLUE, visual: "inference",
  },
  {
    title: "Native Cisco Ecosystem Integration",
    desc: "Not an afterthought — deep API integrations with 8 Cisco products built into the platform core. Event-driven AI agents trigger instantly when Cisco telemetry changes, with zero polling overhead.",
    bullets: ["8 Cisco integrations: Meraki, Webex, SecureX, Catalyst, Duo, ThousandEyes, Umbrella, AppDynamics", "Event-driven architecture with webhook support", "Bi-directional data flow — read telemetry, write remediation"],
    icon: Network, color: C_TEAL, visual: "network",
  },
  {
    title: "Autonomous Security & Compliance",
    desc: "Nexus Sentinel continuously monitors the Cisco security fabric, correlates threat signals across SecureX, Duo, and Umbrella, and autonomously executes approved remediation playbooks.",
    bullets: ["SOC 2 Type II, ISO 27001, FedRAMP High certified", "AI-generated remediation suggestions for every alert", "90-day audit log with SIEM export and chain-of-custody"],
    icon: Shield, color: "#005A9C", visual: "security",
  },
];

const stats = [
  { value: "10M+",   label: "API calls processed daily" },
  { value: "<12ms",  label: "Average inference latency"  },
  { value: "340+",   label: "Enterprise customers"       },
  { value: "99.99%", label: "Platform SLA uptime"        },
];

const plans = [
  {
    name: "Professional", price: "$49", per: "/seat/mo", featured: false,
    desc: "For high-growth teams deploying AI across network operations.",
    features: ["Up to 50 AI agents", "5M API calls/month", "Nexus Cortex + Fabric", "Cisco Meraki & Webex integrations", "Email + chat support", "SOC 2 compliance"],
    cta: "Start Free Trial", color: C_BLUE,
  },
  {
    name: "Enterprise", price: "Custom", per: " pricing", featured: true,
    desc: "Full Cisco ecosystem + dedicated Myalosis core tenant.",
    features: ["Unlimited AI agents", "All 3 platform engines (Cortex + Fabric + Sentinel)", "All 8 Cisco integrations", "Dedicated Myalosis tenant", "24/7 enterprise support + SLA", "FedRAMP / HIPAA compliance pack", "Custom audit & reporting"],
    cta: "Request Enterprise Demo", color: C_BLUE,
  },
  {
    name: "Government / FedRAMP", price: "Custom", per: " pricing", featured: false,
    desc: "Air-gapped deployment for government and regulated industries.",
    features: ["Air-gapped on-premise deployment", "FedRAMP High & IL-4 authorized", "HIPAA, CJIS, ITAR compliance", "Dedicated government cloud tenant", "Classified-level security liaison", "Custom SIEM integration"],
    cta: "Contact FedRAMP Team", color: C_TEAL,
  },
];

const testimonials = [
  {
    quote: "Nexus AI cut our mean-time-to-detect network failures by 73%. The Cisco SecureX integration surfaced threat correlations we'd never seen with any other platform.",
    name: "Sarah K. Chen", role: "Chief Information Security Officer", company: "Fortune 100 Financial Services",
    initials: "SC",
  },
  {
    quote: "The Myalosis inference engine handles our 8M daily telemetry API calls with latency that would have required 3x the infrastructure with any alternative. ROI was 6.8x in year one.",
    name: "David Okafor", role: "Chief Technology Officer", company: "Global Healthcare Technology Group",
    initials: "DO",
  },
  {
    quote: "We deployed Nexus AI across 47 branch offices in 4 days. The Cisco Catalyst Center integration auto-discovered our entire topology — something that would have taken our team weeks.",
    name: "Priya Nair", role: "VP, Network Architecture", company: "APAC Manufacturing Conglomerate",
    initials: "PN",
  },
];

const trusted = ["Goldman Sachs", "Pfizer", "Boeing", "Deloitte", "US Department of Defense", "Accenture", "JPMorgan Chase", "Mayo Clinic"];

interface LandingPageProps { onLogin: () => void; onSignUp: () => void; }

export function LandingPage({ onLogin, onSignUp }: LandingPageProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveStep(s => (s + 1) % aiAgentSteps.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Sticky Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#D4D9DD]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: "#1D2228" }}>Nexus AI</div>
              <div className="text-[9px] font-semibold" style={{ color: C_BLUE }}>Powered by Cisco</div>
            </div>
          </div>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-7">
            {["Products", "Solutions", "Enterprise", "Integrations", "Pricing", "Docs"].map(l => (
              <a key={l} href="#" className="text-sm font-medium transition-colors" style={{ color: "#4D5358" }}
                onMouseEnter={e => (e.currentTarget.style.color = C_BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = "#4D5358")}>{l}</a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
              style={{ borderColor: `${C_TEAL}40`, color: C_TEAL, backgroundColor: "#E5F0F5" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C_TEAL }} />
              Cisco Alliance Partner
            </div>
            <button onClick={onLogin} className="hidden md:block text-sm font-semibold px-4 py-2 rounded-lg border transition-colors"
              style={{ color: "#1D2228", borderColor: "#D4D9DD" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C_BLUE; (e.currentTarget as HTMLElement).style.color = C_BLUE; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#D4D9DD"; (e.currentTarget as HTMLElement).style.color = "#1D2228"; }}>
              Sign In
            </button>
            <button onClick={onSignUp} className="text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all"
              style={{ backgroundColor: C_BLUE, boxShadow: `0 2px 8px ${C_BLUE}50` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0390C5")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = C_BLUE)}>
              Request Demo →
            </button>
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Myalosis subbar */}
        <div className="hidden md:flex items-center justify-center py-1.5 border-t" style={{ backgroundColor: C_DARK, borderColor: `${C_BLUE}30` }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C_BLUE }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8C949A" }}>
              Powered by <span style={{ color: C_BLUE }}>Myalosis Core Engine</span> · Enterprise-grade AI infrastructure
            </span>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-6 py-4 space-y-2" style={{ borderColor: "#D4D9DD" }}>
            {["Products","Solutions","Enterprise","Integrations","Pricing"].map(l => (
              <div key={l} className="py-2 border-b text-sm" style={{ color: "#4D5358", borderColor: "#F5F7FA" }}>{l}</div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={onLogin} className="flex-1 border py-2 rounded-lg text-sm font-semibold" style={{ borderColor: "#D4D9DD", color: "#1D2228" }}>Sign In</button>
              <button onClick={onSignUp} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C_BLUE }}>Request Demo</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-24 relative overflow-hidden" style={{ background: `linear-gradient(150deg, ${C_DARK} 0%, ${C_NAVY} 60%, ${C_TEAL} 100%)` }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-10"
          style={{ background: `radial-gradient(circle at 80% 40%, ${C_BLUE}, transparent 60%)` }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
                style={{ borderColor: `${C_BLUE}40`, backgroundColor: `${C_BLUE}15` }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C_SUCC }} />
                <span className="text-xs font-semibold" style={{ color: C_BLUE }}>Cisco Innovation Challenge 2025 · Finalist</span>
              </div>

              <h1 className="text-white mb-6 leading-[1.1]"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Enterprise Intelligence.<br />
                <span style={{ color: C_BLUE }}>Revived.</span> Unified.<br />
                <span style={{ opacity: 0.9 }}>Nexus.</span>
              </h1>

              <p className="mb-10 leading-relaxed" style={{ color: "#B0BEC5", fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}>
                Nexus AI fuses the Myalosis intelligence core with Cisco's enterprise network fabric — delivering real-time AI across every layer of your organization.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={onSignUp} className="flex items-center gap-2 text-white px-7 py-3.5 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: C_BLUE, boxShadow: `0 4px 20px ${C_BLUE}50` }}>
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.25)", color: "white", backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <Play className="w-4 h-4" /> Watch 2-min Demo
                </button>
                <button onClick={onLogin} className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl font-medium transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  Talk to Sales <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust marks */}
              <div className="flex flex-wrap gap-4">
                {["SOC 2 Type II", "ISO 27001", "FedRAMP Ready", "HIPAA", "GDPR"].map(m => (
                  <div key={m} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: C_SUCC }} />
                    <span className="text-xs font-medium" style={{ color: "#8C949A" }}>{m}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Network viz */}
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.2 }}
              className="h-80 md:h-[420px] relative">
              <HeroNetwork />
              {/* Floating stat cards */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 px-3 py-2 rounded-xl text-white text-xs font-semibold"
                style={{ backgroundColor: `${C_BLUE}CC`, backdropFilter: "blur(8px)", border: `1px solid ${C_BLUE}60` }}>
                <div className="text-[10px] opacity-70">Inference Latency</div>
                <div className="text-base font-bold">8.2ms</div>
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 left-4 px-3 py-2 rounded-xl text-white text-xs font-semibold"
                style={{ backgroundColor: `${C_TEAL}CC`, backdropFilter: "blur(8px)", border: `1px solid ${C_TEAL}60` }}>
                <div className="text-[10px] opacity-70">AI Confidence</div>
                <div className="text-base font-bold">94.2%</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trusted by ── */}
      <section className="py-10 border-b" style={{ backgroundColor: "#F5F7FA", borderColor: "#D4D9DD" }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-7" style={{ color: "#8C949A" }}>
            Trusted by Fortune 500 enterprises worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {trusted.map(n => (
              <div key={n} className="text-sm font-semibold transition-colors cursor-pointer" style={{ color: "#8C949A" }}
                onMouseEnter={e => (e.currentTarget.style.color = C_BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = "#8C949A")}>{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cisco Alliance Banner ── */}
      <section className="py-6 px-6" style={{ backgroundColor: C_TEAL }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Cisco Systems · Strategic Alliance Partner</div>
              <div className="text-white/70 text-xs mt-0.5">Verified Cisco Alliance ecosystem member</div>
            </div>
          </div>
          <p className="text-white/85 text-sm text-center max-w-lg">
            Native, real-time integration with <strong className="text-white">Cisco Meraki, Webex, SecureX, Catalyst Center, Duo, ThousandEyes, Umbrella, and AppDynamics</strong>.
          </p>
          <button className="flex items-center gap-2 bg-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex-shrink-0 hover:bg-gray-50"
            style={{ color: C_TEAL }}>
            Explore Integrations <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Platform Capabilities ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5"
              style={{ borderColor: "#D4D9DD", color: "#4D5358", backgroundColor: "#F5F7FA" }}>
              Platform Architecture
            </div>
            <h2 className="mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.01em" }}>
              Three engines. One platform.<br />Infinite enterprise intelligence.
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#4D5358" }}>
              Built on the Myalosis Core, Nexus AI delivers specialized AI capabilities across network intelligence, security, and business operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={i} whileHover={{ y: -6 }} transition={{ duration: 0.2 }}
                  className="rounded-2xl border-2 p-7 transition-all cursor-pointer group"
                  style={{ borderColor: "#E8ECF0", backgroundColor: "white" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = c.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8ECF0")}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                      <Icon className="w-6 h-6" style={{ color: c.color }} />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: c.bg, color: c.color }}>{c.badge}</span>
                  </div>
                  <div className="font-bold mb-1" style={{ color: "#1D2228", fontFamily: "Inter, sans-serif" }}>{c.name}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: c.color }}>{c.sub}</div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "#4D5358" }}>{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: c.bg, color: c.color }}>{c.metric}</div>
                    <span className="text-sm font-semibold flex items-center gap-1 transition-colors group-hover:gap-2"
                      style={{ color: c.color }}>Learn more <ChevronRight className="w-4 h-4" /></span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Agent Lifecycle ── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5"
              style={{ borderColor: "#D4D9DD", color: "#4D5358", backgroundColor: "white" }}>
              Autonomous AI Agents
            </div>
            <h2 className="mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.01em" }}>
              Five agents. Zero downtime.
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: "#4D5358" }}>
              NexusAI's multi-agent pipeline continuously operates — from topology discovery to post-incident validation — fully autonomously.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5" style={{ backgroundColor: "#D4D9DD" }}>
              <motion.div className="h-full rounded-full" style={{ backgroundColor: C_BLUE }}
                animate={{ width: `${((activeStep + 1) / aiAgentSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-0">
              {aiAgentSteps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <div key={i} onClick={() => setActiveStep(i)} className="flex-1 flex flex-col items-center gap-0 cursor-pointer px-2">
                    {/* Step number */}
                    <motion.div animate={{ scale: isActive ? 1.15 : 1 }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative z-10 border-2 transition-all"
                      style={{
                        backgroundColor: isActive ? step.color : isDone ? `${step.color}20` : "white",
                        borderColor: isActive || isDone ? step.color : "#D4D9DD",
                        boxShadow: isActive ? `0 8px 24px ${step.color}40` : "none",
                      }}>
                      <Icon className="w-8 h-8" style={{ color: isActive ? "white" : step.color }} />
                    </motion.div>
                    <div className="text-center">
                      <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: step.color }}>{step.role}</div>
                      <div className="font-bold text-sm mb-2" style={{ color: "#1D2228" }}>{step.label}</div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                            className="text-xs leading-relaxed" style={{ color: "#4D5358" }}>{step.desc}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    {isActive && (
                      <div className="mt-3 h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#D4D9DD" }}>
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: step.color }}
                          animate={{ width: ["0%","100%"] }} transition={{ duration: 2.4, ease: "linear" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature alternating rows ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          {featureRows.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={`grid md:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "" : ""}`}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
                    style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                    {i === 0 ? "AI Engine" : i === 1 ? "Cisco Integration" : "Security"}
                  </div>
                  <h3 className="mb-4" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 700, color: "#1D2228", lineHeight: 1.2 }}>{f.title}</h3>
                  <p className="leading-relaxed mb-6" style={{ color: "#4D5358" }}>{f.desc}</p>
                  <div className="space-y-3">
                    {f.bullets.map((b, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${f.color}20` }}>
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: f.color }} />
                        </div>
                        <span className="text-sm" style={{ color: "#4D5358" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-8 flex items-center gap-2 text-sm font-semibold transition-all" style={{ color: f.color }}>
                    Learn more about {f.icon === Cpu ? "Myalosis Core" : f.icon === Network ? "Cisco Integrations" : "Nexus Sentinel"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className={`${i % 2 === 1 ? "md:order-1" : ""} bg-[#F5F7FA] rounded-3xl p-10 border border-[#E8ECF0] flex items-center justify-center relative overflow-hidden`}
                  style={{ minHeight: 280 }}>
                  <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at center, ${f.color}, transparent 70%)` }} />
                  <div className="relative flex flex-col items-center gap-4">
                    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ duration: 4, repeat: Infinity }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${f.color}20, ${f.color}40)`, border: `2px solid ${f.color}30` }}>
                      <Icon className="w-10 h-10" style={{ color: f.color }} />
                    </motion.div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                      {[
                        { l: "Uptime", v: "99.99%" }, { l: "Latency", v: "<12ms" },
                        { l: "Models", v: "4 active" }, { l: "Events/s", v: "48K" },
                      ].map(m => (
                        <div key={m.l} className="bg-white rounded-xl p-3 text-center border border-[#E8ECF0] shadow-sm">
                          <div className="font-bold text-sm" style={{ color: "#1D2228" }}>{m.v}</div>
                          <div className="text-[10px]" style={{ color: "#8C949A" }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="py-20 px-6" style={{ background: `linear-gradient(135deg, ${C_DARK} 0%, ${C_NAVY} 100%)` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="font-bold text-white mb-2"
                  style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700 }}>{s.value}</div>
                <div className="text-sm font-medium" style={{ color: "#8C949A" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-3" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.01em" }}>
              Transparent enterprise pricing
            </h2>
            <p style={{ color: "#4D5358" }}>No hidden fees. No per-token surprises. Choose the tier that fits your enterprise.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} transition={{ duration: 0.2 }}
                className="rounded-2xl p-8 border-2 transition-all"
                style={{
                  borderColor: p.featured ? p.color : "#E8ECF0",
                  backgroundColor: p.featured ? C_PALE : "white",
                  boxShadow: p.featured ? `0 8px 32px ${p.color}25` : "none",
                }}>
                {p.featured && (
                  <div className="text-[10px] font-bold px-2.5 py-1 rounded-lg mb-5 inline-block text-white"
                    style={{ backgroundColor: p.color }}>⭐ Most Popular</div>
                )}
                <div className="font-bold mb-1" style={{ color: "#1D2228" }}>{p.name}</div>
                <div className="mb-3">
                  <span className="font-bold" style={{ fontSize: "2rem", color: p.color }}>{p.price}</span>
                  <span className="text-sm" style={{ color: "#8C949A" }}>{p.per}</span>
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "#4D5358" }}>{p.desc}</p>
                <div className="space-y-2.5 mb-8">
                  {p.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                      <span className="text-sm" style={{ color: "#4D5358" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={onSignUp} className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                  style={p.featured
                    ? { backgroundColor: p.color, color: "white", boxShadow: `0 4px 16px ${p.color}40` }
                    : { border: `2px solid ${p.color}`, color: p.color, backgroundColor: "transparent" }}>
                  {p.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-16" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1D2228", letterSpacing: "-0.01em" }}>
            What enterprise leaders say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border p-7 shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: "#E8ECF0" }}>
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(j => <Star key={j} className="w-4 h-4 fill-[#FFB300] text-[#FFB300]" />)}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "#4D5358" }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: [C_BLUE, C_TEAL, "#005A9C"][i] }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "#1D2228" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "#8C949A" }}>{t.role}</div>
                    <div className="text-xs font-semibold" style={{ color: C_BLUE }}>{t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C_DARK} 0%, ${C_NAVY} 50%, ${C_TEAL} 100%)` }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%"><defs><pattern id="g2" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#g2)"/></svg>
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Ready to Activate Nexus AI<br />Across Your Enterprise?
          </h2>
          <p className="mb-2" style={{ color: "#B0BEC5" }}>
            Average deployment: <strong className="text-white">4 days.</strong> Average ROI: <strong className="text-white">6.2x in year one.</strong>
          </p>
          <p className="text-sm mb-10" style={{ color: "#8C949A" }}>Join 340+ Fortune 500 enterprises. No migration required.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={onSignUp} className="flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-xl text-sm transition-all hover:bg-[#F5F7FA]"
              style={{ color: C_NAVY }}>
              Schedule Enterprise Demo <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 text-white border-2 border-white/25 px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
              Download Datasheet
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 px-6" style={{ backgroundColor: C_DARK }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C_BLUE}, ${C_TEAL})` }}>
                  <Hexagon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">Nexus AI</span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#8C949A" }}>
                Enterprise AI platform built on the Myalosis Core Engine, in strategic alliance with Cisco Systems.
              </p>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold px-2.5 py-1 rounded inline-block" style={{ backgroundColor: `${C_BLUE}20`, color: C_BLUE }}>Powered by Myalosis Core Engine</div>
                <div className="text-[10px] font-bold px-2.5 py-1 rounded inline-block" style={{ backgroundColor: `${C_TEAL}20`, color: "#7BC4D3" }}>Cisco Alliance Partner · Verified</div>
              </div>
            </div>
            {[
              { title: "Products",   items: ["Nexus Cortex", "Nexus Fabric", "Nexus Sentinel", "API Reference", "SDK & Tools"] },
              { title: "Solutions",  items: ["Financial Services", "Healthcare", "Government / FedRAMP", "Manufacturing", "Telecom"] },
              { title: "Company",    items: ["About Nexus AI", "Careers", "Partners", "Security", "Legal & Privacy"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8C949A" }}>{col.title}</div>
                {col.items.map(item => (
                  <div key={item} className="py-1.5 text-sm cursor-pointer transition-colors" style={{ color: "#4D5358" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C_BLUE)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#4D5358")}>{item}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: "#1D3040" }}>
            <div className="text-xs" style={{ color: "#4D5358" }}>© 2025 Nexus AI, Inc. All rights reserved. Cisco is a trademark of Cisco Systems, Inc.</div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "#4D5358" }}>
              {["SOC 2 Type II", "ISO 27001", "Privacy Policy", "Terms of Service", "Cookie Preferences"].map(l => (
                <a key={l} href="#" className="transition-colors hover:text-white">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
