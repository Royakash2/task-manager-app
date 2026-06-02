import { useState, useRef, useEffect, useCallback } from "react";
import { $Enums } from "@prisma/client";

export const MAX_FILES = 3;
export const MAX_FILE_SIZE_MB = 8;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_TYPES = "image/*,.pdf";

export type Attachment = {
  name: string;
  url: string;
  type: $Enums.FileTypes;
};

type PendingFile = {
  id: number;
  file: File;
  preview: string;
};

export type FileUploadProps = {
  value?: Attachment[];
  onChange: (value: Attachment[]) => void;
  onPendingChange?: (files: File[]) => void;
};

let nextId = 0;

export function useFileUpload({
  value = [],
  onChange,
  onPendingChange,
}: FileUploadProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingFilesRef = useRef(pendingFiles);
  pendingFilesRef.current = pendingFiles;

  const totalFiles = value.length + pendingFiles.length;

  const addFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList);

      if (totalFiles + files.length > MAX_FILES) {
        return;
      }

      const validFiles = files.filter((file) => {
        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";
        if (!isImage && !isPdf) return false;
        if (file.size > MAX_FILE_SIZE_BYTES) return false;
        return true;
      });

      if (validFiles.length === 0) return;

      const newPending: PendingFile[] = validFiles.map((file) => ({
        id: nextId++,
        file,
        preview: URL.createObjectURL(file),
      }));

      setPendingFiles((prev) => [...prev, ...newPending]);
    },
    [totalFiles],
  );

  const removePending = useCallback((id: number) => {
    setPendingFiles((prev) => {
      const file = prev.find((p) => p.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const removeCommitted = useCallback(
    (url: string) => {
      onChange(value.filter((f) => f.url !== url));
    },
    [value, onChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(e.target.files);
        e.target.value = "";
      }
    },
    [addFiles],
  );

  // Sync pending files to parent after render
  useEffect(() => {
    onPendingChange?.(pendingFiles.map((p) => p.file));
  }, [pendingFiles, onPendingChange]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      pendingFilesRef.current.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // Only run on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pendingFiles,
    isDragging,
    inputRef,
    totalFiles,
    MAX_FILES,
    MAX_FILE_SIZE_MB,
    ACCEPTED_TYPES,
    addFiles,
    removePending,
    removeCommitted,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
  };
}
