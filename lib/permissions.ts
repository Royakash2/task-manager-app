import db from "@/lib/db";

export const verifyProjectAccess = async (
  userId: string,
  workspaceId: string,
  projectId: string,
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
};
