import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Users } from "lucide-react";

import type { workspaceMembersProps } from "@/utils/types";

interface WorkspaceMembersListProps {
  members: workspaceMembersProps[];
}

export const WorkspaceMembersList = ({
  members,
}: WorkspaceMembersListProps) => {
  if (members.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Users className="size-4" />
          Members & Roles
        </h2>
        <span className="text-xs text-muted-foreground">
          {members.length} total
        </span>
      </div>

      <ScrollArea className="h-[314px] pr-3">
        <div className="space-y-2.5">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ProfileAvatar
                  name={member.user.name}
                  url={member.user.image}
                  size="sm"
                  className="size-8 shrink-0"
                />
                <span className="text-sm font-medium truncate">
                  {member.user.name}
                </span>
              </div>
              <Badge
                variant={
                  member.accessLevel as "OWNER" | "ADMIN" | "MEMBER"
                }
                className="shrink-0 capitalize text-[11px] px-2 py-0.5"
              >
                {member.accessLevel.toLowerCase()}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
