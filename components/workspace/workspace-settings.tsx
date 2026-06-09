"use client";

import { workspaceSchema } from "@/lib/schema";

import { EntitySettingsForm } from "@/components/ui/entity-settings-form";
import { DangerZoneCard } from "@/components/ui/danger-zone-card";
import { updateWorkspace, deleteWorkspace } from "@/app/actions/workspace";

interface SettingsPageClientProps {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
  };
  workspaceId: string;
  currentUserRole: string | null;
}

export const SettingsPageClient = ({
  workspace,
  workspaceId,
  currentUserRole,
}: SettingsPageClientProps) => {
  const isOwner = currentUserRole === "OWNER";

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your workspace preferences and configuration
        </p>
      </div>

      {/* General Settings */}
      <EntitySettingsForm
        schema={workspaceSchema}
        defaultValues={{
          name: workspace.name,
          description: workspace.description || "",
        }}
        onSave={(data) => updateWorkspace(workspaceId, data)}
        disabled={!isOwner}
        title="General"
        description="Update your workspace name and description"
        nameLabel="Workspace Name"
        namePlaceholder="Enter workspace name"
        descriptionPlaceholder="What is this workspace for?"
      />

      {/* Danger Zone — only visible to workspace owner */}
      {isOwner && (
        <DangerZoneCard
          entityLabel="workspace"
          entityDisplayName={workspace.name}
          onDelete={() => deleteWorkspace(workspaceId)}
          deleteDescription="Permanently remove this workspace and all its data, including projects, tasks, and members."
          warning="All projects, tasks, comments, files, and members within this workspace will be permanently removed. You will be redirected to your workspace overview."
          redirectUrl="/workspace"
        />
      )}
    </div>
  );
};
