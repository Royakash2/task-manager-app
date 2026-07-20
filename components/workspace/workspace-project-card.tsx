import { Progress } from "@/components/ui/progress";
import { ProjectAvatar } from "@/components/project/Project-avatar";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

import type { ProjectDashboardStat } from "@/utils/types";
interface WorkspaceProjectCardProps {
  project: ProjectDashboardStat;
}

export const WorkspaceProjectCard = ({
  project,
}: WorkspaceProjectCardProps) => {
  const visibleMembers = project.members.slice(0, 3);
  const remaining = project.members.length - visibleMembers.length;

  return (
    <Link
      href={`/workspace/${project.workspaceId}/projects/${project.id}`}
      className="block"
    >
      <Card className="hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer h-full group">
        <CardContent className="p-5 flex flex-col gap-3">
          {/* Project name + avatar */}
          <div className="flex items-center gap-3">
            <ProjectAvatar
              name={project.name}
              className="size-10 rounded-lg shrink-0"
              fallbackClassName="text-sm font-bold"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground truncate capitalize">
                {project.name}
              </p>
              {project.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {project.completionPercentage}%
              </span>
            </div>
            <Progress value={project.completionPercentage} className="h-1.5" />
          </div>

          {/* Task count */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClipboardList className="size-3.5" />
            <span>
              {project.completedTasks}/{project.totalTasks} tasks
            </span>
          </div>

          {/* Members + last activity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {visibleMembers.map((member) => (
                <ProfileAvatar
                  key={member.id}
                  name={member.name}
                  url={member.image || undefined}
                  size="xs"
                  className="size-6 border-2 border-background rounded-full -ml-1 first:ml-0"
                />
              ))}
              {remaining > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{remaining}
                </span>
              )}
            </div>
            {project.lastActivityAt && (
              <span className="text-[11px] text-muted-foreground/80">
                {formatDistanceToNow(new Date(project.lastActivityAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
