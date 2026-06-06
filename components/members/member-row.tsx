"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, UserMinus } from "lucide-react";
import { ChangeRoleDropdown } from "./change-role-dropdown";
import { ProfileAvatar } from "@/components/profile-avatar";
import type { WorkspaceMemberProps } from "@/utils/types";

interface MemberRowProps {
  member: WorkspaceMemberProps;
  currentUserId: string;
  currentUserRole: string | null;
  isOwner: boolean;
  onRemoveOpen: (member: WorkspaceMemberProps) => void;
}

export const MemberRow = ({
  member,
  currentUserId,
  currentUserRole,
  isOwner,
  onRemoveOpen,
}: MemberRowProps) => {
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const isCurrentUser = member.userId === currentUserId;
  const isOwnerMember = member.accessLevel === "OWNER";
  const isAdminMember = member.accessLevel === "ADMIN";

  // ADMIN can remove MEMBERs; OWNER can remove ADMINs and MEMBERs
  const canRemove = canManage && !isCurrentUser && !isOwnerMember && (!isAdminMember || isOwner);

  const joinedDate = new Date(member.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
      {/* Avatar */}
      <ProfileAvatar
        url={member.user.image || undefined}
        name={member.user.name}
        size="sm"
        className="size-9 shrink-0 rounded-full"
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {member.user.name}
            {isCurrentUser && (
              <span className="text-xs text-muted-foreground font-normal ml-1">
                (you)
              </span>
            )}
          </span>
          <Badge
            variant={member.accessLevel as "OWNER" | "ADMIN" | "MEMBER"}
            className="text-[10px] px-1.5 py-0 h-4"
          >
            {member.accessLevel}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {member.user.email}
        </p>
      </div>

      {/* Joined date */}
      <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
        Joined {joinedDate}
      </span>

      {/* Actions */}
      {canRemove && (
        <div className="flex items-center gap-1 shrink-0">
          {/* Only OWNER can change roles */}
          {isOwner && !isOwnerMember && (
            <ChangeRoleDropdown
              memberId={member.id}
              currentRole={member.accessLevel}
              isOwner={isOwner}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1">
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => onRemoveOpen(member)}
              >
                <UserMinus className="size-4 mr-2" />
                Remove from workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
