import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess } from "@/lib/permissions";

export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId);

    const [members, workspace] = await Promise.all([
      db.workspaceMembers.findMany({
        where: { workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          projectAccess: {
            select: {
              id: true,
              hasAccess: true,
              projectId: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      db.workspace.findUnique({
        where: { id: workspaceId },
        select: { name: true },
      }),
    ]);

    const currentUserMember = members.find((m) => m.userId === user.id);
    const currentUserRole = currentUserMember?.accessLevel ?? null;

    return { members, currentUserRole, workspaceName: workspace?.name ?? null };
  } catch (error) {
    console.error("[GET_WORKSPACE_MEMBERS_ERROR]:", error);
    return {
      members: [],
      currentUserRole: null,
      workspaceName: null,
      error: error instanceof Error ? error.message : "Failed to fetch members",
    };
  }
};
