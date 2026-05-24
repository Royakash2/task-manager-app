"use server";

import { TaskFormValues } from "@/components/task/create-task-dialog";
import { userRequired } from "../data/user/get-user";
import { taskFormSchema } from "@/lib/schema";
import db from "@/lib/db";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { verifyProjectAccess } from "@/lib/permissions";

export const createTask = async (
  data: TaskFormValues,
  projectId: string,
  workspaceId: string,
) => {
  try {
    const { user } = await userRequired();
    const validatedData = taskFormSchema.parse(data);

    await verifyProjectAccess(user.id, workspaceId, projectId);

    const lastTask = await db.task.findFirst({
      where: { projectId, status: data.status },
      orderBy: { position: "desc" },
    });

    const position = lastTask ? lastTask.position + 1000 : 1000;

    await db.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        dueDate: new Date(validatedData.dueDate),
        projectId,
        assigneeId: validatedData.assigneeId,
        status: validatedData.status,
        priority: validatedData.priority,
        position,
      },
      include: {
        project: true,
      },
    });

    await db.activity.create({
      data: {
        type: "TASK_CREATED",
        description: `created task "${validatedData.title}"`,
        projectId,
        userId: user.id,
      },
    });

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create task" };
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
          select: { workspaceId: true }
        }
      },
    });

    if (!currentTask) return { success: false, error: "Task not found" };

    await verifyProjectAccess(user.id, currentTask.project.workspaceId, currentTask.projectId);

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
      await db.activity.create({
        data: {
          type: "TASK_UPDATED",
          description: `moved task "${currentTask.title}" to ${newStatus.replace("_", " ")}`,
          projectId: currentTask.projectId,
          userId: user.id,
        },
      });
    }

    revalidatePath(`/workspace/${currentTask.project.workspaceId}/projects/${currentTask.projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update task position:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update task position" };
  }
};

export const updateTaskDetails = async (
  taskId: string,
  data: TaskFormValues,
) => {
  try {
    const { user } = await userRequired();
    const validatedData = taskFormSchema.parse(data);

    const existingTask = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: { workspaceId: true },
        },
      },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found" };
    }

    await verifyProjectAccess(user.id, existingTask.project.workspaceId, existingTask.projectId);

    await db.task.update({
      where: { id: taskId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        dueDate: new Date(validatedData.dueDate),
        assigneeId: validatedData.assigneeId,
        status: validatedData.status,
        priority: validatedData.priority,
      },
    });

    await db.activity.create({
      data: {
        type: "TASK_UPDATED",
        description: `updated task "${validatedData.title}"`,
        projectId: existingTask.projectId,
        userId: user.id,
      },
    });

    revalidatePath(`/workspace/${existingTask.project.workspaceId}/projects/${existingTask.projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update task" };
  }
};

