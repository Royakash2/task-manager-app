"use client";

import { useMemo, useState } from "react";
import { Search, Users, Check, ShieldCheck } from "lucide-react";

import { Input } from "../ui/input";
import { ProfileAvatar } from "../profile-avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { workspaceMembersProps } from "@/utils/types";

interface MemberAccessPickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
  workspaceMembers: workspaceMembersProps[];
}

export const MemberAccessPicker = ({
  value,
  onChange,
  workspaceMembers,
}: MemberAccessPickerProps) => {
  const [memberSearch, setMemberSearch] = useState("");

  const isLocked = (member: workspaceMembersProps) =>
    member.accessLevel === "OWNER" || member.accessLevel === "ADMIN";

  const toggleableMemberIds = useMemo(
    () =>
      workspaceMembers
        .filter((m) => !isLocked(m))
        .map((m) => m.userId),
    [workspaceMembers],
  );

  const filteredMembers = useMemo(
    () =>
      workspaceMembers
        .filter((member) => {
          const q = memberSearch.toLowerCase();
          return (
            member.user.name.toLowerCase().includes(q) ||
            (member.user.email ?? "").toLowerCase().includes(q)
          );
        })
        .sort((a, b) => {
          const aLocked = isLocked(a) ? 0 : 1;
          const bLocked = isLocked(b) ? 0 : 1;
          return aLocked - bLocked;
        }),
    [workspaceMembers, memberSearch],
  );

  const selectedIds = value;
  const allToggleableSelected =
    toggleableMemberIds.length > 0 &&
    toggleableMemberIds.every((id) => selectedIds.includes(id));

  const toggleAll = () => {
    if (allToggleableSelected) {
      onChange(
        workspaceMembers
          .filter((m) => isLocked(m))
          .map((m) => m.userId),
      );
    } else {
      onChange([
        ...workspaceMembers
          .filter((m) => isLocked(m))
          .map((m) => m.userId),
        ...toggleableMemberIds,
      ]);
    }
  };

  const toggleMember = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  return (
    <div className="rounded-md border border-border">
      <div className="relative px-3 pt-2 pb-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search members..."
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
          className="h-8 pl-8 text-sm"
        />
      </div>

      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 border-t border-border",
          "hover:bg-muted/40 transition-colors cursor-pointer",
        )}
        onClick={toggleAll}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleAll();
        }}
      >
        <div
          className={cn(
            "size-4 shrink-0 rounded-lg border flex items-center justify-center transition-colors",
            allToggleableSelected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-input bg-transparent",
          )}
        >
          {allToggleableSelected && <Check className="size-3.5" />}
        </div>
        <Users className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs font-medium text-foreground">
          {allToggleableSelected
            ? "Deselect All"
            : "Select All Members"}
        </span>
      </div>

      <div className="max-h-60 overflow-y-auto border-t border-border [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        <div className="divide-y divide-border">
          {filteredMembers.map((member) => {
            const locked = isLocked(member);
            const isSelected = selectedIds.includes(member.userId);
            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 transition-colors",
                  locked
                    ? "opacity-60 cursor-default"
                    : "hover:bg-muted/40 cursor-pointer",
                  !locked && isSelected && "bg-muted/20",
                )}
                onClick={() => {
                  if (locked) return;
                  toggleMember(member.userId);
                }}
                role={locked ? "presentation" : "button"}
                tabIndex={locked ? -1 : 0}
                onKeyDown={(e) => {
                  if (locked) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMember(member.userId);
                  }
                }}
              >
                <div
                  className={cn(
                    "size-4 shrink-0 rounded-lg border flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-input bg-transparent",
                  )}
                >
                  {isSelected && <Check className="size-3.5" />}
                </div>
                <ProfileAvatar
                  name={member.user.name}
                  url={member.user.image}
                  size="sm"
                  className="size-7 rounded-full"
                />
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {member.user.name}
                  </span>
                  <Badge
                    variant={
                      member.accessLevel as
                        | "OWNER"
                        | "ADMIN"
                        | "MEMBER"
                    }
                    className="text-[10px] px-2 shrink-0"
                  >
                    {locked && (
                      <ShieldCheck className="size-3 mr-1" />
                    )}
                    {member.accessLevel === "OWNER"
                      ? "Owner"
                      : member.accessLevel === "ADMIN"
                        ? "Admin"
                        : "Member"}
                  </Badge>
                </div>
              </div>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="size-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">
                {memberSearch
                  ? `No members found matching &ldquo;${memberSearch}&rdquo;`
                  : "No members yet. Invite members from the workspace members page."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
