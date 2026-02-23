import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Instagram,
  Facebook,
  Video,
  Filter,
  BarChart2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { getStorageItem, Post } from "../utils/storage";

export const PublishedScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    setPosts(
      getStorageItem<Post[]>("kast_posts", []).filter(
        (p) => p.status === "published",
      ),
    );
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (filterPlatform !== "all" && !p.platforms.includes(filterPlatform))
      return false;
    if (filterType !== "all" && p.media_type !== filterType) return false;
    return true;
  });

  if (posts.length === 0) {
    return (
      <div className="flex-col items-center justify-center h-full text-center gap-6">
        <div className="w-32 h-32 rounded-full bg-glass border-glass flex items-center justify-center mb-4">
          <CheckSquare size={48} className="text-primary-color opacity-50" />
        </div>
        <h2 className="text-3xl font-bold">No posts yet.</h2>
        <p className="text-secondary max-w-md">
          Your published posts will live here. Ready to make your first KAST?
        </p>
        <button className="btn btn-primary mt-4">Create a post →</button>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Published</h2>

        <div className="flex gap-4">
          <div className="glass-panel p-1 flex gap-1 items-center">
            <Filter size={16} className="text-secondary ml-2 mr-1" />
            {["all", "instagram", "facebook", "tiktok"].map((p) => (
              <button
                key={p}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterPlatform === p ? "bg-primary text-white" : "text-secondary hover:text-primary"}`}
                onClick={() => setFilterPlatform(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="glass-panel p-1 flex gap-1">
            {["all", "photo", "video", "mixed"].map((t) => (
              <button
                key={t}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterType === t ? "bg-primary text-white" : "text-secondary hover:text-primary"}`}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-col gap-3 overflow-y-auto pb-20">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedPost(post)}
          >
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

            <div className="flex-1 flex-col gap-1">
              <p className="text-sm line-clamp-1">{post.caption_main}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-secondary font-mono">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-1">
                  {post.platforms.includes("instagram") && (
                    <Instagram size={14} color="var(--ig-color)" />
                  )}
                  {post.platforms.includes("facebook") && (
                    <Facebook size={14} color="var(--fb-color)" />
                  )}
                  {post.platforms.includes("tiktok") && (
                    <Video size={14} color="#FFF" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex-col items-end gap-2 min-w-[120px]">
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-accent-teal">
                  {post.analytics.reach.toLocaleString()}
                </span>
                <span className="text-xs text-secondary">Reach</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-teal/20 text-accent-teal border border-accent-teal/30">
                Posted
              </span>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center text-secondary py-12">
            No posts match these filters.
          </div>
        )}
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-[400px] h-full bg-bg-elevated border-l border-glass p-6 flex-col gap-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation:
                "slideInRight 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Post Insights</h3>
              <button
                className="btn-icon"
                onClick={() => setSelectedPost(null)}
              >
                ×
              </button>
            </div>

            <div className="glass-card p-4 flex-col gap-4">
              <div className="w-full h-48 rounded-lg bg-glass overflow-hidden">
                {selectedPost.media_url && (
                  <img
                    src={selectedPost.media_url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-sm">{selectedPost.caption_main}</p>
              <div className="flex gap-2">
                {selectedPost.platforms.includes("instagram") && (
                  <Instagram size={16} color="var(--ig-color)" />
                )}
                {selectedPost.platforms.includes("facebook") && (
                  <Facebook size={16} color="var(--fb-color)" />
                )}
                {selectedPost.platforms.includes("tiktok") && (
                  <Video size={16} color="#FFF" />
                )}
              </div>
            </div>

            <div className="flex-col gap-4">
              <h4 className="text-sm font-medium text-secondary">
                Performance Breakdown
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-4 flex-col gap-1">
                  <span className="text-xs text-secondary">Total Reach</span>
                  <span className="text-2xl font-mono font-bold text-accent-teal">
                    {selectedPost.analytics.reach.toLocaleString()}
                  </span>
                </div>
                <div className="glass-panel p-4 flex-col gap-1">
                  <span className="text-xs text-secondary">
                    Engagement Rate
                  </span>
                  <span className="text-2xl font-mono font-bold text-primary-color">
                    {selectedPost.analytics.engagement_rate}%
                  </span>
                </div>
                <div className="glass-panel p-4 flex-col gap-1">
                  <span className="text-xs text-secondary">Likes</span>
                  <span className="text-xl font-mono font-bold">
                    {selectedPost.analytics.likes}
                  </span>
                </div>
                <div className="glass-panel p-4 flex-col gap-1">
                  <span className="text-xs text-secondary">Comments</span>
                  <span className="text-xl font-mono font-bold">
                    {selectedPost.analytics.comments}
                  </span>
                </div>
              </div>

              <div className="glass-panel p-4 flex-col gap-3 border-primary/30">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-primary-color" />
                  <span className="text-sm font-medium">How it compares</span>
                </div>
                <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "75%" }} />
                </div>
                <span className="text-xs text-secondary">
                  Performing 24% better than your average post.
                </span>
              </div>

              <div className="glass-panel p-4 flex-col gap-2 border-accent-teal/30 bg-accent-teal/5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent-teal" />
                  <span className="text-sm font-medium text-accent-teal">
                    Why it worked
                  </span>
                </div>
                <span className="text-xs text-primary">
                  Strong hook and posted at peak time.
                </span>
              </div>
            </div>

            <button className="btn btn-primary w-full mt-auto py-3">
              <RefreshCw size={16} /> Repost this
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
