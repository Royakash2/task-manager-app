import db from "@/lib/db";

export const verifyAccess = async (
  userId: string,
  workspaceId: string,
  projectId?: string,
) => {
  const isUserMember = await db.workspaceMembers.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!isUserMember) {
    throw new Error("You are not a member of this workspace");
  }

  // Workspace owners have full access to all projects — skip ProjectAccess check
  if (isUserMember.accessLevel === "OWNER") return;

  if (projectId) {
    const hasProjectAccess = await db.projectAccess.findUnique({
      where: {
        workspaceMemberId_projectId: {
          workspaceMemberId: isUserMember.id,
          projectId,
        },
      },
    });

    if (!hasProjectAccess?.hasAccess) {
      throw new Error(
        "You do not have permission to modify data in this project",
      );
    }
  }
};


 //Ensure the current user is both a member and an OWNER of the workspace.
 
export const requireOwner = async (userId: string, workspaceId: string) => {
  const membership = await db.workspaceMembers.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  if (!membership) {
    throw new Error("You are not a member of this workspace.");
  }
  if (membership.accessLevel !== "OWNER") {
    throw new Error("Only workspace owners can perform this action.");
  }

  return membership;
};
