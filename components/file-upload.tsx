'use client'

import { useState } from "react";
import { $Enums } from "@prisma/client";
import { UploadDropzone } from "@/utils/uploadthing";

interface FileUploadProps {
    onChange: (value: { name: string, url: string, type: $Enums.FileTypes }[]) => void;
    value: { name: string, url: string, type: $Enums.FileTypes }[];
    endpoint: string;
}

export const FileUpload = ({value,onChange}: FileUploadProps) => {
    const [selectedType, setSelectedType] = useState<$Enums.FileTypes | undefined>(
        undefined
    );

    return (
        <div>
          {
            // dispaly files
          }

          {selectedType && (
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
                    console.log(`Error: upload  ${error.message}`)
                   
                }}
            />
          )}
        </div>
    );
}