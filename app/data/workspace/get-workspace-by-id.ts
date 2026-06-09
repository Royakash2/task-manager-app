import db from "@/lib/db";
import { userRequired } from "../user/get-user";

export const getWorkspaceById = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();

    const [workspace, membership] = await Promise.all([
      db.workspace.findUnique({
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
      }),
      db.workspaceMembers.findUnique({
        where: { userId_workspaceId: { userId: user.id, workspaceId } },
        select: { accessLevel: true },
      }),
    ]);

    if (!workspace) {
      return { error: "Workspace not found", currentUserRole: null };
    }

    if (!membership) {
      return { error: "You are not a member of this workspace", currentUserRole: null };
    }

    return { workspace, currentUserRole: membership.accessLevel };
  } catch (error) {
    console.error("[GET_WORKSPACE_BY_ID_ERROR]:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch workspace",
      currentUserRole: null,
    };
  }
};
