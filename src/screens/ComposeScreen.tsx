import React, { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Instagram,
  Facebook,
  Calendar,
  Clock,
  Sparkles,
  Send,
} from "lucide-react";
import { getStorageItem, setStorageItem, Post } from "../utils/storage";
import { useToast } from "../components/Toast";

export const ComposeScreen: React.FC = () => {
  const { showToast } = useToast();
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [media2, setMedia2] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Per-platform captions
  const [igCaption, setIgCaption] = useState("");
  const [fbCaption, setFbCaption] = useState("");
  const [ttCaption, setTtCaption] = useState("");

  const [expandedAdapter, setExpandedAdapter] = useState<string | null>(null);

  const connectedPlatforms = getStorageItem<string[]>(
    "kast_connected_platforms",
    [],
  );
  const userName = getStorageItem<string>("kast_user_name", "User");
  const businessType = getStorageItem<string>(
    "kast_business_type",
    "Retail / Products",
  );

  useEffect(() => {
    setPlatforms(connectedPlatforms);
  }, []);

  useEffect(() => {
    // Auto-adapt logic simulation
    setIgCaption(caption + "\n\n#kast #socialmedia #business");
    setFbCaption(caption + "\n\nWhat do you think? Let us know below!");
    setTtCaption(
      caption.substring(0, 150) + (caption.length > 150 ? "..." : ""),
    );
  }, [caption]);

  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isSecond = false,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (isSecond) {
        setMedia2(url);
      } else {
        setMedia(url);
      }
    }
  };

  const togglePlatform = (platform: string) => {
    if (!connectedPlatforms.includes(platform)) return;
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handlePost = () => {
    if (!media && !caption) {
      showToast("Please add media or a caption", "warning");
      return;
    }
    if (platforms.length === 0) {
      showToast("Select at least one platform", "warning");
      return;
    }

    setIsPosting(true);

    // Simulate API call
    setTimeout(() => {
      // 5% chance of failure for Facebook simulation
      if (platforms.includes("facebook") && Math.random() < 0.05) {
        showToast(
          "Facebook post failed: Rate limit reached. Rescheduled for 1 hour.",
          "error",
        );
        setIsPosting(false);
        return;
      }

      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        caption_main: caption,
        caption_instagram: igCaption,
        caption_facebook: fbCaption,
        caption_tiktok: ttCaption,
        platforms,
        media_type: media2 ? "mixed" : media ? "photo" : "none",
        media_url: media || undefined,
        media_url_2: media2 || undefined,
        scheduled_time:
          scheduleMode === "schedule"
            ? `${scheduledDate}T${scheduledTime}`
            : null,
        status: scheduleMode === "schedule" ? "scheduled" : "published",
        created_at: new Date().toISOString(),
        analytics: { reach: 0, engagement_rate: 0, likes: 0, comments: 0 },
      };

      const existingPosts = getStorageItem<Post[]>("kast_posts", []);
      setStorageItem("kast_posts", [newPost, ...existingPosts]);

      showToast(
        `Your post has been ${scheduleMode === "schedule" ? "scheduled" : "sent"} to ${platforms.length} platforms ✓`,
        "success",
      );

      // Reset
      setCaption("");
      setMedia(null);
      setMedia2(null);
      setIsPosting(false);
    }, 1500);
  };

  return (
    <div className="flex gap-8 h-full">
      {/* Left Column - Composer */}
      <div className="flex-col gap-6" style={{ flex: "0 0 55%" }}>
        <h2 className="text-2xl">Compose</h2>

        {/* Media Upload */}
        <div
          className="glass-card p-6 flex-col items-center justify-center relative"
          style={{ minHeight: 200, borderStyle: "dashed" }}
        >
          {media ? (
            <div className="relative w-full h-full flex justify-center">
              <img
                src={media}
                alt="Upload preview"
                style={{
                  maxHeight: 200,
                  borderRadius: 12,
                  objectFit: "contain",
                }}
              />
              <button
                className="btn-icon absolute top-2 right-2 bg-glass"
                onClick={() => setMedia(null)}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={32} className="text-secondary mb-4" />
              <p className="text-secondary font-medium">
                Drop photo or video here, or tap to browse
              </p>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleMediaUpload(e)}
                accept="image/*,video/*"
              />
            </>
          )}
        </div>

        {/* Facebook Mixed Media Toggle */}
        {connectedPlatforms.includes("facebook") && (
          <div
            className="glass-panel p-4 border-primary"
            style={{ borderColor: "rgba(79, 142, 247, 0.3)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-primary-color" />
              <span className="text-sm font-medium text-primary-color">
                ✦ Facebook Mixed Media
              </span>
            </div>
            <p className="text-xs text-secondary mb-3">
              Add a second item for Facebook only. KAST can post both in the
              same Facebook post.
            </p>

            {media2 ? (
              <div className="relative w-32 h-24">
                <img
                  src={media2}
                  alt="Second upload"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
                <button
                  className="btn-icon absolute top-1 right-1 bg-glass"
                  onClick={() => setMedia2(null)}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div
                className="relative w-full h-24 glass-card flex items-center justify-center"
                style={{ borderStyle: "dashed" }}
              >
                <span className="text-xs text-secondary">
                  + Add second photo/video
                </span>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleMediaUpload(e, true)}
                  accept="image/*,video/*"
                />
              </div>
            )}
            {media2 && (
              <p className="text-xs text-muted mt-2">
                Facebook will show both items. Instagram and TikTok will use the
                first item only.
              </p>
            )}
          </div>
        )}

        {/* Caption */}
        <div className="flex-col gap-2">
          <textarea
            className="input-field"
            placeholder="Write your caption... KAST will adapt it for each platform."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ minHeight: 120, fontSize: 16 }}
          />
          <div className="flex gap-2">
            {connectedPlatforms.includes("instagram") && (
              <div
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  background: "rgba(225, 48, 108, 0.1)",
                  color: "var(--ig-color)",
                }}
              >
                IG: {igCaption.length}/2200
              </div>
            )}
            {connectedPlatforms.includes("facebook") && (
              <div
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  background: "rgba(24, 119, 242, 0.1)",
                  color: "var(--fb-color)",
                }}
              >
                FB: {fbCaption.length}/63206
              </div>
            )}
            {connectedPlatforms.includes("tiktok") && (
              <div
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#FFF",
                }}
              >
                TT: {ttCaption.length}/2200
              </div>
            )}
          </div>
        </div>

        {/* Adapters */}
        <div className="flex-col gap-2">
          {connectedPlatforms.map((platform) => (
            <div key={platform} className="glass-panel overflow-hidden">
              <button
                className="w-full p-3 text-sm font-medium flex justify-between items-center text-secondary hover:text-primary"
                onClick={() =>
                  setExpandedAdapter(
                    expandedAdapter === platform ? null : platform,
                  )
                }
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span className="capitalize">Customise for {platform}</span>
                <span>{expandedAdapter === platform ? "▴" : "▾"}</span>
              </button>
              {expandedAdapter === platform && (
                <div className="p-3 border-t border-glass bg-glass">
                  <textarea
                    className="input-field text-sm"
                    value={
                      platform === "instagram"
                        ? igCaption
                        : platform === "facebook"
                          ? fbCaption
                          : ttCaption
                    }
                    onChange={(e) => {
                      if (platform === "instagram")
                        setIgCaption(e.target.value);
                      if (platform === "facebook") setFbCaption(e.target.value);
                      if (platform === "tiktok") setTtCaption(e.target.value);
                    }}
                    style={{ minHeight: 80 }}
                  />
                  <p className="text-xs text-accent-teal mt-2">
                    {platform === "instagram" &&
                      "Auto-adapted: hashtags appended"}
                    {platform === "facebook" &&
                      "Auto-adapted: added call-to-action"}
                    {platform === "tiktok" &&
                      "Auto-adapted: trimmed to key hook"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scheduling */}
        <div className="flex gap-4">
          <button
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${scheduleMode === "now" ? "bg-primary text-white shadow-[0_4px_20px_var(--primary-glow)]" : "bg-glass border-glass text-secondary"}`}
            onClick={() => setScheduleMode("now")}
          >
            Post Now
          </button>
          <button
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${scheduleMode === "schedule" ? "bg-primary text-white shadow-[0_4px_20px_var(--primary-glow)]" : "bg-glass border-glass text-secondary"}`}
            onClick={() => setScheduleMode("schedule")}
          >
            Schedule
          </button>
        </div>

        {scheduleMode === "schedule" && (
          <div className="glass-panel p-4 flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 flex-col gap-2">
                <label className="text-xs text-secondary">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div className="flex-1 flex-col gap-2">
                <label className="text-xs text-secondary">Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>
            <div
              className="bg-glass p-3 rounded-lg border-glass flex items-start gap-2 cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                setScheduledDate(d.toISOString().split("T")[0]);
                setScheduledTime("19:30");
              }}
            >
              <Sparkles size={16} className="text-accent-amber mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent-amber">
                  Best Time Suggestion
                </p>
                <p className="text-xs text-secondary">
                  Your audience is most active at 7:30pm tomorrow. Tap to apply.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Platform Selector */}
        <div className="flex-col gap-3">
          <label className="text-sm font-medium">Post to:</label>
          <div className="flex gap-3">
            {["instagram", "facebook", "tiktok"].map((platform) => {
              const isConnected = connectedPlatforms.includes(platform);
              const isOn = platforms.includes(platform);
              const color =
                platform === "instagram"
                  ? "var(--ig-color)"
                  : platform === "facebook"
                    ? "var(--fb-color)"
                    : "#FFF";

              return (
                <button
                  key={platform}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${!isConnected ? "opacity-50 cursor-not-allowed border-glass bg-glass" : isOn ? "border-transparent" : "border-glass bg-glass"}`}
                  style={
                    isOn
                      ? {
                          background: color,
                          color: platform === "tiktok" ? "#000" : "#FFF",
                        }
                      : {}
                  }
                  onClick={() => togglePlatform(platform)}
                  disabled={!isConnected}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${isOn ? "bg-white" : "bg-secondary"}`}
                    style={
                      isOn && platform === "tiktok"
                        ? { background: "#000" }
                        : {}
                    }
                  />
                  <span className="text-sm font-medium capitalize">
                    {platform}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn btn-primary w-full py-4 text-lg mt-4"
          onClick={handlePost}
          disabled={isPosting}
        >
          {isPosting
            ? "KASTing..."
            : scheduleMode === "now"
              ? "KAST it →"
              : "Schedule KAST →"}
        </button>
      </div>

      {/* Right Column - Previews */}
      <div className="flex-col gap-6" style={{ flex: "0 0 45%" }}>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl">Preview</h2>
          <div className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_8px_var(--accent-teal)] animate-pulse" />
          <span className="text-xs text-accent-teal font-medium uppercase tracking-wider">
            Live
          </span>
        </div>

        <div
          className="flex-col gap-6 overflow-y-auto pb-20"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Instagram Preview */}
          {platforms.includes("instagram") && (
            <div
              className="glass-card overflow-hidden"
              style={{ width: 320, margin: "0 auto" }}
            >
              <div className="p-3 flex items-center gap-2 border-b border-glass">
                <div className="w-8 h-8 rounded-full bg-glass flex items-center justify-center text-xs">
                  {userName[0]}
                </div>
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <div className="w-full aspect-square bg-glass flex items-center justify-center overflow-hidden">
                {media ? (
                  <img
                    src={media}
                    alt="IG"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={32} className="text-muted" />
                )}
              </div>
              <div className="p-3 flex-col gap-2">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full border border-secondary" />
                  <div className="w-6 h-6 rounded-full border border-secondary" />
                  <div className="w-6 h-6 rounded-full border border-secondary" />
                </div>
                <p className="text-sm">
                  <span className="font-medium mr-2">{userName}</span>
                  {igCaption || "Your caption will appear here..."}
                </p>
              </div>
            </div>
          )}

          {/* Facebook Preview */}
          {platforms.includes("facebook") && (
            <div
              className="glass-card overflow-hidden"
              style={{ width: 320, margin: "0 auto" }}
            >
              <div className="p-3 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-glass flex items-center justify-center text-xs">
                  {userName[0]}
                </div>
                <div className="flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-secondary">Just now • 🌍</span>
                </div>
              </div>
              <div className="px-3 pb-2">
                <p className="text-sm">
                  {fbCaption || "Your caption will appear here..."}
                </p>
              </div>

              {media2 ? (
                <div className="flex w-full h-48 gap-1">
                  <div className="flex-1 bg-glass overflow-hidden">
                    <img
                      src={media}
                      alt="FB1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 bg-glass overflow-hidden relative">
                    <img
                      src={media2}
                      alt="FB2"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-glass flex items-center justify-center overflow-hidden">
                  {media ? (
                    <img
                      src={media}
                      alt="FB"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={32} className="text-muted" />
                  )}
                </div>
              )}

              <div className="p-3 flex justify-between border-t border-glass mt-2">
                <span className="text-xs text-secondary">👍 Like</span>
                <span className="text-xs text-secondary">💬 Comment</span>
                <span className="text-xs text-secondary">↗ Share</span>
              </div>
            </div>
          )}

          {/* TikTok Preview */}
          {platforms.includes("tiktok") && (
            <div
              className="glass-card overflow-hidden relative"
              style={{ width: 280, height: 500, margin: "0 auto" }}
            >
              <div className="absolute inset-0 bg-glass flex items-center justify-center">
                {media ? (
                  <img
                    src={media}
                    alt="TT"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video size={32} className="text-muted" />
                )}
              </div>

              {!media && (
                <div className="absolute top-4 left-4 right-4 bg-accent-amber/20 border border-accent-amber text-accent-amber text-xs p-2 rounded-lg backdrop-blur">
                  TikTok requires a video.
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex-col gap-2">
                <span className="text-sm font-bold text-white">
                  @{userName.toLowerCase().replace(/\s/g, "")}
                </span>
                <p className="text-xs text-white line-clamp-2">
                  {ttCaption || "Your caption will appear here..."}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                  <span className="text-xs text-white/80">
                    Original Audio - {userName}
                  </span>
                </div>
              </div>

              <div className="absolute right-2 bottom-20 flex-col gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30" />
                <div className="flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur" />
                  <span className="text-[10px] text-white">1.2K</span>
                </div>
                <div className="flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur" />
                  <span className="text-[10px] text-white">124</span>
                </div>
              </div>
            </div>
          )}

          {platforms.length === 0 && (
            <div className="text-center text-secondary mt-20 flex-col items-center gap-4">
              <Sparkles size={48} className="text-muted opacity-50" />
              <p>Select a platform to see live previews.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
