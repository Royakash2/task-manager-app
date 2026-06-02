"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
type ImageLightboxPreviewProps = {
  images: { id: string; name: string; url: string; type: string }[];
};

export const ImageLightboxPreview = ({ images }: ImageLightboxPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageFiles = images.filter((img) => img.type === "IMAGE");

  const open = useCallback((fileId: string) => {
    const idx = imageFiles.findIndex((f) => f.id === fileId);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setIsOpen(true);
    }
  }, [imageFiles]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageFiles.length);
  }, [imageFiles.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + imageFiles.length) % imageFiles.length);
  }, [imageFiles.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, goNext, goPrev]);

  if (images.length === 0) {
    return (
      <div className="flex items-center h-20">
        <p className="text-sm italic text-muted-foreground">No attachments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((file) => (
          <div key={file.id} className="relative group cursor-pointer">
            {file.type === "IMAGE" ? (
              <div
                onClick={() => open(file.id)}
                className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <span className="text-white text-sm font-medium">Preview</span>
                </div>
              </div>
            ) : (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 block"
              >
                <div className="relative w-full h-full p-4">
                  <Image
                    src="/pdf.png"
                    alt="PDF file"
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <span className="text-white text-sm font-medium">Open PDF</span>
                  </div>
                </div>
              </a>
            )}
          </div>
        ))}
      </div>

      {isOpen && imageFiles.length > 0 && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
            aria-label="Close preview"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="absolute top-4 left-4 text-white/60 text-sm font-medium z-10">
            {currentIndex + 1} / {imageFiles.length}
          </div>

          {imageFiles.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageFiles[currentIndex].url}
              alt={imageFiles[currentIndex].name}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {imageFiles.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-medium z-10 bg-black/40 px-3 py-1.5 rounded-full">
            {imageFiles[currentIndex].name}
          </div>
        </div>
      )}
    </>
  );
};
