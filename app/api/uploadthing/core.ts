import { userRequired } from "@/app/data/user/get-user";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import db from "@/lib/db";

const f = createUploadthing();

// Shared auth middleware — used by all upload routes
const authMiddleware = async () => {
  const user = await userRequired();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.user.id };
};

// Shared handler that pre-registers the uploaded file in the database
const handleUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: { userId: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any;
}) => {
  console.log("Upload complete for userId:", metadata.userId);
  const url = file.ufsUrl || file.url;
  console.log("file url", url);

  try {
    await db.file.create({
      data: {
        name: file.name,
        url,
        type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "IMAGE",
      },
    });
  } catch (error) {
    console.error("Failed to pre-register file in database:", error);
  }

  return { uploadedBy: metadata.userId };
};

export const ourFileRouter = {
  attachmentUploader: f({
    blob: {
      maxFileSize: "8MB",
      maxFileCount: 3,
    },
  })
    .middleware(authMiddleware)
    .onUploadComplete(handleUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
