"use server";

import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";
import { verifyAccess, requireTaskAccess, getUserRole } from "@/lib/permissions";
import { AccessLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { actionError, logActivity } from "@/utils/actions";
import { createNotification } from "./notification";

export const createComment = async (
  content: string,
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();

    await verifyAccess(user.id, workspaceId, projectId);
    await requireTaskAccess(user.id, taskId, workspaceId, "You can only comment on tasks you created or are assigned to.");

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
        select: { title: true, createdById: true, assigneeId: true },
      }),
    ]);

    await logActivity(
      "COMMENT_CREATED",
      `commented on task "${task?.title || "untitled"}"`,
      user.id,
      projectId,
    );

    // Notify task creator and assignee (but not the commenter themselves)
    const notifyUserIds = new Set<string>();
    if (task?.createdById && task.createdById !== user.id) {
      notifyUserIds.add(task.createdById);
    }
    if (task?.assigneeId && task.assigneeId !== user.id) {
      notifyUserIds.add(task.assigneeId);
    }

    for (const notifyUserId of notifyUserIds) {
      await createNotification({
        type: "COMMENT_ADDED",
        title: `left a comment on task "${task?.title || "untitled"}"`,
        message: content.length > 120 ? content.slice(0, 120) + "..." : content,
        userId: notifyUserId,
        actorId: user.id,
        link: `/workspace/${workspaceId}/projects/${projectId}/${taskId}`,
        workspaceId,
        projectId,
        taskId,
      });
    }

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true, data: comment };
  } catch (error) {
    console.error("[CREATE_COMMENT_ERROR]:", error);
    return actionError(error, "Failed to create comment");
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
    await requireTaskAccess(user.id, taskId, workspaceId, "You can only comment on tasks you created or are assigned to.");

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
    return actionError(error, "Failed to update comment");
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
    await requireTaskAccess(user.id, taskId, workspaceId, "You can only delete comments on tasks you created or are assigned to.");

    const existingComment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, content: true },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    // OWNER and ADMIN can delete any comment; MEMBER can only delete own
    const role = await getUserRole(user.id, workspaceId);

    if (existingComment.userId !== user.id) {
      if (!role || (role !== AccessLevel.OWNER && role !== AccessLevel.ADMIN)) {
        throw new Error("You can only delete your own comments");
      }
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
    return actionError(error, "Failed to delete comment");
  }
};
