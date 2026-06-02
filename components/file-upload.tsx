"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileUpload, type FileUploadProps } from "@/hooks/use-file-upload";
import { FilePreviewCard } from "@/components/file-preview-card";

export { type FileUploadProps } from "@/hooks/use-file-upload";

export const FileUpload = ({
  value = [],
  onChange,
  onPendingChange,
}: FileUploadProps) => {
  const {
    pendingFiles,
    isDragging,
    inputRef,
    totalFiles,
    MAX_FILES,
    ACCEPTED_TYPES,
    removePending,
    removeCommitted,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
  } = useFileUpload({ value, onChange, onPendingChange });

  const dropZoneClass = cn(
    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
    isDragging
      ? "border-blue-400 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20"
      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
  );

  return (
    <div className="space-y-4">
      {/* Committed files (already uploaded) */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {value.map((file) => (
            <FilePreviewCard
              key={file.url}
              name={file.name}
              url={file.url}
              type={file.type}
              onRemove={() => removeCommitted(file.url)}
            />
          ))}
        </div>
      )}

      {/* Pending files (not yet uploaded) */}
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {pendingFiles.map((file) => (
            <FilePreviewCard
              key={file.id}
              name={file.file.name}
              url={file.preview}
              type={file.file.type.startsWith("image/") ? "IMAGE" : "PDF"}
              onRemove={() => removePending(file.id)}
              isPending
            />
          ))}
        </div>
      )}

      {/* Drop zone */}
      {totalFiles < MAX_FILES ? (
        <div
          className={dropZoneClass}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
          <Upload className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            PNG, JPG, GIF, WebP, PDF up to 8MB. Max {MAX_FILES} files.
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">
          Max {MAX_FILES} files reached.
        </p>
      )}
    </div>
  );
};