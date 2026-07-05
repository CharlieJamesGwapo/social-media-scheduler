"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import PostCard from "./PostCard";

interface CalendarViewProps {
  posts: Post[];
  onPostDelete?: (id: string) => void;
  onPostEdit?: (id: string) => void;
}

export default function CalendarView({
  posts,
  onPostDelete,
  onPostEdit,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPostsForDate = (date: Date): Post[] => {
    return posts.filter((post) => {
      if (!post.scheduledFor) return false;
      const postDate = new Date(post.scheduledFor);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {monthName}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            ← Prev
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 text-xs"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 p-px">
          {days.map((day, idx) => {
            const dayPosts = day ? getPostsForDate(day) : [];
            const isToday =
              day &&
              day.toDateString() === new Date().toDateString();

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 text-xs ${
                  day
                    ? isToday
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "bg-white dark:bg-slate-900"
                    : "bg-slate-50 dark:bg-slate-800"
                }`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {day.getDate()}
                    </div>
                    {dayPosts.length > 0 && (
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-1 py-0.5 rounded truncate"
                          >
                            {post.platforms[0]}
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{dayPosts.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Posts for selected date */}
      <div className="mt-6">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Scheduled Posts
        </h3>
        {posts.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            No scheduled posts yet
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={onPostDelete}
                onEdit={onPostEdit}
                showActions
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
