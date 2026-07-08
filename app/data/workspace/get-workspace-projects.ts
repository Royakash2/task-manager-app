import db from "@/lib/db";
import { AccessLevel, TaskStatus } from "@prisma/client";
import { getUserRole } from "@/lib/permissions";
import type { ProjectDashboardStat } from "@/utils/types";

export const getWorkspaceProjects = async (
  workspaceId: string,
  userId: string,
): Promise<{
  projects: ProjectDashboardStat[];
  taskStats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}> => {
  const role = await getUserRole(userId, workspaceId);
  const query =
    role === AccessLevel.OWNER || role === AccessLevel.ADMIN
      ? { workspaceId }
      : {
          workspaceId,
          projectAccess: {
            some: {
              hasAccess: true,
              workspaceMember: { userId, workspaceId },
            },
          },
        };

  const projects = await db.project.findMany({
    where: query,
    select: {
      id: true,
      name: true,
      description: true,
      workspaceId: true,
      activities: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      tasks: {
        where: { deletedAt: null },
        select: {
          id: true,
          status: true,
          dueDate: true,
        },
      },
      projectAccess: {
        select: {
          workspaceMember: {
            select: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      },
    },
  });

  const allTasks = projects.flatMap((p) => p.tasks);
  const now = new Date();

  const taskStats = {
    total: allTasks.length,
    completed: allTasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    inProgress: allTasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.IN_REVIEW,
    ).length,
    overdue: allTasks.filter(
      (t) =>
        t.status !== TaskStatus.COMPLETED &&
        t.status !== TaskStatus.CANCELLED &&
        t.dueDate &&
        t.dueDate < now,
    ).length,
  };

  const projectsStats: ProjectDashboardStat[] = projects.map((project) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED,
    ).length;
    const seen = new Set<string>();
    const members = project.projectAccess
      .map((pa) => pa.workspaceMember.user)
      .filter((user) => {
        if (seen.has(user.id)) return false;
        seen.add(user.id);
        return true;
      });
    const lastActivity = project.activities[0]?.createdAt ?? null;

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      workspaceId: project.workspaceId,
      totalTasks,
      completedTasks,
      completionPercentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      memberCount: members.length,
      members,
      lastActivityAt: lastActivity,
    };
  });

  return { projects: projectsStats, taskStats };
};
