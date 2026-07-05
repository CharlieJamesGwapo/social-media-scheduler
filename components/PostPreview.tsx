"use client";

import { Platform } from "@/lib/types";
import { utils } from "@/lib/utils";

interface PostPreviewProps {
  text: string;
  mediaUrls: string[];
  platforms: Platform[];
}

export default function PostPreview({
  text,
  mediaUrls,
  platforms,
}: PostPreviewProps) {
  if (platforms.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg text-center text-slate-600 dark:text-slate-400">
        Select platforms to preview your post
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {platforms.map((platform) => (
        <div
          key={platform}
          className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="text-lg">
              {platform === "twitter"
                ? "🐦"
                : platform === "facebook"
                  ? "f"
                  : "📷"}
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {platform === "twitter"
                ? "X (Twitter)"
                : platform === "facebook"
                  ? "Facebook"
                  : "Instagram"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500 ml-auto">
              {text.length}/{utils.getCharacterLimit(platform)} chars
            </span>
          </div>

          <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3">
            {text || "(Empty post)"}
          </div>

          {mediaUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {mediaUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded bg-slate-200 dark:bg-slate-800 overflow-hidden"
                >
                  {utils.getMediaType(url) === "image" ? (
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">🎥</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
