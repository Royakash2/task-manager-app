import { Card } from "@/components/ui/card";
import { FolderKanban, ClipboardList, Users } from "lucide-react";

interface WorkspaceStatsCardsProps {
  projectCount: number;
  totalTasks: number;
  memberCount: number;
}

export const WorkspaceStatsCards = ({
  projectCount,
  totalTasks,
  memberCount,
}: WorkspaceStatsCardsProps) => {
  const items = [
    { label: "Projects", value: projectCount, icon: FolderKanban },
    { label: "Total Tasks", value: totalTasks, icon: ClipboardList },
    { label: "Members", value: memberCount, icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="hover:border-primary/30 hover:shadow-md transition-all duration-200"
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                  {stat.label}
                </span>
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  {stat.value}
                </p>
              </div>

              <div className="size-12 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
