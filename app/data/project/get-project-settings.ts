import { AccessLevel } from "@prisma/client";
import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess, getUserRole } from "@/lib/permissions";

export const getProjectSettings = async (
  workspaceId: string,
  projectId: string,
) => {
  try {
    const { user } = await userRequired();

    // OWNER and ADMIN bypass project-level access check via verifyAccess
    await verifyAccess(user.id, workspaceId, projectId);

    const currentUserRole = await getUserRole(user.id, workspaceId);

    const [project, workspaceMembers] = await Promise.all([
      db.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          description: true,
          workspaceId: true,
          projectAccess: {
            where: {
              workspaceMember: {
                accessLevel: { notIn: [AccessLevel.OWNER, AccessLevel.ADMIN] },
              },
            },
            select: {
              id: true,
              hasAccess: true,
              workspaceMember: {
                select: {
                  id: true,
                  userId: true,
                  accessLevel: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
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
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    if (!project) {
      return { error: "Project not found" };
    }

    // Build a set of member IDs that have access for quick lookup
    const memberAccessMap = new Map(
      project.projectAccess.map((pa) => [pa.workspaceMember.userId, pa.hasAccess]),
    );

    // Split members into admins (always have access) and regular members (toggleable)
    const admins = workspaceMembers
      .filter(
        (m) => m.accessLevel === AccessLevel.OWNER || m.accessLevel === AccessLevel.ADMIN,
      )
      .map((member) => ({
        id: member.id,
        userId: member.userId,
        accessLevel: member.accessLevel,
        user: member.user,
      }));

    const regularMembers = workspaceMembers
      .filter((m) => m.accessLevel === AccessLevel.MEMBER)
      .map((member) => ({
        id: member.id,
        userId: member.userId,
        accessLevel: member.accessLevel,
        user: member.user,
        hasAccess: memberAccessMap.get(member.userId) ?? false,
      }));

    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        workspaceId: project.workspaceId,
      },
      admins,
      members: regularMembers,
      currentUserRole,
    };
  } catch (error) {
    console.error("[GET_PROJECT_SETTINGS_ERROR]:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch project settings",
    };
  }
};
