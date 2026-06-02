"use client";

import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { softDeleteTask } from "@/app/actions/task";

type Props = {
  taskId: string;
  projectId: string;
  workspaceId: string;
  taskTitle: string;
  redirectOnDelete?: boolean;
  onSuccess?: () => void;
  variant?: "table" | "icon";
};

export const DeleteTaskDialog = ({
  taskId,
  projectId,
  workspaceId,
  taskTitle,
  redirectOnDelete,
  onSuccess,
  variant = "table",
}: Props) => {
  return (
    <ConfirmDeleteDialog
      onDelete={() => softDeleteTask(taskId, workspaceId, projectId)}
      title="Delete"
      description={
        <>
          Are you sure you want to delete <strong>&ldquo;{taskTitle}&rdquo;</strong>? This action cannot be undone.
        </>
      }
      entityName="task"
      variant={variant === "table" ? "menu" : "icon"}
      redirectUrl={
        redirectOnDelete
          ? `/workspace/${workspaceId}/projects/${projectId}`
          : undefined
      }
      onSuccess={onSuccess}
    />
  );
};
