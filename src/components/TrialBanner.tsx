import React from "react";
import { getStorageItem } from "../utils/storage";
import { ArrowRight } from "lucide-react";

export const TrialBanner: React.FC = () => {
  const trialStart = getStorageItem(
    "kast_trial_start",
    new Date().toISOString(),
  );
  const isSubscribed = getStorageItem("kast_subscribed", false);

  if (isSubscribed) return null;

  const daysPassed = Math.floor(
    (new Date().getTime() - new Date(trialStart).getTime()) /
      (1000 * 3600 * 24),
  );
  const daysRemaining = Math.max(0, 15 - daysPassed);

  let bannerStyle = {};
  let message = `Trial — ${daysRemaining} days remaining. Upgrade to keep posting`;

  if (daysRemaining <= 3) {
    bannerStyle = {
      background: "rgba(247, 111, 142, 0.1)",
      color: "var(--accent-rose)",
      borderBottomColor: "rgba(247, 111, 142, 0.2)",
    };
    message = `Don't lose your data — trial ends in ${daysRemaining} days. Upgrade today`;
  } else if (daysRemaining <= 7) {
    bannerStyle = {
      background: "rgba(247, 168, 79, 0.15)",
      color: "var(--accent-amber)",
      borderBottomColor: "rgba(247, 168, 79, 0.3)",
    };
  }

  return (
    <div className="trial-banner" style={bannerStyle}>
      {message} <ArrowRight size={14} className="ml-2" />
    </div>
  );
};
