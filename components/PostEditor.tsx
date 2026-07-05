"use client";

import { Platform } from "@/lib/types";
import { utils } from "@/lib/utils";

interface PostEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  selectedPlatform?: Platform;
}

export default function PostEditor({
  text,
  onTextChange,
  selectedPlatform = "twitter",
}: PostEditorProps) {
  const charLimit = utils.getCharacterLimit(selectedPlatform);
  const remaining = utils.getRemainingCharacters(text, selectedPlatform);
  const percentage = utils.getCharacterPercentage(text, selectedPlatform);
  const isWarning = remaining < 50 && remaining >= 0;
  const isError = remaining < 0;

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-colors ${
                isError
                  ? "bg-red-500"
                  : isWarning
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <span
          className={`ml-3 text-sm font-medium ${
            isError
              ? "text-red-600 dark:text-red-400"
              : isWarning
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {remaining}/{charLimit}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-full">
          Platform: {selectedPlatform}
        </h4>
      </div>
    </div>
  );
}
