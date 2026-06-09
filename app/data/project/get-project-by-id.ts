import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess } from "@/lib/permissions";

export const getProjectById = async (workspaceId: string, projectId: string) => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId, projectId);

    const tasks = await db.task.findMany({
        where: {
            projectId,
            deletedAt: null,
        },
        include: {
            assigneeTo: {
                select: { id: true, name: true, email: true, image: true },
            },
            project: { select: { id: true, name: true, workspaceId: true } },
            attachments: true,
        },
    });

    return { tasks };
  } catch (error) {
    console.error("[GET_PROJECT_BY_ID_ERROR]:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch project tasks" };
  }
};