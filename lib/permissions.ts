import db from "@/lib/db";
import { AccessLevel } from "@prisma/client";

/** Verifies the user is a workspace member and has project-level access. */
export const verifyAccess = async (
  userId: string,
  workspaceId: string,
  projectId?: string,
) => {
  const [workspace, membership] = await Promise.all([
    db.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true },
    }),
    db.workspaceMembers.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    }),
  ]);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (!membership) {
    throw new Error("You are not a member of this workspace");
  }

  // OWNER and ADMIN bypass the project-level access check
  if (membership.accessLevel === AccessLevel.OWNER || membership.accessLevel === AccessLevel.ADMIN) {
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
        "You do not have access to this project",
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
    throw new Error("You are not a member of this workspace");
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

/** Checks if a MEMBER can access a task (must be creator or assignee). OWNER/ADMIN always pass. */
export const requireTaskAccess = async (
  userId: string,
  taskId: string,
  workspaceId: string,
  customErrorMessage?: string,
) => {
  const role = await getUserRole(userId, workspaceId);

  if (!role) throw new Error("You are not a member of this workspace");

  // OWNER and ADMIN can access any task
  if (role === AccessLevel.OWNER || role === AccessLevel.ADMIN) return;

  // MEMBER must be the creator or assignee
  const task = await db.task.findUnique({
    where: { id: taskId },
    select: { createdById: true, assigneeId: true },
  });

  if (!task) throw new Error("Task not found");

  if (task.createdById !== userId && task.assigneeId !== userId) {
    throw new Error(
      customErrorMessage || "You can only access tasks you created or are assigned to",
    );
  }
};

/** Ensures the user is a workspace OWNER. */
export const requireOwner = async (userId: string, workspaceId: string) => {
  await requireRole(userId, workspaceId, AccessLevel.OWNER);
};


export async function enforceAssigneeRestriction(
  userId: string,
  workspaceId: string,
  submittedAssigneeId: string | null | undefined,
): Promise<string | null | undefined> {
  
  return submittedAssigneeId || undefined;
}
