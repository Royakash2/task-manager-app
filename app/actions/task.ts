"use server";

import { userRequired } from "../data/user/get-user";
import { taskFormSchema, type TaskFormValues } from "@/lib/schema";
import db from "@/lib/db";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  requireRole,
  requireTaskAccess,
  verifyAccess,
  enforceAssigneeRestriction,
} from "@/lib/permissions";
import {
  syncTaskAttachments,
  deleteAttachments,
} from "@/utils/file-attachments";
import { actionError, logActivity } from "@/utils/actions";

export const createTask = async (
  data: TaskFormValues,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();
    const validatedData = taskFormSchema.parse(data);

    await verifyAccess(user.id, workspaceId, projectId);

    const lastTask = await db.task.findFirst({
      where: { projectId, status: data.status },
      orderBy: { position: "desc" },
    });

    const position = lastTask ? lastTask.position + 1000 : 1000;

    const assigneeId = await enforceAssigneeRestriction(
      user.id,
      workspaceId,
      validatedData.assigneeId,
    );

    const newTask = await db.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : undefined,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
        projectId,
        assigneeId,
        status: validatedData.status,
        priority: validatedData.priority,
        position,
        createdById: user.id,
      },
    });

    // Link pre-registered Uploadthing files or create fallbacks
    await syncTaskAttachments(
      newTask.id,
      projectId,
      validatedData.attachments || [],
    );

    await logActivity(
      "TASK_CREATED",
      `created task "${validatedData.title}"`,
      user.id,
      projectId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return actionError(error, "Failed to create task");
  }
};

export const softDeleteTask = async (
  taskId: string,
  workspaceId: string,
  projectId: string,
) => {
  try {
    const { user } = await userRequired();

    await requireRole(user.id, workspaceId, "OWNER", "ADMIN");

    const existingTask = await db.task.findUnique({
      where: { id: taskId },
      include: {
        attachments: true,
      },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found" };
    }

    // Clean up UploadThing files
    if (existingTask.attachments.length > 0) {
      await deleteAttachments(existingTask.attachments.map((f) => f.url));
    }

    // Soft delete — set deletedAt
    await db.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });

    await logActivity(
      "TASK_DELETED",
      `deleted task "${existingTask.title}"`,
      user.id,
      projectId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}`);
    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}/${taskId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return actionError(error, "Failed to delete task");
  }
};

export const updateTaskPosition = async (
  taskId: string,
  newStatus: string,
  newPosition: number,
) => {
  try {
    const { user } = await userRequired();

    const currentTask = await db.task.findUnique({
      where: { id: taskId },
      select: {
        projectId: true,
        status: true,
        title: true,
        project: {
          select: { workspaceId: true },
        },
      },
    });

    if (!currentTask) return { success: false, error: "Task not found" };

    await verifyAccess(
      user.id,
      currentTask.project.workspaceId,
      currentTask.projectId,
    );
    await requireTaskAccess(
      user.id,
      taskId,
      currentTask.project.workspaceId,
      "You can only move tasks you created or are assigned to.",
    );

    await db.task.update({
      where: { id: taskId },
      data: {
        status: newStatus as TaskStatus,
        position: newPosition * 1000,
      },
    });

    const tasksInColumn = await db.task.findMany({
      where: {
        status: newStatus as TaskStatus,
        projectId: currentTask.projectId,
        deletedAt: null,
      },
      orderBy: { position: "asc" },
    });

    const updates = tasksInColumn.map((task, index) =>
      db.task.update({
        where: { id: task.id },
        data: { position: (index + 1) * 1000 },
      }),
    );

    await db.$transaction(updates);

    if (currentTask.status !== newStatus) {
      await logActivity(
        "TASK_UPDATED",
        `moved task "${currentTask.title}" to ${newStatus.replace("_", " ")}`,
        user.id,
        currentTask.projectId,
      );
    }

    revalidatePath(
      `/workspace/${currentTask.project.workspaceId}/projects/${currentTask.projectId}`,
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to update task position:", error);
    return actionError(error, "Failed to update task position");
  }
};

export const updateTaskDetails = async (
  taskId: string,
  data: TaskFormValues,
) => {
  try {
    const { user } = await userRequired();
    const validatedData = taskFormSchema.parse(data);

    const existingTask = await db.task.findFirst({
      where: { id: taskId, deletedAt: null },
      include: {
        project: {
          select: { workspaceId: true },
        },
        attachments: true,
      },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found" };
    }

    await verifyAccess(
      user.id,
      existingTask.project.workspaceId,
      existingTask.projectId,
    );
    await requireTaskAccess(
      user.id,
      taskId,
      existingTask.project.workspaceId,
      "You can only edit tasks you created or are assigned to.",
    );

    const incomingUrls = new Set(
      validatedData.attachments?.map((file) => file.url) || [],
    );

    const filesToDelete = existingTask.attachments.filter(
      (file) => !incomingUrls.has(file.url),
    );
    const filesToKeepOrUpdate = validatedData.attachments || [];

    // 1. Delete files that were removed by the user
    if (filesToDelete.length > 0) {
      await deleteAttachments(filesToDelete.map((f) => f.url));
    }

    const assigneeId = await enforceAssigneeRestriction(
      user.id,
      existingTask.project.workspaceId,
      validatedData.assigneeId,
    );

    // 2. Update core task properties
    await db.task.update({
      where: { id: taskId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : undefined,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
        assigneeId,
        status: validatedData.status,
        priority: validatedData.priority,
      },
    });

    // 3. Sync remaining/new attachments
    await syncTaskAttachments(
      taskId,
      existingTask.projectId,
      filesToKeepOrUpdate,
    );

    await logActivity(
      "TASK_UPDATED",
      `updated task "${validatedData.title}"`,
      user.id,
      existingTask.projectId,
    );

    revalidatePath(
      `/workspace/${existingTask.project.workspaceId}/projects/${existingTask.projectId}`,
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return actionError(error, "Failed to update task");
  }
};
