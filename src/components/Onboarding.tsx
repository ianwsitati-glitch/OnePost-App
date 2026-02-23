import React, { useState } from "react";
import {
  Instagram,
  Facebook,
  Video,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { setStorageItem, seedMockPosts } from "../utils/storage";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [connected, setConnected] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState("");

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && connected.length === 0) return;
    if (step === 3 && !businessType) return;

    if (step === 4) {
      setStorageItem("kast_user_name", name);
      setStorageItem("kast_connected_platforms", connected);
      setStorageItem("kast_business_type", businessType);
      setStorageItem("kast_trial_start", new Date().toISOString());
      setStorageItem("kast_subscribed", false);
      setStorageItem("kast_onboarding_complete", true);

      // Seed mock posts for analytics
      const mockPosts = seedMockPosts(businessType);
      setStorageItem("kast_posts", mockPosts);

      onComplete();
      return;
    }
    setStep(step + 1);
  };

  const togglePlatform = (platform: string) => {
    setConnected((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div
        className="modal-content glass-card p-8 flex-col gap-6"
        style={{ maxWidth: 540 }}
      >
        {step === 1 && (
          <div className="flex-col gap-6 text-center">
            <h1 className="text-3xl" style={{ letterSpacing: "-0.02em" }}>
              KAST
            </h1>
            <div>
              <h2 className="text-2xl mb-2">Post once. Reach everywhere.</h2>
              <p className="text-secondary">
                Connect your accounts and you are 60 seconds away from your
                first multi-platform post.
              </p>
            </div>
            <div className="flex-col gap-2 text-left mt-4">
              <label className="text-sm font-medium text-secondary">
                What should we call you?
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleNext}
              disabled={!name.trim()}
            >
              Start my 15-day free trial <ArrowRight size={18} />
            </button>
            <p className="text-xs text-muted">No credit card required.</p>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl mb-2">Connect your accounts</h2>
              <p className="text-secondary">
                Connect at least one to continue. You can add more anytime.
              </p>
            </div>

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
                    <h3 className="font-medium mb-1">Instagram Business</h3>
                    <p className="text-xs text-secondary">
                      Feed posts, Reels, Carousels
                    </p>
                    <p
                      className="text-xs text-muted mt-1"
                      style={{ fontSize: 10 }}
                    >
                      Requires a Business/Creator account
                    </p>
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
                  {connected.includes("instagram") ? (
                    <>
                      <CheckCircle size={16} className="text-accent-teal" />{" "}
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>

              {/* Facebook */}
              <div className="glass-panel p-4 flex justify-between items-center relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(24, 119, 242, 0.1)" }}
                  >
                    <Facebook size={24} color="var(--fb-color)" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Facebook Page</h3>
                    <p className="text-xs text-secondary">
                      Feed posts, mixed photo+video
                    </p>
                    <div
                      className="mt-2 inline-flex items-center gap-1 bg-glass px-2 py-1 rounded-lg border-glass"
                      style={{ fontSize: 10, color: "var(--accent-violet)" }}
                    >
                      ✦ KAST Exclusive: Photo + Video
                    </div>
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
                  {connected.includes("facebook") ? (
                    <>
                      <CheckCircle size={16} className="text-accent-teal" />{" "}
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
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
                    <h3 className="font-medium mb-1">TikTok Business</h3>
                    <p className="text-xs text-secondary">
                      Video posts up to 10 minutes
                    </p>
                    <p
                      className="text-xs text-muted mt-1"
                      style={{ fontSize: 10 }}
                    >
                      Original audio recommended
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
                  {connected.includes("tiktok") ? (
                    <>
                      <CheckCircle size={16} className="text-accent-teal" />{" "}
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary w-full mt-2"
              onClick={handleNext}
              disabled={connected.length === 0}
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex-col gap-6 text-center">
            <h2 className="text-2xl mb-2">What kind of business are you?</h2>
            <p className="text-secondary mb-4">
              This helps us personalise your analytics and suggestions.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                "🛍️ Retail / Products",
                "🍽️ Food & Hospitality",
                "💅 Beauty & Wellness",
                "🎨 Creative / Freelancer",
                "📦 E-commerce",
                "💼 Services / Consulting",
              ].map((type) => (
                <button
                  key={type}
                  className={`glass-panel p-4 text-sm font-medium transition-all ${businessType === type ? "border-primary text-primary-color" : "text-secondary hover:text-primary"}`}
                  style={
                    businessType === type
                      ? {
                          borderColor: "var(--primary)",
                          boxShadow: "0 0 0 1px var(--primary-glow)",
                        }
                      : {}
                  }
                  onClick={() => setBusinessType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleNext}
              disabled={!businessType}
            >
              Almost done <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex-col gap-6 text-center py-8">
            <div
              className="mx-auto w-16 h-16 rounded-2xl bg-glass border-glass flex items-center justify-center mb-4"
              style={{ boxShadow: "0 0 40px var(--primary-glow)" }}
            >
              <CheckCircle size={32} className="text-primary-color" />
            </div>
            <div>
              <h2 className="text-3xl mb-2">You are ready, {name}.</h2>
              <p className="text-secondary">
                Your 15-day trial starts now. Let's make your first KAST.
              </p>
            </div>

            <div className="flex-col gap-3 mt-6">
              <button className="btn btn-primary w-full" onClick={handleNext}>
                Create my first post <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary w-full" onClick={handleNext}>
                Explore the dashboard first
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
