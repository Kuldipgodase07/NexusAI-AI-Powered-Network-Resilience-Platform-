import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { LandingPage }     from "./components/landing/LandingPage";
import { AuthPages }       from "./components/auth/AuthPages";
import type { UserPersona } from "./components/auth/RoleSelection";
import { Sidebar }         from "./components/layout/Sidebar";
import { TopBar }          from "./components/layout/TopBar";
import { FloatingCopilot } from "./components/layout/FloatingCopilot";

// Platform screens
import { CommandCenter }   from "./components/dashboard/CommandCenter";
import { AgentsDashboard } from "./components/dashboard/AgentsDashboard";
import { NexusAnalytics }  from "./components/dashboard/NexusAnalytics";
import { CiscoHub }        from "./components/dashboard/CiscoHub";
import { MyalosisConsole } from "./components/dashboard/MyalosisConsole";
import { ComplianceCenter} from "./components/dashboard/ComplianceCenter";
import { Administration }  from "./components/dashboard/Administration";

// Shared intelligence screens
import { AIAssistant }     from "./components/dashboard/AIAssistant";
import { NetworkIntelligence } from "./components/dashboard/NetworkIntelligence";
import { RootCauseAnalysis }   from "./components/dashboard/RootCauseAnalysis";
import { FailurePrediction }   from "./components/dashboard/FailurePrediction";
import { RemediationCenter }   from "./components/dashboard/RemediationCenter";

type AppView = "landing" | "auth" | "dashboard";

const FULL_HEIGHT_PAGES = new Set(["agents", "assistant", "connectivity"]);

export default function App() {
  const [view, setView]         = useState<AppView>("landing");
  const [activePage, setActivePage] = useState("home");
  const [authMode, setAuthMode] = useState<"login"|"signup">("login");
  const [persona, setPersona]   = useState<UserPersona|null>(null);

  const goToLogin  = () => { setAuthMode("login");  setView("auth"); };
  const goToSignUp = () => { setAuthMode("signup"); setView("auth"); };
  const goToLanding= () => { setView("landing"); setPersona(null); };

  // Called by AuthPages after all 3 steps complete (creds → persona → mfa)
  const handleAuthSuccess = (selectedPersona: UserPersona) => {
    setPersona(selectedPersona);
    setActivePage("home");
    setView("dashboard");
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":         return <CommandCenter />;
      case "agents":       return <AgentsDashboard />;
      case "analytics":    return <NexusAnalytics />;
      case "cisco":        return <CiscoHub />;
      case "myalosis":     return <MyalosisConsole />;
      case "security":     return <ComplianceCenter />;
      case "admin":        return <Administration />;
      case "connectivity": return <AIAssistant />;
      case "assistant":    return <AIAssistant />;
      case "rca":          return <RootCauseAnalysis />;
      case "prediction":   return <FailurePrediction />;
      case "remediation":  return <RemediationCenter />;
      case "network":      return <NetworkIntelligence />;
      default:             return <CommandCenter />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <AnimatePresence mode="wait">

        {view === "landing" && (
          <motion.div key="landing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }} className="w-full h-full overflow-y-auto">
            <LandingPage onLogin={goToLogin} onSignUp={goToSignUp} />
          </motion.div>
        )}

        {view === "auth" && (
          <motion.div key="auth" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }} className="w-full h-full">
            <AuthPages
              onSuccess={handleAuthSuccess}
              onBack={goToLanding}
              initialView={authMode}
            />
          </motion.div>
        )}

        {view === "dashboard" && persona && (
          <motion.div key="dashboard" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }} className="w-full h-full flex" style={{ backgroundColor: "#F5F7FA" }}>

            <Sidebar
              activePage={activePage}
              onNavigate={setActivePage}
              persona={persona}
              onSwitchPersona={() => setView("auth")}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <TopBar currentPage={activePage} onNavigate={setActivePage} onLogout={goToLanding} />

              <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F7FA" }}>
                <AnimatePresence mode="wait">
                  <motion.div key={activePage}
                    initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                    transition={{ duration:0.18 }}
                    className={FULL_HEIGHT_PAGES.has(activePage) ? "h-full flex flex-col" : ""}>
                    {renderPage()}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>

            <FloatingCopilot />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
