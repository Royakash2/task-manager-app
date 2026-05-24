'use client'

import { useState } from "react";
import { $Enums } from "@prisma/client";
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FileUploadProps {
    onChange: (value: { name: string, url: string, type: $Enums.FileTypes }[]) => void;
    value?: { name: string, url: string, type: $Enums.FileTypes }[];
    endpoint?: string;
}

export const FileUpload = ({value = [],onChange}: FileUploadProps) => {
    const [selectedType, setSelectedType] = useState<$Enums.FileTypes | undefined>(
        undefined
    );

    return (
        <div>
          {value?.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4">
              {value.map((file) => (
                <div 
                  key={file?.url}
                  className="relative w-[200px] h-[200px] rounded-lg"
                >
                  <Image 
                    src={file.type === "IMAGE" ? file.url : "/pdf.png"}
                    alt={file.name}
                    className="object-cover rounded-lg"
                    fill
                  />

                  <button
                    type="button"
                    onClick={() => {
                      onChange(value.filter((f) => f.url !== file.url));
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-black/50 hover:bg-rose-400/90 rounded-full text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedType ? (
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedType(undefined)}
                className="absolute top-2 right-2 z-10 h-7 w-7 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
              <UploadDropzone
                endpoint={
                    selectedType === "IMAGE" ? "imageUploader" : "documentsUploader"
                }
                onClientUploadComplete={(res) => {
                    const newFiles = res?.map((f) => ({
                        name: f.name,
                        url: f.url,
                        type: selectedType,
                    }));

                    const updatedFiles = [...value, ...newFiles];
                    onChange(updatedFiles)
                    setSelectedType(undefined)
                }}
                onUploadError={(error: Error) => {
                    console.log(`Error: upload  ${error.message}`);
                    toast.error(`Upload failed: ${error.message}`);
                }}
              />
            </div>
          ): (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setSelectedType("IMAGE")}
                className={cn(selectedType === "IMAGE" && "bg-slate-200")}
              >
                Image
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setSelectedType("PDF")}
                className={cn(selectedType === "PDF" && "bg-slate-200")}
              >
                PDF
              </Button>
            </div>
          )}
        </div>
    );
}