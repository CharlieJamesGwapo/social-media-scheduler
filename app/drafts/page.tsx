"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Draft } from "@/lib/types";
import { storage } from "@/lib/storage";
import { utils } from "@/lib/utils";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    const allDrafts = storage
      .getDrafts()
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    setDrafts(allDrafts);
  };

  const handleDeleteDraft = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      storage.deleteDraft(id);
      loadDrafts();
    }
  };

  const handleEditDraft = (draft: Draft) => {
    // Set draft content in session storage and redirect to create page
    sessionStorage.setItem("draftToEdit", JSON.stringify(draft));
    window.location.href = "/create";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Drafts
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Your saved post drafts
      </p>

      {drafts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No drafts yet. Start by creating a new post
          </p>
          <Link
            href="/create"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-3">
                {draft.text}
              </p>

              {draft.mediaUrls.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  📎 {draft.mediaUrls.length} file(s)
                </p>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Updated {utils.getRelativeTime(draft.updatedAt)}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditDraft(draft)}
                  className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDraft(draft.id)}
                  className="flex-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
