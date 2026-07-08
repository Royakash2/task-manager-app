import { Card } from "@/components/ui/card";
import {
  FolderKanban,
  ClipboardList,
  Users,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceStatsCardsProps {
  projectCount: number;
  totalTasks: number;
  memberCount: number;
  overdueTasks: number;
}

export const WorkspaceStatsCards = ({
  projectCount,
  totalTasks,
  memberCount,
  overdueTasks,
}: WorkspaceStatsCardsProps) => {
  const items = [
    { label: "Projects", value: projectCount, icon: FolderKanban },
    { label: "Total Tasks", value: totalTasks, icon: ClipboardList },
    { label: "Members", value: memberCount, icon: Users },
    {
      label: "Overdue Tasks",
      value: overdueTasks,
      icon: AlertCircle,
      critical: overdueTasks > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((stat) => {
        const Icon = stat.icon;
        const isCritical = "critical" in stat && stat.critical;

        return (
          <Card
            key={stat.label}
            className={cn(
              "transition-all duration-200",
              isCritical
                ? "border-destructive/30 hover:border-destructive/60 hover:shadow-md hover:shadow-destructive/5"
                : "hover:border-primary/30 hover:shadow-md",
            )}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                  {stat.label}
                </span>
                <p
                  className={cn(
                    "text-3xl font-bold tabular-nums",
                    isCritical ? "text-destructive" : "text-foreground",
                  )}
                >
                  {stat.value}
                </p>
              </div>

              <div
                className={cn(
                  "size-12 rounded-lg flex items-center justify-center shrink-0",
                  isCritical
                    ? "bg-destructive/10"
                    : "bg-accent/50",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    isCritical ? "text-destructive" : "text-muted-foreground",
                  )}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
