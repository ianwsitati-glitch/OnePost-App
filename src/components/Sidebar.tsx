import React from "react";
import {
  PenSquare,
  CalendarDays,
  BarChart3,
  CheckSquare,
  Settings,
  Zap,
} from "lucide-react";
import { getStorageItem } from "../utils/storage";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const userName = getStorageItem("kast_user_name", "User");
  const trialStart = getStorageItem(
    "kast_trial_start",
    new Date().toISOString(),
  );

  const daysPassed = Math.floor(
    (new Date().getTime() - new Date(trialStart).getTime()) /
      (1000 * 3600 * 24),
  );
  const daysRemaining = Math.max(0, 15 - daysPassed);

  const navItems = [
    { id: "compose", label: "Compose", icon: PenSquare },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "published", label: "Published", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_var(--primary-glow)]">
          K
        </div>
        <span className="font-bold text-xl tracking-tight">KAST</span>
      </div>

      <div className="flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentTab === item.id ? "active" : ""}`}
              onClick={() => setCurrentTab(item.id)}
              style={{
                background: "transparent",
                border: "none",
                textAlign: "left",
                width: "100%",
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex-col gap-4">
        <div
          className="glass-panel p-3 flex-col gap-2 border-accent-amber"
          style={{ borderColor: "rgba(247, 168, 79, 0.3)" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-accent-amber">
              Trial Plan
            </span>
            <span className="text-xs text-secondary">
              {daysRemaining} days left
            </span>
          </div>
          <div className="w-full h-1 bg-glass rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-amber"
              style={{ width: `${(daysRemaining / 15) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-glass border-glass flex items-center justify-center text-xs font-bold text-primary-color">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-col">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-secondary">Free Trial</span>
          </div>
        </div>

        <button className="btn btn-primary w-full mt-2 py-2 text-sm">
          <Zap size={16} /> Upgrade
        </button>
      </div>
    </div>
  );
};
