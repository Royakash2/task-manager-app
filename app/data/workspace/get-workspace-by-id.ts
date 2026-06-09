import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess, getUserRole } from "@/lib/permissions";

export const getWorkspaceById = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId);

    const currentUserRole = await getUserRole(user.id, workspaceId);

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        inviteCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!workspace) {
      return { error: "Workspace not found", currentUserRole: null };
    }

    return { workspace, currentUserRole };
  } catch (error) {
    console.error("[GET_WORKSPACE_BY_ID_ERROR]:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch workspace",
      currentUserRole: null,
    };
  }
};
