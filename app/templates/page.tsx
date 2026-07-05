"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Template } from "@/lib/types";
import { storage } from "@/lib/storage";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const allTemplates = storage.getTemplates();
    setTemplates(allTemplates);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      storage.deleteTemplate(id);
      loadTemplates();
    }
  };

  const handleUseTemplate = (template: Template) => {
    sessionStorage.setItem("templateToUse", JSON.stringify(template));
    window.location.href = "/create";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Templates
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Your saved post templates for quick reuse
      </p>

      {templates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No templates yet. Save your first template from the create page
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
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {template.name}
              </h3>

              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-3">
                {template.text}
              </p>

              {template.mediaUrls.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  📎 {template.mediaUrls.length} file(s)
                </p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                >
                  Use
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
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
