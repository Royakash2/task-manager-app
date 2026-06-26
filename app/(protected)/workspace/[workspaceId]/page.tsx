import { getWorkspaceDashboard } from "@/app/data/workspace/get-workspace-dashboard";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import { NotFoundState } from "@/components/not-found-state";
import { ActivityFeed } from "@/components/project/activity-feed";
import { WorkspaceHomeHeader } from "@/components/workspace/workspace-home-header";
import { WorkspaceMembersList } from "@/components/workspace/workspace-members-list";
import { WorkspaceStatsCards } from "@/components/workspace/workspace-stats-cards";
import { WorkspaceProjectsGrid } from "@/components/workspace/workspace-projects-grid";

interface WorkspaceHomeProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceHomePage = async (props: WorkspaceHomeProps) => {
  const { workspaceId } = await props.params;

  const result = await getWorkspaceDashboard(workspaceId);

  if ("error" in result && result.error) {
    return (
      <NotFoundState title="Something went wrong" description={result.error} />
    );
  }

  const data = result.data!;

  return (
    <div className="flex flex-col gap-6 pb-3 px-3">
      {/* ── Section 1: Header ─────────────────────────────────────────── */}
      <WorkspaceHomeHeader
        name={data.workspace.name}
        description={data.workspace.description}
        currentUserRole={data.currentUserRole}
        workspaceMembers={data.workspaceMembers}
      />

      {/* ── Section 2: Stats Cards ────────────────────────────────────── */}
      <WorkspaceStatsCards
        projectCount={data.projectsStats.length}
        totalTasks={data.taskStats.total}
        memberCount={data.memberCount}
      />

      {/* ── Section 3: Activity + Members Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <History className="size-4" />
              Recent Activity
            </h2>
          </div>

          <ActivityFeed activities={data.recentActivities.slice(0, 5)} />
        </Card>

        <WorkspaceMembersList members={data.workspaceMembers} />
      </div>

      {/* ── Section 4: Projects Grid ──────────────────────────────────── */}
      <WorkspaceProjectsGrid
        projects={data.projectsStats}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default WorkspaceHomePage;
