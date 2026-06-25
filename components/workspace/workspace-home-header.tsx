"use client";

import { Button } from "@/components/ui/button";
import { AccessLevel } from "@prisma/client";
import { InviteMemberDialog } from "@/components/members/invite-member-dialog";
import { CreateProjectForm } from "@/components/project/create-project-dialog";
import type { workspaceMembersProps } from "@/utils/types";
import { UserPlus, Plus, Sun, SunMedium, Moon } from "lucide-react";
import { getGreeting } from "@/utils/greeting";

const GREETING_ICONS = {
  Sun,
  SunMedium,
  Moon,
} as const;

interface WorkspaceHomeHeaderProps {
  name: string;
  description: string | null;
  currentUserRole: AccessLevel | null;
  workspaceMembers: workspaceMembersProps[];
}

export const WorkspaceHomeHeader = ({
  name,
  description,
  currentUserRole,
  workspaceMembers,
}: WorkspaceHomeHeaderProps) => {
  const { text: greetingText, icon: greetingIconName } = getGreeting();
  const GreetingIcon = GREETING_ICONS[greetingIconName];
  const canManage =
    currentUserRole === AccessLevel.OWNER ||
    currentUserRole === AccessLevel.ADMIN;

  return (
    <div className="flex flex-col gap-6 pb-6 border-b border-border/60">
      <div className="flex flex-row items-start justify-between gap-3 sm:gap-6">
        {/* Left side: Greeting, Title, and Description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
            <GreetingIcon className="size-4 text-primary/80" />
            <span className="text-sm font-medium tracking-wide">{greetingText}</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl capitalize truncate">
            {name}
          </h1>
          
          {description && (
            <p className="mt-2.5 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right side: Quick actions */}
        <div className="flex items-center gap-3 shrink-0">
          <InviteMemberDialog currentUserRole={currentUserRole}>
            <Button
              variant="outline"
              size="default"
              className="p-2 sm:px-4 sm:py-2"
            >
              <UserPlus className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">Invite</span>
            </Button>
          </InviteMemberDialog>

          {canManage && (
            <CreateProjectForm workspaceMembers={workspaceMembers}>
              <Button
                size="default"
                className="p-2 sm:px-4 sm:py-2"
              >
                <Plus className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </CreateProjectForm>
          )}
        </div>
      </div>
    </div>
  );
};
