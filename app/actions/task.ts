"use server";

import { TaskFormValues } from "@/components/task/create-task-dialog";
import { userRequired } from "../data/user/get-user";
import { taskFormSchema } from "@/lib/schema";
import db from "@/lib/db";
import { TaskStatus } from "@prisma/client";

export const createTask = async (
  data: TaskFormValues,
  projectId: string,
  workspaceId: string,
) => {
  const { user } = await userRequired();

  const validatedData = taskFormSchema.parse(data);

  const isUserMember = await db.workspaceMembers.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if(!isUserMember){
    throw new Error("You are not a member of this workspace");
  }

  const tasks = await db.task.findMany({
    where: {
      projectId,
    },
  });

  const lastTask = tasks
    ?.filter((task) => task.status === data.status)
    .sort((a, b) => (b.position - a.position))[0];

  const position = lastTask ? lastTask.position + 1000 : 1000;

  const task = await db.task.create({
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

  return { success: true };
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
      select: { projectId: true, status: true, title: true }
    });

    if (!currentTask) return { success: false, error: "Task not found" };

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
      })
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

    return { success: true };
  } catch (error) {
    console.error("Failed to update task position:", error);
    return { success: false, error: "Failed to update task position" };
  }
};
