import { UTApi } from "uploadthing/server";
import db from "@/lib/db";
import { FileTypes } from "@prisma/client";

const utapi = new UTApi();

type AttachmentInput = { name: string; url: string; type: FileTypes };

export async function syncTaskAttachments(
  taskId: string,
  projectId: string,
  attachments: AttachmentInput[],
) {
  if (!attachments || attachments.length === 0) return;

  const urls = attachments.map((a) => a.url);

  const existingFiles = await db.file.findMany({
    where: { url: { in: urls } },
  });

  const existingUrls = new Set(existingFiles.map((f) => f.url));

  // Files not yet registered in DB → create (fallback)
  const filesToCreate = attachments.filter((a) => !existingUrls.has(a.url));
  if (filesToCreate.length > 0) {
    await db.file.createMany({
      data: filesToCreate.map((f) => ({
        name: f.name,
        url: f.url,
        type: f.type,
        taskId,
        projectId,
      })),
    });
  }

  // Pre-registered files that haven't been linked yet → update
  const filesToUpdate = existingFiles.filter(
    (f) => f.taskId !== taskId || f.projectId !== projectId,
  );
  if (filesToUpdate.length > 0) {
    await db.file.updateMany({
      where: { id: { in: filesToUpdate.map((f) => f.id) } },
      data: { taskId, projectId },
    });
  }
}

/**
 * Delete files from both Uploadthing servers and the database.
 */
export async function deleteAttachments(urls: string[]) {
  if (urls.length === 0) return;

  // Delete from Uploadthing
  try {
    const fileKeys = urls.map((url) => {
      const parts = url.split("/");
      return parts[parts.length - 1];
    });
    await utapi.deleteFiles(fileKeys);
  } catch (err) {
    console.error("Failed to delete files from Uploadthing:", err);
  }

  // Delete from database
  await db.file.deleteMany({
    where: { url: { in: urls } },
  });
}
