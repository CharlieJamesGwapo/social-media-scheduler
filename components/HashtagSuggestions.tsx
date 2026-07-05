"use client";

import { utils } from "@/lib/utils";

interface HashtagSuggestionsProps {
  text: string;
  onHashtagAdd: (hashtag: string) => void;
}

export default function HashtagSuggestions({
  text,
  onHashtagAdd,
}: HashtagSuggestionsProps) {
  const suggestions = utils.getHashtagSuggestions(text);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        Suggested Hashtags
      </h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((hashtag) => (
          <button
            key={hashtag}
            onClick={() => onHashtagAdd(hashtag)}
            className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {hashtag}
          </button>
        ))}
      </div>
    </div>
  );
}
