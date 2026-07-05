"use client";

import Link from "next/link";
import { Post } from "@/lib/types";
import { utils } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  showActions?: boolean;
}

const STATUS_COLORS = {
  draft: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
  scheduled: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  posted: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  failed: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
};

export default function PostCard({
  post,
  onDelete,
  onEdit,
  showActions = true,
}: PostCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {post.platforms.map((platform) => (
              <span
                key={platform}
                className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
              >
                {platform === "twitter" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </span>
            ))}
            <span
              className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                STATUS_COLORS[post.status]
              }`}
            >
              {post.status}
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-3">
        {post.text}
      </p>

      {post.mediaUrls.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            📎 {post.mediaUrls.length} file(s)
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
        {post.scheduledFor ? (
          <span>
            📅 {utils.formatDateTime(post.scheduledFor)}
            {utils.isSoon(post.scheduledFor) && (
              <span className="ml-2 text-yellow-600 dark:text-yellow-400">Soon!</span>
            )}
          </span>
        ) : (
          <span>Created {utils.getRelativeTime(post.createdAt)}</span>
        )}
      </div>

      {showActions && (post.status === "scheduled" || post.status === "draft") && (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(post.id)}
              className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="flex-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
