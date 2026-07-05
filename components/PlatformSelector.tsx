"use client";

import { Platform } from "@/lib/types";

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformToggle: (platform: Platform) => void;
}

const PLATFORMS = [
  { id: "twitter", name: "X (Twitter)", icon: "🐦", color: "bg-blue-500" },
  { id: "facebook", name: "Facebook", icon: "f", color: "bg-blue-600" },
  { id: "instagram", name: "Instagram", icon: "📷", color: "bg-pink-500" },
] as const;

export default function PlatformSelector({
  selectedPlatforms,
  onPlatformToggle,
}: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        Platforms
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onPlatformToggle(platform.id as Platform)}
            className={`p-3 rounded-lg border-2 transition-colors font-medium text-sm ${
              selectedPlatforms.includes(platform.id as Platform)
                ? `border-${platform.color} bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100`
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500"
            }`}
          >
            <div className="text-lg mb-1">{platform.icon}</div>
            <div className="text-xs">{platform.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
