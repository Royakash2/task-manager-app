"use client";

import { AccessLevel } from "@prisma/client";
import { workspaceSchema } from "@/lib/schema";

import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { EntitySettingsForm } from "@/components/ui/entity-settings-form";
import { updateWorkspace, deleteWorkspace } from "@/app/actions/workspace";
import { permanentlyDeleteTask, recoverTask } from "@/app/actions/task";
import { deleteAccount } from "@/app/actions/user";
import { TrashSection } from "@/components/workspace/trash-section";
import { OnboardingForm } from "@/components/OnboardingForm";
import { TrashedTask } from "@/utils/types";

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
  currentUserRole: AccessLevel | null;
  trashedTasks: TrashedTask[];
  user: {
    id: string;
    name: string;
    email: string;
    about: string | null;
    indrustryType: string;
    role: string;
    country: string;
    image: string | null;
  } | null;
}

export const SettingsPageClient = ({
  workspace,
  workspaceId,
  currentUserRole,
  trashedTasks,
  user,
}: SettingsPageClientProps) => {
  const isOwner = currentUserRole === AccessLevel.OWNER;

  return (
    <div className="flex flex-col gap-8 p-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your workspace preferences and configuration
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EntitySettingsForm
          schema={workspaceSchema}
          defaultValues={{
            name: workspace.name,
            description: workspace.description || "",
          }}
          onSave={(data) => updateWorkspace(workspaceId, data)}
          disabled={!isOwner}
          title="Workspace Settings"
          description="Update your workspace name and description"
          nameLabel="Workspace Name"
          namePlaceholder="Enter workspace name"
          descriptionPlaceholder="What is this workspace for?"
        />

        <OnboardingForm
          mode="settings"
          name={user?.name || ""}
          email={user?.email || ""}
          image={user?.image || ""}
          about={user?.about || ""}
          country={user?.country || ""}
          industryType={user?.indrustryType || ""}
          role={user?.role || ""}
        />
      </div>

      {isOwner && (
        <TrashSection
          tasks={trashedTasks}
          onPermanentDelete={permanentlyDeleteTask}
          onRecover={recoverTask}
        />
      )}

      {/* Combined Danger Zone */}
      <Card className="border-destructive/20 mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <CardTitle className="text-lg font-semibold text-destructive">
              Danger Zone
            </CardTitle>
          </div>
          <CardDescription>
            Irreversible actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className={`grid gap-4 ${isOwner ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {/* Action 1: Delete Workspace (only visible to owner) */}
          {isOwner && (
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Workspace
              </p>
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Delete this workspace
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently remove this workspace and all its data, including projects, tasks, and members.
                  </p>
                </div>
                <ConfirmDeleteDialog
                  onDelete={() => deleteWorkspace(workspaceId)}
                  title="Delete Workspace"
                  description={
                    <>
                      Are you sure you want to delete{" "}
                      <strong>&ldquo;{workspace.name}&rdquo;</strong>? This
                      action cannot be undone.
                    </>
                  }
                  entityName="workspace"
                  deleteLabel="Delete Workspace"
                  variant="icon"
                  redirectUrl="/workspace"
                  warning="All projects, tasks, comments, files, and members within this workspace will be permanently removed. You will be redirected to your workspace overview."
                />
              </div>
            </div>
          )}

          {/* Action 2: Delete Account (visible to everyone) */}
          <div className="flex flex-col">
            {isOwner && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Account
              </p>
            )}
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Delete your account
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete your account and all associated data across all workspaces.
                </p>
              </div>
              <ConfirmDeleteDialog
                onDelete={deleteAccount}
                title="Delete Account"
                description={
                  <>
                    Are you sure you want to delete{" "}
                    <strong>&ldquo;your account&rdquo;</strong>? This action
                    cannot be undone.
                  </>
                }
                entityName="account"
                deleteLabel="Delete Account"
                variant="icon"
                redirectUrl="/api/auth/logout"
                warning="Your profile, memberships, comments, activities, and subscription will be permanently removed. Ownership of any sole-owned workspaces will be transferred to another admin or member. You will be logged out and redirected to the home page."
                confirmByText={{
                  label: "Type",
                  requiredText: "DELETE",
                  placeholder: "Type DELETE to confirm",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
