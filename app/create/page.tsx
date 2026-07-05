"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Platform, Post } from "@/lib/types";
import { storage } from "@/lib/storage";
import { utils } from "@/lib/utils";
import PostEditor from "@/components/PostEditor";
import MediaUploader from "@/components/MediaUploader";
import PlatformSelector from "@/components/PlatformSelector";
import DateTimePicker from "@/components/DateTimePicker";
import PostPreview from "@/components/PostPreview";
import HashtagSuggestions from "@/components/HashtagSuggestions";

export default function CreatePostPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>(["twitter"]);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const handlePlatformToggle = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleAddHashtag = (hashtag: string) => {
    if (!text.includes(hashtag)) {
      setText((prev) => (prev ? prev + " " + hashtag : hashtag));
    }
  };

  const handleAddMedia = (dataURI: string) => {
    if (mediaUrls.length < 4) {
      setMediaUrls((prev) => [...prev, dataURI]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSchedulePost = () => {
    if (!text.trim() || platforms.length === 0) {
      alert("Please add text and select at least one platform");
      return;
    }

    if (!scheduledFor) {
      alert("Please select a date and time to schedule the post");
      return;
    }

    const newPost: Post = {
      id: utils.generateId(),
      text,
      mediaUrls,
      platforms,
      scheduledFor,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addPost(newPost);
    alert("Post scheduled successfully!");
    router.push("/scheduled");
  };

  const handleSaveDraft = () => {
    if (!text.trim()) {
      alert("Please add some text to save as draft");
      return;
    }

    const newDraft = {
      id: utils.generateId(),
      text,
      mediaUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addDraft(newDraft);
    alert("Draft saved successfully!");
    setText("");
    setMediaUrls([]);
  };

  const handleSaveTemplate = () => {
    if (!text.trim() || !templateName.trim()) {
      alert("Please add text and a template name");
      return;
    }

    const newTemplate = {
      id: utils.generateId(),
      name: templateName,
      text,
      mediaUrls,
    };

    storage.addTemplate(newTemplate);
    alert("Template saved successfully!");
    setShowTemplateModal(false);
    setTemplateName("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Create Post
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Draft, schedule, or publish your social media posts
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "editor"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Preview
            </button>
          </div>

          {activeTab === "editor" ? (
            <>
              {/* Text Editor */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Post Content
                </h2>
                <PostEditor
                  text={text}
                  onTextChange={setText}
                  selectedPlatform={platforms[0] || "twitter"}
                />
              </div>

              {/* Media Uploader */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Media
                </h2>
                <MediaUploader
                  mediaUrls={mediaUrls}
                  onMediaAdd={handleAddMedia}
                  onMediaRemove={handleRemoveMedia}
                />
              </div>

              {/* Hashtag Suggestions */}
              {text && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                  <HashtagSuggestions
                    text={text}
                    onHashtagAdd={handleAddHashtag}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Post Preview
              </h2>
              <PostPreview
                text={text}
                mediaUrls={mediaUrls}
                platforms={platforms}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Platform Selector */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <PlatformSelector
              selectedPlatforms={platforms}
              onPlatformToggle={handlePlatformToggle}
            />
          </div>

          {/* Schedule Date/Time */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <DateTimePicker
              scheduledFor={scheduledFor}
              onScheduleChange={setScheduledFor}
            />
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
            <button
              onClick={handleSchedulePost}
              disabled={!text.trim() || platforms.length === 0 || !scheduledFor}
              className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              📅 Schedule Post
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={!text.trim()}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
            >
              💾 Save Draft
            </button>

            <button
              onClick={() => setShowTemplateModal(true)}
              disabled={!text.trim()}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
            >
              ⭐ Save as Template
            </button>

            <button
              onClick={() => {
                setText("");
                setMediaUrls([]);
                setScheduledFor(null);
                setPlatforms(["twitter"]);
              }}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Save as Template
            </h2>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name (e.g., Weekly Update)"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
