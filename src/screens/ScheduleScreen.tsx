import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Edit2,
  Trash2,
  Instagram,
  Facebook,
  Video,
  Sparkles,
} from "lucide-react";
import { getStorageItem, setStorageItem, Post } from "../utils/storage";
import { useToast } from "../components/Toast";

export const ScheduleScreen: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    setPosts(getStorageItem<Post[]>("kast_posts", []));
  }, []);

  const scheduledPosts = posts.filter((p) => p.status === "scheduled");
  const businessType = getStorageItem<string>(
    "kast_business_type",
    "Retail / Products",
  );

  const handleDelete = (id: string) => {
    const newPosts = posts.filter((p) => p.id !== id);
    setStorageItem("kast_posts", newPosts);
    setPosts(newPosts);
    setSelectedPost(null);
    showToast("Post deleted", "info");
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const bestDays = businessType.includes("Retail") ? [2, 4] : [1, 3]; // Tue/Thu or Mon/Wed

  if (scheduledPosts.length === 0) {
    return (
      <div className="flex-col items-center justify-center h-full text-center gap-6">
        <div className="w-32 h-32 rounded-full bg-glass border-glass flex items-center justify-center mb-4">
          <CalendarIcon size={48} className="text-primary-color opacity-50" />
        </div>
        <h2 className="text-3xl font-bold">Nothing scheduled yet.</h2>
        <p className="text-secondary max-w-md">
          A clear calendar is an opportunity. Schedule your first KAST.
        </p>
        <button className="btn btn-primary mt-4">Create a post →</button>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <div className="flex gap-4">
          <div className="glass-panel p-1 flex gap-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === "week" ? "bg-primary text-white" : "text-secondary hover:text-primary"}`}
              onClick={() => setView("week")}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === "month" ? "bg-primary text-white" : "text-secondary hover:text-primary"}`}
              onClick={() => setView("month")}
            >
              Month
            </button>
          </div>
          <button className="btn btn-primary">New Post</button>
        </div>
      </div>

      <div className="glass-panel p-3 flex items-center gap-3 border-l-4 border-l-primary bg-primary/10">
        <Sparkles size={16} className="text-primary-color" />
        <span className="text-sm text-primary-color">
          📊 Based on your audience data, your best posting days this week are{" "}
          {days[bestDays[0]]} and {days[bestDays[1]]}. We have marked them
          below.
        </span>
      </div>

      <div className="glass-card flex-1 flex-col overflow-hidden">
        <div className="grid grid-cols-7 border-b border-glass">
          {days.map((day, i) => (
            <div
              key={day}
              className={`p-4 text-center border-r border-glass last:border-r-0 ${bestDays.includes(i) ? "bg-primary/5 shadow-[inset_0_2px_0_var(--primary)]" : ""}`}
            >
              <span
                className={`text-sm font-medium ${bestDays.includes(i) ? "text-primary-color" : "text-secondary"}`}
              >
                {day}
              </span>
              <div className="text-2xl font-bold mt-1">
                {new Date().getDate() + i}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 overflow-y-auto">
          {days.map((day, i) => (
            <div
              key={day}
              className={`p-2 border-r border-glass last:border-r-0 min-h-[400px] ${bestDays.includes(i) ? "bg-primary/5" : ""}`}
            >
              {scheduledPosts.map((post) => {
                const postDate = new Date(post.scheduled_time!);
                // Simple mock logic to place posts in columns
                if (postDate.getDay() === i) {
                  return (
                    <div
                      key={post.id}
                      className="glass-panel p-3 mb-2 cursor-pointer hover:border-primary transition-colors flex-col gap-2 relative group"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1">
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
                        <span className="text-[10px] font-mono text-secondary flex items-center gap-1">
                          <Clock size={10} />
                          {postDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex gap-2 items-start mt-1">
                        {post.media_url && (
                          <div className="w-8 h-8 rounded bg-glass overflow-hidden flex-shrink-0">
                            <img
                              src={post.media_url}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-xs text-secondary line-clamp-2 leading-tight">
                          {post.caption_main}
                        </p>
                      </div>

                      <div className="mt-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber border border-accent-amber/30">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div
            className="modal-content glass-card p-6 flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Scheduled Post</h3>
              <button
                className="btn-icon"
                onClick={() => setSelectedPost(null)}
              >
                <Trash2
                  size={20}
                  className="text-accent-rose"
                  onClick={() => handleDelete(selectedPost.id)}
                />
              </button>
            </div>

            <textarea
              className="input-field"
              value={selectedPost.caption_main}
              readOnly
              style={{ minHeight: 100 }}
            />

            <div className="flex gap-4">
              <div className="flex-1 flex-col gap-2">
                <label className="text-xs text-secondary">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={selectedPost.scheduled_time?.split("T")[0]}
                  readOnly
                />
              </div>
              <div className="flex-1 flex-col gap-2">
                <label className="text-xs text-secondary">Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={selectedPost.scheduled_time
                    ?.split("T")[1]
                    .substring(0, 5)}
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedPost(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedPost(null)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
