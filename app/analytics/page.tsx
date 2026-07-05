"use client";

import { useEffect, useState } from "react";
import { Post, Platform } from "@/lib/types";
import { storage } from "@/lib/storage";
import { utils } from "@/lib/utils";

interface AnalyticsData {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
  platformBreakdown: Record<Platform, number>;
  bestPostingTimes: Record<number, number>;
  averageReachPerPlatform: Record<Platform, number>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    failedPosts: 0,
    platformBreakdown: { twitter: 0, facebook: 0, instagram: 0 },
    bestPostingTimes: {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    },
    averageReachPerPlatform: { twitter: 0, facebook: 0, instagram: 0 },
  });

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const posts = storage.getPosts();
    const publishedPosts = posts.filter((p) => p.status === "posted");

    // Platform breakdown
    const platformBreakdown: Record<Platform, number> = {
      twitter: 0,
      facebook: 0,
      instagram: 0,
    };

    // Best posting times (day of week)
    const bestPostingTimes: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    };

    posts.forEach((post) => {
      post.platforms.forEach((platform) => {
        platformBreakdown[platform]++;
      });

      if (post.scheduledFor) {
        const dayOfWeek = new Date(post.scheduledFor).getDay();
        bestPostingTimes[dayOfWeek]++;
      }
    });

    // Calculate average reach
    const averageReachPerPlatform: Record<Platform, number> = {
      twitter: 0,
      facebook: 0,
      instagram: 0,
    };

    const platformCounts: Record<Platform, number> = {
      twitter: 0,
      facebook: 0,
      instagram: 0,
    };

    publishedPosts.forEach((post) => {
      post.platforms.forEach((platform) => {
        const reach = utils.getEstimatedReach(platform);
        averageReachPerPlatform[platform] += reach;
        platformCounts[platform]++;
      });
    });

    Object.keys(averageReachPerPlatform).forEach((platform) => {
      const p = platform as Platform;
      if (platformCounts[p] > 0) {
        averageReachPerPlatform[p] = Math.round(
          averageReachPerPlatform[p] / platformCounts[p]
        );
      }
    });

    setAnalytics({
      totalPosts: posts.length,
      scheduledPosts: posts.filter((p) => p.status === "scheduled").length,
      publishedPosts: publishedPosts.length,
      failedPosts: posts.filter((p) => p.status === "failed").length,
      platformBreakdown,
      bestPostingTimes,
      averageReachPerPlatform,
    });
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxPostings = Math.max(...Object.values(analytics.bestPostingTimes), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Analytics
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Publishing statistics and insights
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Total Posts
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {analytics.totalPosts}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Published
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {analytics.publishedPosts}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Scheduled
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {analytics.scheduledPosts}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Failed
          </p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {analytics.failedPosts}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Posts by Platform
          </h2>

          <div className="space-y-4">
            {(
              [
                { name: "X (Twitter)", key: "twitter" },
                { name: "Facebook", key: "facebook" },
                { name: "Instagram", key: "instagram" },
              ] as const
            ).map((platform) => (
              <div key={platform.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {platform.name}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {analytics.platformBreakdown[platform.key]}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${
                        analytics.totalPosts > 0
                          ? (
                              (analytics.platformBreakdown[platform.key] /
                                analytics.totalPosts) *
                              100
                            ).toFixed(0)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Reach by Platform */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Estimated Average Reach
          </h2>

          <div className="space-y-3">
            {(
              [
                { name: "X (Twitter)", key: "twitter" },
                { name: "Facebook", key: "facebook" },
                { name: "Instagram", key: "instagram" },
              ] as const
            ).map((platform) => (
              <div
                key={platform.key}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {platform.name}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {analytics.averageReachPerPlatform[platform.key]} reach
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Posting Times */}
      <div className="mt-6 bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Posts Scheduled by Day of Week
        </h2>

        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, idx) => (
            <div key={day} className="text-center">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {day}
              </div>
              <div className="relative h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-end justify-center p-2">
                {analytics.bestPostingTimes[idx] > 0 && (
                  <>
                    <div
                      className="w-full bg-blue-500 rounded transition-all"
                      style={{
                        height: `${
                          (analytics.bestPostingTimes[idx] / maxPostings) * 100
                        }%`,
                      }}
                    />
                    <span className="absolute bottom-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {analytics.bestPostingTimes[idx]}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            💡 <strong>Tip:</strong> Schedule your posts for days with higher
            engagement for better reach and visibility.
          </p>
        </div>
      </div>
    </div>
  );
}
