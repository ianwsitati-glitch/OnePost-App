import React, { useState, useEffect } from "react";
import {
  Instagram,
  Facebook,
  Video,
  Settings,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getStorageItem, setStorageItem } from "../utils/storage";
import { useToast } from "../components/Toast";

export const SettingsScreen: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [connected, setConnected] = useState<string[]>([]);
  const [trialStart, setTrialStart] = useState("");

  useEffect(() => {
    setName(getStorageItem("kast_user_name", "User"));
    setBusinessType(getStorageItem("kast_business_type", "Retail / Products"));
    setConnected(getStorageItem<string[]>("kast_connected_platforms", []));
    setTrialStart(getStorageItem("kast_trial_start", new Date().toISOString()));
  }, []);

  const handleSaveProfile = () => {
    setStorageItem("kast_user_name", name);
    setStorageItem("kast_business_type", businessType);
    showToast("Profile updated successfully", "success");
  };

  const togglePlatform = (platform: string) => {
    const newConnected = connected.includes(platform)
      ? connected.filter((p) => p !== platform)
      : [...connected, platform];
    setConnected(newConnected);
    setStorageItem("kast_connected_platforms", newConnected);
    showToast(
      `${platform} ${connected.includes(platform) ? "disconnected" : "connected"}`,
      "info",
    );
  };

  const daysPassed = Math.floor(
    (new Date().getTime() - new Date(trialStart).getTime()) /
      (1000 * 3600 * 24),
  );
  const daysRemaining = Math.max(0, 15 - daysPassed);

  return (
    <div className="flex-col gap-8 pb-20 max-w-3xl">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Section 1: Connected Accounts */}
      <div className="glass-card p-6 flex-col gap-6">
        <h3 className="text-lg font-bold">Your platforms</h3>

        <div className="flex-col gap-4">
          {/* Instagram */}
          <div className="glass-panel p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(225, 48, 108, 0.1)" }}
              >
                <Instagram size={24} color="var(--ig-color)" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Instagram Business</h4>
                <div className="flex items-center gap-2 text-xs">
                  {connected.includes("instagram") ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-accent-teal" />{" "}
                      <span className="text-secondary">
                        Connected as: @{name.toLowerCase().replace(/\s/g, "")}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-muted" />{" "}
                      <span className="text-muted">Not connected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              className={`btn ${connected.includes("instagram") ? "btn-secondary" : "btn-primary"}`}
              style={
                !connected.includes("instagram")
                  ? { background: "var(--ig-color)" }
                  : {}
              }
              onClick={() => togglePlatform("instagram")}
            >
              {connected.includes("instagram") ? "Disconnect" : "Connect"}
            </button>
          </div>

          {/* Facebook */}
          <div className="glass-panel p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(24, 119, 242, 0.1)" }}
              >
                <Facebook size={24} color="var(--fb-color)" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Facebook Page</h4>
                <div className="flex items-center gap-2 text-xs">
                  {connected.includes("facebook") ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-accent-teal" />{" "}
                      <span className="text-secondary">
                        Connected as: {name} Page
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-muted" />{" "}
                      <span className="text-muted">Not connected</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-primary-color mt-2">
                  ✦ Mixed media posts enabled
                </p>
              </div>
            </div>
            <button
              className={`btn ${connected.includes("facebook") ? "btn-secondary" : "btn-primary"}`}
              style={
                !connected.includes("facebook")
                  ? { background: "var(--fb-color)" }
                  : {}
              }
              onClick={() => togglePlatform("facebook")}
            >
              {connected.includes("facebook") ? "Disconnect" : "Connect"}
            </button>
          </div>

          {/* TikTok */}
          <div className="glass-panel p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <Video size={24} color="#FFF" />
              </div>
              <div>
                <h4 className="font-medium mb-1">TikTok Business</h4>
                <div className="flex items-center gap-2 text-xs">
                  {connected.includes("tiktok") ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-accent-teal" />{" "}
                      <span className="text-secondary">
                        Connected as: @{name.toLowerCase().replace(/\s/g, "")}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-muted" />{" "}
                      <span className="text-muted">Not connected</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted mt-2">
                  Audio note: Upload videos with audio baked in for best
                  results.
                </p>
              </div>
            </div>
            <button
              className={`btn ${connected.includes("tiktok") ? "btn-secondary" : "btn-primary"}`}
              style={
                !connected.includes("tiktok") ? { background: "#222" } : {}
              }
              onClick={() => togglePlatform("tiktok")}
            >
              {connected.includes("tiktok") ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Profile */}
      <div className="glass-card p-6 flex-col gap-6">
        <h3 className="text-lg font-bold">Profile</h3>

        <div className="flex gap-4">
          <div className="flex-1 flex-col gap-2">
            <label className="text-xs text-secondary">Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1 flex-col gap-2">
            <label className="text-xs text-secondary">Business Type</label>
            <select
              className="input-field"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              style={{ appearance: "none" }}
            >
              <option value="🛍️ Retail / Products">🛍️ Retail / Products</option>
              <option value="🍽️ Food & Hospitality">
                🍽️ Food & Hospitality
              </option>
              <option value="💅 Beauty & Wellness">💅 Beauty & Wellness</option>
              <option value="🎨 Creative / Freelancer">
                🎨 Creative / Freelancer
              </option>
              <option value="📦 E-commerce">📦 E-commerce</option>
              <option value="💼 Services / Consulting">
                💼 Services / Consulting
              </option>
            </select>
          </div>
        </div>
        <button
          className="btn btn-primary self-start"
          onClick={handleSaveProfile}
        >
          Save Profile
        </button>
      </div>

      {/* Section 4: Plan & Billing */}
      <div className="glass-card p-6 flex-col gap-6 border-accent-amber/30">
        <h3 className="text-lg font-bold">Plan & Billing</h3>

        <div className="flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-accent-amber">
              KAST Trial — {daysRemaining} days remaining
            </span>
          </div>
          <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-amber"
              style={{ width: `${(daysRemaining / 15) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="glass-panel p-6 flex-col gap-4">
            <h4 className="text-xl font-bold">SOLO</h4>
            <div className="text-3xl font-mono font-bold">
              $19<span className="text-sm text-secondary font-sans">/mo</span>
            </div>
            <ul className="flex-col gap-2 text-sm text-secondary mt-2">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" /> 3 social
                accounts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" /> Unlimited
                posts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" /> Full
                analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" /> Best-time
                AI
              </li>
            </ul>
            <button className="btn btn-primary w-full mt-4">
              Upgrade to Solo
            </button>
          </div>

          <div className="glass-panel p-6 flex-col gap-4 border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent-violet text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            <h4 className="text-xl font-bold">STUDIO</h4>
            <div className="text-3xl font-mono font-bold">
              $49<span className="text-sm text-secondary font-sans">/mo</span>
            </div>
            <ul className="flex-col gap-2 text-sm text-secondary mt-2">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" /> 10 social
                accounts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" />{" "}
                Everything in Solo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" /> Team
                members (2 seats)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-accent-teal" />{" "}
                Competitor tracking
              </li>
            </ul>
            <button className="btn btn-secondary w-full mt-4 border-primary text-primary-color">
              Upgrade to Studio
            </button>
          </div>
        </div>
        <p className="text-xs text-center text-secondary">
          Start free, upgrade anytime. No credit card required.
        </p>
      </div>

      {/* Section 5: API Status */}
      <div className="glass-card p-6 flex-col gap-6">
        <h3 className="text-lg font-bold">API Status</h3>

        <div className="flex-col gap-3">
          <div className="glass-panel p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Instagram size={18} color="var(--ig-color)" />
              <span className="text-sm font-medium">Instagram API</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-accent-teal">
                <div className="w-2 h-2 rounded-full bg-accent-teal" />{" "}
                Operational
              </div>
              <span className="text-xs font-mono text-secondary">
                Daily limit: 4/25 posts used
              </span>
            </div>
          </div>

          <div className="glass-panel p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Facebook size={18} color="var(--fb-color)" />
              <span className="text-sm font-medium">Facebook API</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-accent-teal">
                <div className="w-2 h-2 rounded-full bg-accent-teal" />{" "}
                Operational
              </div>
              <span className="text-xs font-mono text-secondary">
                Daily limit: 2/25 posts used
              </span>
            </div>
          </div>

          <div className="glass-panel p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Video size={18} color="#FFF" />
              <span className="text-sm font-medium">TikTok API</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-accent-teal">
                <div className="w-2 h-2 rounded-full bg-accent-teal" />{" "}
                Operational
              </div>
              <span className="text-xs font-mono text-secondary">
                Daily limit: 1/15 posts used
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted">
          Limits reset at midnight UTC. KAST monitors these automatically and
          will warn you before you approach limits.
        </p>
      </div>
    </div>
  );
};
