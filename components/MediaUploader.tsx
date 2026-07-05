"use client";

import { useRef, useState } from "react";
import { utils } from "@/lib/utils";

interface MediaUploaderProps {
  onMediaAdd: (dataURI: string) => void;
  mediaUrls: string[];
  onMediaRemove: (index: number) => void;
}

export default function MediaUploader({
  onMediaAdd,
  mediaUrls,
  onMediaRemove,
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (let i = 0; i < Math.min(files.length, 4 - mediaUrls.length); i++) {
        const file = files[i];
        const dataURI = await utils.convertToDataURI(file);
        onMediaAdd(dataURI);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />

        <svg
          className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-10-12l-3.172-3.172a2 2 0 00-2.828 0L28 8m0 0L16 20m12-12v12m4 8a4 4 0 11-8 0 4 4 0 018 0z"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          {uploading ? "Uploading..." : "Drag & drop media or click to select"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          PNG, JPG, GIF, WebP or MP4 (Max 4 files, 5MB each)
        </p>
      </div>

      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mediaUrls.map((url, index) => {
            const mediaType = utils.getMediaType(url);
            return (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {mediaType === "image" ? (
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 2v4m4-4v4m4-4v4" />
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onMediaRemove(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
