export interface Post {
  id: string;
  caption_main: string;
  caption_instagram: string;
  caption_facebook: string;
  caption_tiktok: string;
  platforms: string[];
  media_type: "photo" | "video" | "mixed" | "none";
  media_url?: string;
  media_url_2?: string;
  scheduled_time: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  created_at: string;
  analytics: {
    reach: number;
    engagement_rate: number;
    likes: number;
    comments: number;
  };
}

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const generateMockAnalytics = (businessType: string) => {
  const baseMultiplier = businessType === "Retail / Products" ? 1.5 : 1;
  return {
    reach: Math.floor((Math.random() * 2000 + 500) * baseMultiplier),
    engagement_rate: Number((Math.random() * 5 + 1).toFixed(1)),
    likes: Math.floor(Math.random() * 200 + 20),
    comments: Math.floor(Math.random() * 20 + 2),
  };
};

export const seedMockPosts = (businessType: string): Post[] => {
  const posts: Post[] = [];
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    posts.push({
      id: `mock-${i}`,
      caption_main: `This is a mock post #${i} for ${businessType}.`,
      caption_instagram: `This is a mock post #${i} for ${businessType}. #mock #data`,
      caption_facebook: `This is a mock post #${i} for ${businessType}. What do you think?`,
      caption_tiktok: `Mock post #${i} hook!`,
      platforms: ["instagram", "facebook", "tiktok"],
      media_type: "photo",
      media_url: "https://picsum.photos/seed/mock/400/400",
      scheduled_time: null,
      status: "published",
      created_at: date.toISOString(),
      analytics: generateMockAnalytics(businessType),
    });
  }
  return posts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
};
