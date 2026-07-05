"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types";
import { storage } from "@/lib/storage";
import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const scheduledPosts = storage.getPosts().filter((p) => p.status === "scheduled");
    setPosts(scheduledPosts);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      storage.deletePost(id);
      loadPosts();
    }
  };

  const handleEditPost = (id: string) => {
    router.push(`/scheduled?edit=${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Calendar
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        View your scheduled posts on a calendar
      </p>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <CalendarView
          posts={posts}
          onPostDelete={handleDeletePost}
          onPostEdit={handleEditPost}
        />
      </div>
    </div>
  );
}
