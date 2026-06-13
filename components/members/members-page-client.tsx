"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MemberRow } from "./member-row";
import { InviteMemberDialog } from "./invite-member-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { Search, Users, AlertCircle } from "lucide-react";
import type { WorkspaceMemberProps } from "@/utils/types";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AccessLevel } from "@prisma/client";

interface MembersPageClientProps {
  members: WorkspaceMemberProps[];
  currentUserId: string;
  currentUserRole: AccessLevel | null;
  error?: string | null;
}

export const MembersPageClient = ({
  members,
  currentUserId,
  currentUserRole,
  error,
}: MembersPageClientProps) => {
  const [search, setSearch] = useState("");
  const [removeTarget, setRemoveTarget] = useState<WorkspaceMemberProps | null>(null);
  const workspaceId = useWorkspaceId();

  const isOwner = currentUserRole === AccessLevel.OWNER;
  // const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.user.name.toLowerCase().includes(q) ||
      m.user.email.toLowerCase().includes(q) ||
      m.accessLevel.toLowerCase().includes(q)
    );
  });

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Members
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and invite workspace members
          </p>
        </div>
        <Card>
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <AlertCircle className="size-12 text-destructive/60 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Failed to load members
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Members
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and invite workspace members
          </p>
        </div>
        <InviteMemberDialog currentUserRole={currentUserRole} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search members by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Members List */}
      <Card>
        {filtered.length > 0 ? (
          <div className="divide-y divide-border">
            {filtered.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                isOwner={isOwner}
                onRemoveOpen={setRemoveTarget}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <Users className="size-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {search ? "No members found" : "No members yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {search
                ? "Try a different search term."
                : "Invite your team members to start collaborating."}
            </p>
          </div>
        )}
      </Card>

      {/* Footer info */}
      <p className="text-xs text-muted-foreground text-center">
        Showing {filtered.length} of {members.length} member
        {members.length !== 1 ? "s" : ""}
      </p>

      {/* Remove dialog — lifted to parent, single instance */}
      <RemoveMemberDialog
        open={!!removeTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        memberId={removeTarget?.id ?? ""}
        memberName={removeTarget?.user.name ?? ""}
        workspaceId={workspaceId}
      />
    </div>
  );
};
