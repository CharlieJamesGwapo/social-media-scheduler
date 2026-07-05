export type Platform = "twitter" | "facebook" | "instagram";

export type PostStatus = "draft" | "scheduled" | "posted" | "failed";

export interface Post {
  id: string;
  text: string;
  mediaUrls: string[];
  platforms: Platform[];
  scheduledFor: string | null;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Draft {
  id: string;
  text: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  text: string;
  mediaUrls: string[];
}

export interface Analytics {
  date: string;
  platformPostCounts: Record<Platform, number>;
  engagementEstimates: Record<Platform, number>;
}

export interface Settings {
  theme: "light" | "dark";
  defaultPlatforms: Platform[];
}

export const CHARACTER_LIMITS: Record<Platform, number> = {
  twitter: 280,
  facebook: 63206,
  instagram: 2200,
};
