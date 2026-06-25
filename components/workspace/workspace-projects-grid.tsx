import { WorkspaceProjectCard } from "./workspace-project-card";
import type { ProjectDashboardStat } from "@/utils/types";

interface WorkspaceProjectsGridProps {
  projects: ProjectDashboardStat[];
  workspaceId: string;
}

export const WorkspaceProjectsGrid = ({
  projects,
  workspaceId,
}: WorkspaceProjectsGridProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Projects
        </h2>
        <span className="text-sm text-muted-foreground">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <WorkspaceProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
