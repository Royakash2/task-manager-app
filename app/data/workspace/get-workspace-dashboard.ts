import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess } from "@/lib/permissions";

import { getWorkspaceProjects } from "./get-workspace-projects";
import { getWorkspaceActivity } from "./get-workspace-activity";
import { getWorkspaceMembers } from "@/app/data/members/get-workspace-members";

import type {
  workspaceMembersProps,
  WorkspaceDashboardData,
} from "@/utils/types";

export const getWorkspaceDashboard = async (
  workspaceId: string,
): Promise<{ data?: WorkspaceDashboardData; error?: string }> => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId);

    const [workspace, projectsResult, membersResult, recentActivities] =
      await Promise.all([
        db.workspace.findUnique({
          where: { id: workspaceId },
          select: { name: true, description: true },
        }),
        getWorkspaceProjects(workspaceId, user.id),
        getWorkspaceMembers(workspaceId),
        getWorkspaceActivity(workspaceId),
      ]);

    if (!workspace) {
      return { error: "Workspace not found" };
    }

    // Use aggregate stats already computed by getWorkspaceProjects
    const { projects: projectsStats, taskStats } = projectsResult;

    // Use role already computed by getWorkspaceMembers (avoids a separate query)
    const currentUserRole = membersResult.currentUserRole;

    // Deduplicated member count
    const seen = new Set<string>();
    const memberCount = membersResult.members
      .map((m) => m.user)
      .filter((user) => {
        if (seen.has(user.id)) return false;
        seen.add(user.id);
        return true;
      }).length;

    // Map to workspaceMembersProps for the header dialogs (invite, create project) and members list
    const workspaceMembersRows: workspaceMembersProps[] =
      membersResult.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        workspaceId: m.workspaceId,
        accessLevel: m.accessLevel,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        user: {
          id: m.user.id,
          name: m.user.name,
          image: m.user.image ?? undefined,
          email: m.user.email,
        },
        projectAccess: m.projectAccess.map((pa) => ({
          id: pa.id,
          hasAccess: pa.hasAccess,
          projectId: pa.projectId,
        })),
      }));

    return {
      data: {
        workspace,
        currentUserRole,
        taskStats,
        projectsStats,
        memberCount,
        workspaceMembers: workspaceMembersRows,
        recentActivities,
      },
    };
  } catch (error) {
    console.error("[GET_WORKSPACE_DASHBOARD_ERROR]:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch workspace dashboard",
    };
  }
};
