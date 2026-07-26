"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MemberRow } from "./member-row";
import { InviteMemberDialog } from "./invite-member-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Search, Users, AlertCircle, LogOut, ShieldCheck, UserCog, User } from "lucide-react";
import type { WorkspaceMemberProps } from "@/utils/types";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AccessLevel } from "@prisma/client";
import { leaveWorkspace } from "@/app/actions/members";

interface MembersPageClientProps {
  members: WorkspaceMemberProps[];
  currentUserId: string;
  currentUserRole: AccessLevel | null;
  error?: string | null;
  workspaceName?: string;
}

export const MembersPageClient = ({
  members,
  currentUserId,
  currentUserRole,
  error,
  workspaceName,
}: MembersPageClientProps) => {
  const [search, setSearch] = useState("");
  const [removeTarget, setRemoveTarget] = useState<WorkspaceMemberProps | null>(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const workspaceId = useWorkspaceId();

  const isOwner = currentUserRole === AccessLevel.OWNER;

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.user.name || "").toLowerCase().includes(q) ||
      (m.user.email || "").toLowerCase().includes(q) ||
      m.accessLevel.toLowerCase().includes(q)
    );
  });

  const ownerCount = members.filter((m) => m.accessLevel === AccessLevel.OWNER).length;
  const adminCount = members.filter((m) => m.accessLevel === AccessLevel.ADMIN).length;
  const memberCount = members.filter((m) => m.accessLevel === AccessLevel.MEMBER).length;

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-6 p-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and invite workspace members</p>
        </div>
        <Card>
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <AlertCircle className="size-12 text-destructive/60 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Failed to load members</h3>
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and invite workspace members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InviteMemberDialog currentUserRole={currentUserRole} />
          {!isOwner && (
            <Button
              variant="destructive"
              size="default"
              className="w-full sm:w-auto cursor-pointer"
              onClick={() => setLeaveDialogOpen(true)}
            >
              <LogOut className="size-4 mr-2" />
              Leave
            </Button>
          )}
        </div>
      </div>

      {/* Overview card — full width, above grid */}
      <Card>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-pink-600" />
              Owner
            </div>
            <span className="text-2xl font-bold tabular-nums">{ownerCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <UserCog className="size-3.5 text-amber-600" />
              Admin
            </div>
            <span className="text-2xl font-bold tabular-nums">{adminCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="size-3.5 text-blue-600" />
              Member
            </div>
            <span className="text-2xl font-bold tabular-nums">{memberCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5 text-muted-foreground" />
              Total
            </div>
            <span className="text-2xl font-bold tabular-nums">{members.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Main layout: list + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Member List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* List */}
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

          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Right: Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Roles legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Role Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-pink-600/10 p-1.5">
                  <ShieldCheck className="size-3.5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Owner</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Full control — manage members, roles, settings 
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-600/10 p-1.5">
                  <UserCog className="size-3.5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage workspace, projects &amp; invite or remove members
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-blue-600/10 p-1.5">
                  <User className="size-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Member</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create and manage projects &amp; tasks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove dialog */}
      <RemoveMemberDialog
        open={!!removeTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        memberId={removeTarget?.id ?? ""}
        memberName={removeTarget?.user.name ?? ""}
        workspaceId={workspaceId}
      />

      {/* Leave workspace dialog */}
      <ConfirmDeleteDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        onDelete={() => leaveWorkspace(workspaceId)}
        title="Leave Workspace"
        description={
          <>
            Are you sure you want to leave{" "}
            <strong>&ldquo;{workspaceName || "this workspace"}&rdquo;</strong>?
          </>
        }
        entityName="workspace"
        deleteLabel="Leave Workspace"
        variant="icon"
        redirectUrl="/workspace"
        warning="You will lose access to all projects, tasks, and files in this workspace. Your assigned tasks will be unassigned. You will be redirected to your workspace overview."
        confirmByText={{
          label: "Type",
          requiredText: "LEAVE",
          placeholder: "Type LEAVE to confirm",
        }}
      />
    </div>
  );
};
