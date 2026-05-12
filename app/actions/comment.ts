"use server";

import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";
import { revalidatePath } from "next/cache";

export const createComment = async (
  content: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();

    const isMember = await db.workspaceMembers.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!isMember) {
      throw new Error(
        "You do not have permission to comment in this workspace",
      );
    }

    if (!content || content.trim() === "") {
      throw new Error("Comment content cannot be empty");
    }

    const comment = await db.comment.create({
      data: {
        content,
        taskId,
        projectId,
        userId: user.id,
      },
    });

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true, data: comment };
  } catch (error) {
    console.error("[CREATE_COMMENT_ERROR]:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
