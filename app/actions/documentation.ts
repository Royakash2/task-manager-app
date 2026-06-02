"use server";

import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";
import { verifyAccess } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export const saveDocumentation = async (
  content: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();

    await verifyAccess(user.id, workspaceId, projectId);

    const doc = await db.documentation.upsert({
      where: { taskId },
      update: { content },
      create: {
        taskId,
        content,
        projectId,
      },
    });

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true, data: doc };
  } catch (error) {
    console.error("[SAVE_DOCUMENTATION_ERROR]:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
