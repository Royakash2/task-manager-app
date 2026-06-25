"use client";

import { FileTypes } from "@prisma/client";
import Image from "next/image";
import { X } from "lucide-react";

type FilePreviewCardProps = {
  name: string;
  url: string;
  type: FileTypes;
  onRemove: () => void;
  isPending?: boolean;
};

export function FilePreviewCard({
  name,
  url,
  type,
  onRemove,
  isPending,
}: FilePreviewCardProps) {
  return (
    <div className="group relative flex items-center justify-between w-50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-900/50 shadow-xs">
      <div className="flex items-center gap-3 min-w-0 pr-6">
        {type === FileTypes.IMAGE ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
            <Image src={url} alt={name} className="object-cover" fill sizes="48px" />
          </div>
        ) : (
          <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
            <Image
              src="/pdf.png"
              alt="PDF file"
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{name}</span>
          {/* {isPending && <span className="text-[10px] text-amber-500 font-medium">Pending upload</span>} */}
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={`Remove ${name}`}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
