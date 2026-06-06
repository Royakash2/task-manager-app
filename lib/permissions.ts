import db from "@/lib/db";
import { AccessLevel } from "@prisma/client";

/** Verifies the user is a workspace member and has project-level access. */
export const verifyAccess = async (
  userId: string,
  workspaceId: string,
  projectId?: string,
) => {
  const membership = await db.workspaceMembers.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  if (!membership) {
    throw new Error("You are not a member of this workspace");
  }

  // OWNER and ADMIN bypass the project-level access check
  if (membership.accessLevel === "OWNER" || membership.accessLevel === "ADMIN") {
    return;
  }

  if (projectId) {
    const projectAccess = await db.projectAccess.findUnique({
      where: {
        workspaceMemberId_projectId: {
          workspaceMemberId: membership.id,
          projectId,
        },
      },
    });

    if (!projectAccess?.hasAccess) {
      throw new Error(
        "You do not have permission to modify data in this project",
      );
    }
  }
};

/** Returns the user's role in a workspace, or null if not a member. */
export const getUserRole = async (
  userId: string,
  workspaceId: string,
): Promise<AccessLevel | null> => {
  const membership = await db.workspaceMembers.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    select: { accessLevel: true },
  });

  return membership?.accessLevel ?? null;
};

/** Throws if user's role isn't one of the specified allowed roles. */
export const requireRole = async (
  userId: string,
  workspaceId: string,
  ...allowedRoles: AccessLevel[]
): Promise<void> => {
  const role = await getUserRole(userId, workspaceId);

  if (!role) {
    throw new Error("You are not a member of this workspace.");
  }

  if (!allowedRoles.includes(role)) {
    const expected = allowedRoles
      .map((r) => r.toLowerCase())
      .join(" or ");
    throw new Error(
      `This action requires the ${expected} role. Your role is ${role.toLowerCase()}.`,
    );
  }
};

/** Ensures the user is a workspace OWNER. */
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
