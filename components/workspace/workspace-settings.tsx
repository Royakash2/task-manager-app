"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { workspaceSchema, SettingsFormValues } from "@/lib/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
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
  const [pending, setPending] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description || "",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setPending(true);
    try {
      const result = await updateWorkspace(workspaceId, data);
      if ("error" in result) {
        toast.error(result.error || "Failed to update workspace");
        return;
      }
      toast.success("Workspace settings updated successfully");
    } catch (error) {
      console.error("[SETTINGS_UPDATE_ERROR]:", error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">General</CardTitle>
          <CardDescription>
            Update your workspace name and description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter workspace name" disabled={!isOwner} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this workspace for?"
                        className="resize-none"
                        disabled={!isOwner}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isOwner && (
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  className="cursor-pointer"
                  onClick={() => {
                    form.reset({
                      name: workspace.name,
                      description: workspace.description || "",
                    });
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={pending || !form.formState.isDirty}
                  className="cursor-pointer"
                >
                  {pending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone — only visible to workspace owner */}
      {isOwner && (
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <CardTitle className="text-lg font-semibold text-destructive">
              Danger Zone
            </CardTitle>
          </div>
          <CardDescription>
            Irreversible actions for your workspace. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    <strong>&ldquo;{workspace.name}&rdquo;</strong>?
                    This action cannot be undone.
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
        </CardContent>
      </Card>
      )}
    </div>
  );
};
