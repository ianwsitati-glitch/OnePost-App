import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Instagram,
  Facebook,
  Video,
  Sparkles,
} from "lucide-react";
import { getStorageItem, Post } from "../utils/storage";

export const AnalyticsScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const businessType = getStorageItem<string>(
    "kast_business_type",
    "Retail / Products",
  );

  useEffect(() => {
    setPosts(getStorageItem<Post[]>("kast_posts", []));
  }, []);

  const totalReach = posts.reduce((acc, p) => acc + p.analytics.reach, 0);
  const avgEngagement = posts.length
    ? (
        posts.reduce((acc, p) => acc + p.analytics.engagement_rate, 0) /
        posts.length
      ).toFixed(1)
    : 0;
  const totalPosts = posts.length;

  if (posts.length === 0) {
    return (
      <div className="flex-col items-center justify-center h-full text-center gap-6">
        <div className="w-32 h-32 rounded-full bg-glass border-glass flex items-center justify-center mb-4">
          <Sparkles size={48} className="text-primary-color opacity-50" />
        </div>
        <h2 className="text-3xl font-bold">
          Insights appear after your first post.
        </h2>
        <p className="text-secondary max-w-md">
          Create something and come back here — the data will surprise you.
        </p>
        <button className="btn btn-primary mt-4">Create a post →</button>
      </div>
    );
  }

  return (
    <div className="flex-col gap-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="glass-panel p-1 flex gap-1">
          {["Last 7 days", "30 days", "90 days"].map((range, i) => (
            <button
              key={range}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === 0 ? "bg-primary text-white" : "text-secondary hover:text-primary"}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Reach",
            value: totalReach.toLocaleString(),
            trend: "+12%",
            up: true,
          },
          {
            label: "Engagement Rate",
            value: `${avgEngagement}%`,
            trend: "+2.4%",
            up: true,
          },
          {
            label: "Posts Published",
            value: totalPosts,
            trend: "-1",
            up: false,
          },
          {
            label: "Best Platform",
            value: "Instagram",
            icon: Instagram,
            color: "var(--ig-color)",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-6 flex-col gap-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm text-secondary font-medium">
                {stat.label}
              </span>
              {stat.icon && <stat.icon size={20} color={stat.color} />}
            </div>
            <div className="text-3xl font-mono font-bold mt-2">
              {stat.value}
            </div>
            {stat.trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium mt-2 ${stat.up ? "text-accent-teal" : "text-accent-rose"}`}
              >
                {stat.up ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {stat.trend} vs last period
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-glass" />
          </div>
        ))}
      </div>

      {/* Row 2: Platform Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            name: "Instagram",
            icon: Instagram,
            color: "var(--ig-color)",
            reach: Math.floor(totalReach * 0.5),
            eng: "4.2%",
            tip: "📸 Photos perform best for you here",
          },
          {
            name: "Facebook",
            icon: Facebook,
            color: "var(--fb-color)",
            reach: Math.floor(totalReach * 0.2),
            eng: "2.1%",
            tip: "✦ Mixed media gets 3x more clicks",
          },
          {
            name: "TikTok",
            icon: Video,
            color: "#FFF",
            reach: Math.floor(totalReach * 0.3),
            eng: "6.8%",
            tip: "🎵 Trending audio boosts reach",
          },
        ].map((platform) => (
          <div
            key={platform.name}
            className="glass-card p-6 flex-col gap-4 border-l-4"
            style={{ borderLeftColor: platform.color }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `color-mix(in srgb, ${platform.color} 20%, transparent)`,
                }}
              >
                <platform.icon size={20} color={platform.color} />
              </div>
              <span className="font-bold">{platform.name}</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex-col">
                <span className="text-xs text-secondary">Reach</span>
                <span className="text-2xl font-mono font-bold">
                  {platform.reach.toLocaleString()}
                </span>
              </div>
              <div className="flex-col text-right">
                <span className="text-xs text-secondary">Engagement</span>
                <span className="text-lg font-mono font-bold text-accent-teal">
                  {platform.eng}
                </span>
              </div>
            </div>
            <div className="bg-glass p-2 rounded-lg text-xs font-medium text-primary-color flex items-center gap-2">
              <Sparkles size={14} /> {platform.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Best Time to Post */}
      <div className="glass-card p-6 flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold mb-1">
            When your audience is most active
          </h3>
          <p className="text-sm text-secondary">
            Based on {businessType} engagement data.
          </p>
        </div>

        <div className="flex gap-4">
          <div
            className="flex-col gap-2 text-xs text-secondary justify-between py-4"
            style={{ width: 40 }}
          >
            <span>12am</span>
            <span>6am</span>
            <span>12pm</span>
            <span>6pm</span>
          </div>
          <div className="flex-1 grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, dIdx) => (
                <div key={day} className="flex-col gap-1">
                  <div className="text-center text-xs font-medium text-secondary mb-2">
                    {day}
                  </div>
                  {Array.from({ length: 24 }).map((_, hIdx) => {
                    // Simulate heatmap intensity based on business type
                    let intensity = 0.1;
                    if (
                      businessType.includes("Retail") &&
                      (dIdx === 0 || dIdx === 6) &&
                      hIdx > 10 &&
                      hIdx < 16
                    )
                      intensity = 0.7;
                    if (
                      businessType.includes("Food") &&
                      (dIdx === 5 || dIdx === 6) &&
                      hIdx > 17 &&
                      hIdx < 21
                    )
                      intensity = 0.9;
                    if (hIdx > 8 && hIdx < 20) intensity += Math.random() * 0.4;

                    const isPeak = intensity > 0.8;

                    return (
                      <div
                        key={hIdx}
                        className="w-full h-4 rounded-sm transition-all hover:scale-110 cursor-pointer"
                        style={{
                          background: isPeak
                            ? "var(--primary)"
                            : `rgba(79, 142, 247, ${intensity})`,
                          boxShadow: isPeak
                            ? "0 0 8px var(--primary-glow)"
                            : "none",
                        }}
                        title={`${day} ${hIdx}:00 - Intensity: ${Math.round(intensity * 100)}%`}
                      />
                    );
                  })}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="border-t border-glass pt-4 flex-col gap-3">
          <span className="text-sm font-medium">
            Your top 3 best times to post:
          </span>
          <div className="flex gap-4">
            {["Thursday 7:30pm", "Saturday 12:00pm", "Tuesday 8:00am"].map(
              (time, i) => (
                <div
                  key={i}
                  className="glass-panel px-4 py-2 flex items-center gap-3"
                >
                  <span className="text-sm font-bold">{time}</span>
                  <div className="flex gap-1">
                    <Instagram size={14} color="var(--ig-color)" />
                    {i === 0 && <Facebook size={14} color="var(--fb-color)" />}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Top Posts */}
      <div className="flex-col gap-4">
        <h3 className="text-xl font-bold">Your best performing posts</h3>
        <div className="grid grid-cols-3 gap-4">
          {posts.slice(0, 3).map((post, i) => (
            <div key={post.id} className="glass-card p-4 flex-col gap-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-glass overflow-hidden flex-shrink-0">
                  {post.media_url ? (
                    <img
                      src={post.media_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                      Text
                    </div>
                  )}
                </div>
                <div className="flex-col justify-center">
                  <p className="text-xs line-clamp-2 text-secondary">
                    {post.caption_main}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {post.platforms.includes("instagram") && (
                      <Instagram size={12} color="var(--ig-color)" />
                    )}
                    {post.platforms.includes("facebook") && (
                      <Facebook size={12} color="var(--fb-color)" />
                    )}
                    {post.platforms.includes("tiktok") && (
                      <Video size={12} color="#FFF" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-glass pt-3">
                <div className="flex-col">
                  <span className="text-xs text-secondary">Reach</span>
                  <span className="text-lg font-mono font-bold text-accent-teal">
                    {post.analytics.reach.toLocaleString()}
                  </span>
                </div>
                <div className="bg-glass px-2 py-1 rounded text-[10px] font-medium text-primary-color border border-primary/30">
                  {
                    [
                      "Strong hook",
                      "Posted at peak time",
                      "Used trending topic",
                    ][i]
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
