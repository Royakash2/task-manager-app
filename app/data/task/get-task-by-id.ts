import db from "@/lib/db";
import { userRequired } from "../user/get-user";

export const getTaskById = async (taskId: string) => {
 
  await userRequired();

  
  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      assigneeTo: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },

      project: {
        select: {
          id: true,
          name: true,
          workspaceId: true,
        },
      },

      attachments: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return { task };
};
