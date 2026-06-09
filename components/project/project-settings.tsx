"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  X,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";

import { projectSchema } from "@/lib/schema";
import { updateProject, toggleProjectAccess, deleteProject } from "@/app/actions/project";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EntitySettingsForm } from "@/components/ui/entity-settings-form";
import { DangerZoneCard } from "@/components/ui/danger-zone-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProjectSettingsMember {
  id: string;
  userId: string;
  accessLevel: string;
  hasAccess: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface ProjectSettingsAdmin {
  id: string;
  userId: string;
  accessLevel: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface ProjectSettingsProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    workspaceId: string;
  };
  admins: ProjectSettingsAdmin[];
  members: ProjectSettingsMember[];
  currentUserRole: string | null;
}

export const ProjectSettings = ({
  project,
  admins,
  members,
  currentUserRole,
}: ProjectSettingsProps) => {
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const [togglingMember, setTogglingMember] = useState<string | null>(null);

  const handleToggleAccess = async (memberId: string, currentAccess: boolean) => {
    setTogglingMember(memberId);
    try {
      const result = await toggleProjectAccess(
        project.workspaceId,
        project.id,
        memberId,
        !currentAccess,
      );
      if ("error" in result) {
        toast.error(result.error || "Failed to update access");
        return;
      }
      toast.success(`Access ${!currentAccess ? "granted" : "revoked"}`);
    } catch (error) {
      console.error("[TOGGLE_ACCESS_ERROR]:", error);
      toast.error("Something went wrong");
    } finally {
      setTogglingMember(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top row: Project Details + Member Access side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Project Details */}
      <EntitySettingsForm
        schema={projectSchema.pick({ name: true, description: true })}
        defaultValues={{
          name: project.name,
          description: project.description || "",
        }}
        onSave={(data) =>
          updateProject(project.workspaceId, project.id, data)
        }
        disabled={!canManage}
        title="Project Details"
        description="Update your project name and description"
        nameLabel="Project Name"
        namePlaceholder="Enter project name"
        descriptionPlaceholder="What is this project about?"
      />

      {/* Member Access */}
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              Member Access
            </CardTitle>
          </div>
          <CardDescription>
            Manage which members have access to this project. Workspace owners
            and admins always have access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Workspace Admins & Owner (always have access) */}
          {admins.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Workspace Admins
              </p>
              <div className="space-y-1">
                {admins.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 gap-1 text-xs"
                    >
                      <Shield className="size-3" />
                      {member.accessLevel === "OWNER" ? "Owner" : "Admin"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Members (toggleable) */}
          {members.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Members
              </p>
              <div className="space-y-1">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={member.hasAccess ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {member.hasAccess ? "Has Access" : "No Access"}
                      </Badge>
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 cursor-pointer"
                          disabled={togglingMember === member.id}
                          onClick={() =>
                            handleToggleAccess(member.id, member.hasAccess)
                          }
                        >
                          {member.hasAccess ? (
                            <X className="size-4 text-destructive" />
                          ) : (
                            <Check className="size-4 text-primary" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {members.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              <User className="size-4 shrink-0" />
              <span>
                No members yet. Invite members from the workspace members page.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Danger Zone — visible to OWNER and ADMIN */}
      {canManage && (
        <DangerZoneCard
          entityLabel="project"
          entityDisplayName={project.name}
          onDelete={() => deleteProject(project.workspaceId, project.id)}
          deleteDescription="Permanently remove this project and all its tasks, comments, and files."
          warning="All tasks, comments, and files within this project will be permanently removed."
        />
      )}
    </div>
  );
};
