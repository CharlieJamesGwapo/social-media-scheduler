"use client";

import { useEffect, useState } from "react";
import { Platform, Settings } from "@/lib/types";
import { storage } from "@/lib/storage";
import { utils } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    defaultPlatforms: ["twitter"],
  });
  const [storageInfo, setStorageInfo] = useState({ used: 0, limit: 5 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentSettings = storage.getSettings();
    setSettings(currentSettings);

    // Calculate storage usage
    const used = utils.getStorageSize();
    setStorageInfo({ used, limit: 5 });
  }, []);

  const handlePlatformToggle = (platform: Platform) => {
    setSettings((prev) => ({
      ...prev,
      defaultPlatforms: prev.defaultPlatforms.includes(platform)
        ? prev.defaultPlatforms.filter((p) => p !== platform)
        : [...prev.defaultPlatforms, platform],
    }));
  };

  const handleSaveSettings = () => {
    if (settings.defaultPlatforms.length === 0) {
      alert("Please select at least one default platform");
      return;
    }

    storage.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Are you sure? This will delete ALL posts, drafts, templates, and settings. This cannot be undone."
      )
    ) {
      localStorage.clear();
      alert("All data has been cleared");
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      posts: storage.getPosts(),
      drafts: storage.getDrafts(),
      templates: storage.getTemplates(),
      settings: storage.getSettings(),
      exportDate: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `social-scheduler-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Settings
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Manage your preferences and account settings
      </p>

      {saved && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Default Platforms */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Default Platforms
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Select which platforms should be pre-selected when creating new posts
        </p>

        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { id: "twitter", name: "X (Twitter)", icon: "🐦" },
              { id: "facebook", name: "Facebook", icon: "f" },
              { id: "instagram", name: "Instagram", icon: "📷" },
            ] as const
          ).map((platform) => (
            <button
              key={platform.id}
              onClick={() =>
                handlePlatformToggle(platform.id as Platform)
              }
              className={`p-4 rounded-lg border-2 transition-colors text-center ${
                settings.defaultPlatforms.includes(platform.id as Platform)
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-500"
              }`}
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {platform.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Storage Information */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Storage Usage
        </h2>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Local Storage
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {storageInfo.used.toFixed(2)} MB / {storageInfo.limit} MB
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                (storageInfo.used / storageInfo.limit) * 100 > 80
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  (storageInfo.used / storageInfo.limit) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Media files (images and videos) take up most of the space. Consider
          removing old posts or reducing media quality if you're running low on
          storage.
        </p>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Data Management
        </h2>

        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium"
          >
            📥 Export All Data
          </button>

          <button
            onClick={handleClearAllData}
            className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
          >
            🗑️ Delete All Data
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          ⚠️ Deleting all data cannot be undone. Consider exporting your data
          first if you want to keep a backup.
        </p>
      </div>

      {/* Save Settings Button */}
      <div className="flex space-x-3">
        <button
          onClick={handleSaveSettings}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}
