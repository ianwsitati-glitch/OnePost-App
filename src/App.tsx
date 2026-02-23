import React, { useState, useEffect } from "react";
import { AuroraBackground } from "./components/AuroraBackground";
import { Sidebar } from "./components/Sidebar";
import { TrialBanner } from "./components/TrialBanner";
import { Onboarding } from "./components/Onboarding";
import { ComposeScreen } from "./screens/ComposeScreen";
import { ScheduleScreen } from "./screens/ScheduleScreen";
import { AnalyticsScreen } from "./screens/AnalyticsScreen";
import { PublishedScreen } from "./screens/PublishedScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ToastProvider } from "./components/Toast";
import { getStorageItem } from "./utils/storage";
import {
  PenSquare,
  CalendarDays,
  BarChart3,
  CheckSquare,
  Settings,
} from "lucide-react";

export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentTab, setCurrentTab] = useState("compose");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const complete = getStorageItem("kast_onboarding_complete", false);
    setIsOnboardingComplete(complete);
    setIsReady(true);
  }, []);

  if (!isReady) return <div className="bg-base min-h-screen" />;

  if (!isOnboardingComplete) {
    return (
      <ToastProvider>
        <AuroraBackground />
        <Onboarding onComplete={() => setIsOnboardingComplete(true)} />
      </ToastProvider>
    );
  }

  const renderScreen = () => {
    switch (currentTab) {
      case "compose":
        return <ComposeScreen />;
      case "schedule":
        return <ScheduleScreen />;
      case "analytics":
        return <AnalyticsScreen />;
      case "published":
        return <PublishedScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <ComposeScreen />;
    }
  };

  const navItems = [
    { id: "compose", label: "Compose", icon: PenSquare },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "published", label: "Published", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <ToastProvider>
      <AuroraBackground />
      <div className="app-container flex-col">
        <TrialBanner />
        <div className="flex flex-1 relative">
          <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <main className="main-content">
            <div className="max-w-7xl mx-auto w-full h-full">
              {renderScreen()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="bottom-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`bottom-nav-item ${currentTab === item.id ? "active" : ""}`}
                onClick={() => setCurrentTab(item.id)}
                style={{ background: "transparent", border: "none" }}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </ToastProvider>
  );
}
