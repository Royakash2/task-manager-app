"use server";

import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";
import { verifyAccess } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { actionError, logActivity } from "@/utils/actions";

export const createComment = async (
  content: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();

    await verifyAccess(user.id, workspaceId, projectId);

    if (!content || content.trim() === "") {
      throw new Error("Comment content cannot be empty");
    }

    const [comment, task] = await Promise.all([
      db.comment.create({
        data: {
          content,
          taskId,
          projectId,
          userId: user.id,
        },
      }),
      db.task.findUnique({
        where: { id: taskId },
        select: { title: true },
      }),
    ]);

    await logActivity(
      "COMMENT_CREATED",
      `commented on task "${task?.title || "untitled"}"`,
      user.id,
      projectId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true, data: comment };
  } catch (error) {
    console.error("[CREATE_COMMENT_ERROR]:", error);
    return actionError(error, "An unexpected error occurred");
  }
};

export const updateComment = async (
  commentId: string,
  content: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();

    await verifyAccess(user.id, workspaceId, projectId);

    if (!content || content.trim() === "") {
      throw new Error("Comment content cannot be empty");
    }

    const existingComment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== user.id) {
      throw new Error("You can only edit your own comments");
    }

    const [updatedComment, task] = await Promise.all([
      db.comment.update({
        where: { id: commentId },
        data: { content: content.trim() },
      }),
      db.task.findUnique({
        where: { id: taskId },
        select: { title: true },
      }),
    ]);

    await logActivity(
      "COMMENT_EDITED",
      `edited a comment on task "${task?.title || "untitled"}"`,
      user.id,
      projectId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true, data: updatedComment };
  } catch (error) {
    console.error("[UPDATE_COMMENT_ERROR]:", error);
    return actionError(error, "An unexpected error occurred");
  }
};

export const deleteComment = async (
  commentId: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();

    await verifyAccess(user.id, workspaceId, projectId);

    const existingComment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, content: true },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== user.id) {
      throw new Error("You can only delete your own comments");
    }

    const [task] = await Promise.all([
      db.task.findUnique({
        where: { id: taskId },
        select: { title: true },
      }),
      db.comment.delete({
        where: { id: commentId },
      }),
    ]);

    await logActivity(
      "COMMENT_DELETED",
      `deleted a comment on task "${task?.title || "untitled"}"`,
      user.id,
      projectId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true };
  } catch (error) {
    console.error("[DELETE_COMMENT_ERROR]:", error);
    return actionError(error, "An unexpected error occurred");
  }
};
