"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import { storage } from "@/lib/storage";
import { utils } from "@/lib/utils";
import PostCard from "@/components/PostCard";

export default function Dashboard() {
  const [upcomingPosts, setUpcomingPosts] = useState<Post[]>([]);
  const [postedPosts, setPostedPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const upcoming = storage.getUpcomingPosts().slice(0, 5);
    const posted = storage.getPostedPosts().slice(0, 5);
    const total = storage.getPosts().length;

    setUpcomingPosts(upcoming);
    setPostedPosts(posted);
    setTotalPosts(total);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's an overview of your social media posts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Total Posts
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {totalPosts}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Scheduled
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {storage.getPosts().filter((p) => p.status === "scheduled").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Published
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {storage.getPostedPosts().length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Drafts
          </p>
          <p className="text-3xl font-bold text-slate-600 dark:text-slate-400 mt-2">
            {storage.getDrafts().length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Posts */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Upcoming Posts
            </h2>
            <Link
              href="/scheduled"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>

          {upcomingPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No upcoming posts scheduled
              </p>
              <Link
                href="/create"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/create"
              className="block w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              + New Post
            </Link>
            <Link
              href="/calendar"
              className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
            >
              📅 Calendar
            </Link>
            <Link
              href="/drafts"
              className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
            >
              📝 Drafts
            </Link>
            <Link
              href="/templates"
              className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
            >
              ⭐ Templates
            </Link>
            <Link
              href="/analytics"
              className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
            >
              📊 Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      {postedPosts.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Recently Published
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postedPosts.map((post) => (
              <PostCard key={post.id} post={post} showActions={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
