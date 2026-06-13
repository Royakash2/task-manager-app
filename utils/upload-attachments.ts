import type { Attachment } from "@/hooks/use-file-upload";
import { FileTypes } from "@prisma/client";

type UploadResult = { name: string; url: string };

type StartUploadFn = (files: File[]) => Promise<UploadResult[] | undefined>;

export async function uploadPendingAttachments(
  pendingFiles: File[],
  existingAttachments: Attachment[],
  startUpload: StartUploadFn,
): Promise<Attachment[]> {
  if (pendingFiles.length === 0) return existingAttachments;

  const uploadResult = await startUpload(pendingFiles);

  if (!uploadResult) return existingAttachments;

  const newAttachments: Attachment[] = uploadResult.map((f) => ({
    name: f.name,
    url: f.url,
    type: f.name.toLowerCase().endsWith(".pdf") ? FileTypes.PDF : FileTypes.IMAGE,
  }));

  return [...existingAttachments, ...newAttachments];
}
