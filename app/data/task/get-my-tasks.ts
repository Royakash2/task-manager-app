import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { getUserRole, verifyAccess } from "@/lib/permissions";

export const getMyTasks = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId);
    const userRole = await getUserRole(user.id, workspaceId);

    const tasks = await db.task.findMany({
      where: {
        assigneeId: user.id,
        project: { workspaceId },
        deletedAt: null,
      },
      include: {
        assigneeTo: {
          select: { id: true, name: true, image: true, email: true },
        },
        project: {
          select: { id: true, name: true, workspaceId: true },
        },
        attachments: true,
      },
      orderBy: [
        { project: { name: "asc" } },
        { createdAt: "desc" },
      ],
    });

    return { tasks, userRole, error: null };
  } catch (error) {
    return {
      tasks: [],
      userRole: null,
      error: error instanceof Error ? error.message : "Failed to fetch tasks",
    };
  }
};
