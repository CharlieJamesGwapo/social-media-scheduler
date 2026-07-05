import { Post, Draft, Template, Settings, Platform } from "./types";

const STORAGE_KEYS = {
  POSTS: "social_posts",
  DRAFTS: "social_drafts",
  TEMPLATES: "social_templates",
  SETTINGS: "social_settings",
};

export const storage = {
  // Posts
  getPosts: (): Post[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  },

  addPost: (post: Post): void => {
    const posts = storage.getPosts();
    posts.push(post);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  updatePost: (id: string, updates: Partial<Post>): void => {
    const posts = storage.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }
  },

  deletePost: (id: string): void => {
    const posts = storage.getPosts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  getPostById: (id: string): Post | undefined => {
    return storage.getPosts().find((p) => p.id === id);
  },

  // Drafts
  getDrafts: (): Draft[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return data ? JSON.parse(data) : [];
  },

  addDraft: (draft: Draft): void => {
    const drafts = storage.getDrafts();
    drafts.push(draft);
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  },

  updateDraft: (id: string, updates: Partial<Draft>): void => {
    const drafts = storage.getDrafts();
    const index = drafts.findIndex((d) => d.id === id);
    if (index !== -1) {
      drafts[index] = { ...drafts[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
    }
  },

  deleteDraft: (id: string): void => {
    const drafts = storage.getDrafts().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  },

  getDraftById: (id: string): Draft | undefined => {
    return storage.getDrafts().find((d) => d.id === id);
  },

  // Templates
  getTemplates: (): Template[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : [];
  },

  addTemplate: (template: Template): void => {
    const templates = storage.getTemplates();
    templates.push(template);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  updateTemplate: (id: string, updates: Partial<Template>): void => {
    const templates = storage.getTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    }
  },

  deleteTemplate: (id: string): void => {
    const templates = storage.getTemplates().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  getTemplateById: (id: string): Template | undefined => {
    return storage.getTemplates().find((t) => t.id === id);
  },

  // Settings
  getSettings: (): Settings => {
    if (typeof window === "undefined") {
      return { theme: "light", defaultPlatforms: ["twitter"] };
    }
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : { theme: "light", defaultPlatforms: ["twitter"] };
  },

  updateSettings: (settings: Partial<Settings>): void => {
    const current = storage.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  },

  // Utilities
  getUpcomingPosts: (): Post[] => {
    const posts = storage.getPosts();
    const now = new Date();
    return posts
      .filter((p) => p.status === "scheduled" && p.scheduledFor)
      .filter((p) => new Date(p.scheduledFor!) > now)
      .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime());
  },

  getPostedPosts: (): Post[] => {
    return storage.getPosts().filter((p) => p.status === "posted");
  },

  getPastPosts: (): Post[] => {
    const posts = storage.getPosts();
    const now = new Date();
    return posts
      .filter((p) => p.status === "scheduled" && p.scheduledFor)
      .filter((p) => new Date(p.scheduledFor!) <= now)
      .sort((a, b) => new Date(b.scheduledFor!).getTime() - new Date(a.scheduledFor!).getTime());
  },
};
