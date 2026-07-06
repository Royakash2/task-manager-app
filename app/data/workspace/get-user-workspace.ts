import db from "@/lib/db";
import { userRequired } from "../user/get-user";

export const getUserWorkspaces = async () => {
  try {
    const { user } = await userRequired();

    const workspace = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {    
        workspaces: {
          select: {
            id: true,
            userId: true,
            workspace: { select: { name: true, description: true } },
            workspaceId: true,
            accessLevel: true,
            createdAt: true,
          },
        },
      },
    });
    return { data: workspace, error: null };
  } catch (error) {
    console.error("[GET_USER_WORKSPACES_ERROR]:", error);
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch workspaces" };
  }
};
