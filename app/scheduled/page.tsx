"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Platform, Post } from "@/lib/types";
import { storage } from "@/lib/storage";
import { utils } from "@/lib/utils";
import PostCard from "@/components/PostCard";
import PostEditor from "@/components/PostEditor";
import PlatformSelector from "@/components/PlatformSelector";
import DateTimePicker from "@/components/DateTimePicker";

export default function ScheduledPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editPlatforms, setEditPlatforms] = useState<Platform[]>([]);
  const [editScheduledFor, setEditScheduledFor] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const scheduledPosts = storage
      .getPosts()
      .filter((p) => p.status === "scheduled");
    setPosts(scheduledPosts);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      storage.deletePost(id);
      loadPosts();
    }
  };

  const handleEditPost = (id: string) => {
    const post = storage.getPostById(id);
    if (post) {
      setEditingId(id);
      setEditText(post.text);
      setEditPlatforms(post.platforms);
      setEditScheduledFor(post.scheduledFor);
    }
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || editPlatforms.length === 0) {
      alert("Please add text and select at least one platform");
      return;
    }

    if (!editScheduledFor) {
      alert("Please select a date and time");
      return;
    }

    if (editingId) {
      storage.updatePost(editingId, {
        text: editText,
        platforms: editPlatforms,
        scheduledFor: editScheduledFor,
      });
      setEditingId(null);
      loadPosts();
      alert("Post updated successfully!");
    }
  };

  const handlePublishPost = (id: string) => {
    if (confirm("Mark this post as published?")) {
      storage.updatePost(id, { status: "posted" });
      loadPosts();
    }
  };

  const handlePlatformToggle = (platform: Platform) => {
    setEditPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Scheduled Posts
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Manage your scheduled social media posts
      </p>

      {editingId && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Edit Post
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <PostEditor
                text={editText}
                onTextChange={setEditText}
                selectedPlatform={editPlatforms[0] || "twitter"}
              />
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                <PlatformSelector
                  selectedPlatforms={editPlatforms}
                  onPlatformToggle={handlePlatformToggle}
                />
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                <DateTimePicker
                  scheduledFor={editScheduledFor}
                  onScheduleChange={setEditScheduledFor}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No scheduled posts yet
          </p>
          <a
            href="/create"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Post
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {posts
            .sort(
              (a, b) =>
                new Date(a.scheduledFor!).getTime() -
                new Date(b.scheduledFor!).getTime()
            )
            .map((post) => (
              <div
                key={post.id}
                className="flex items-start space-x-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <PostCard post={post} showActions={false} />
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePublishPost(post.id)}
                    className="px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors whitespace-nowrap"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
