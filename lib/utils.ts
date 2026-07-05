import { Platform, CHARACTER_LIMITS } from "./types";

const COMMON_HASHTAGS = [
  "#socialmedia",
  "#marketing",
  "#business",
  "#content",
  "#digital",
  "#online",
  "#social",
  "#media",
  "#brand",
  "#engagement",
  "#growth",
  "#strategy",
  "#trending",
  "#viral",
  "#creative",
  "#design",
  "#photography",
  "#videography",
  "#inspiration",
  "#success",
];

export const utils = {
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  formatDate: (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  formatTime: (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatDateTime: (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  getCharacterLimit: (platform: Platform): number => {
    return CHARACTER_LIMITS[platform];
  },

  getRemainingCharacters: (text: string, platform: Platform): number => {
    return CHARACTER_LIMITS[platform] - text.length;
  },

  getCharacterPercentage: (text: string, platform: Platform): number => {
    const limit = CHARACTER_LIMITS[platform];
    return Math.round((text.length / limit) * 100);
  },

  getHashtagSuggestions: (text: string, limit: number = 5): string[] => {
    const words = text.toLowerCase().split(/\s+/);
    const suggestions = COMMON_HASHTAGS.filter(
      (tag) =>
        !text.toLowerCase().includes(tag) &&
        words.some((word) => tag.includes(word) || word.includes(tag.replace("#", "")))
    );
    return suggestions.slice(0, Math.max(limit, 3)).length > 0
      ? suggestions.slice(0, limit)
      : COMMON_HASHTAGS.slice(0, limit);
  },

  getEstimatedReach: (platform: Platform): number => {
    const baseReach: Record<Platform, number> = {
      twitter: Math.floor(Math.random() * 1000) + 500,
      facebook: Math.floor(Math.random() * 5000) + 2000,
      instagram: Math.floor(Math.random() * 3000) + 1000,
    };
    return baseReach[platform];
  },

  getBestPostingTime: (dayOfWeek: number): string => {
    const times: Record<number, string> = {
      0: "10:00 AM (Sunday)",
      1: "9:00 AM (Monday)",
      2: "10:00 AM (Tuesday)",
      3: "2:00 PM (Wednesday)",
      4: "10:00 AM (Thursday)",
      5: "3:00 PM (Friday)",
      6: "8:00 PM (Saturday)",
    };
    return times[dayOfWeek] || "10:00 AM";
  },

  convertToDataURI: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  getMediaType: (dataURI: string): "image" | "video" | "unknown" => {
    if (dataURI.includes("image")) return "image";
    if (dataURI.includes("video")) return "video";
    return "unknown";
  },

  getStorageSize: (): number => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return Math.round((total / 1024 / 1024) * 100) / 100;
  },

  formatBytes: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  },

  isPastDate: (dateString: string): boolean => {
    return new Date(dateString) < new Date();
  },

  isSoon: (dateString: string, hours: number = 24): boolean => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = date.getTime() - now.getTime();
    return diff > 0 && diff < hours * 60 * 60 * 1000;
  },

  getRelativeTime: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  },
};
