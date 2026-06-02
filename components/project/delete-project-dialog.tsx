"use client";

import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { deleteProject } from "@/app/actions/project";

type Props = {
  projectId: string;
  projectName: string;
  workspaceId: string;
  projectTaskCount?: number;
  redirectOnDelete?: boolean;
  onSuccess?: () => void;
  variant?: "dropdown" | "icon";
};

export const DeleteProjectDialog = ({
  projectId,
  projectName,
  workspaceId,
  projectTaskCount,
  redirectOnDelete,
  onSuccess,
  variant = "dropdown",
}: Props) => {
  return (
    <ConfirmDeleteDialog
      onDelete={() => deleteProject(workspaceId, projectId)}
      title="Delete Project"
      description={
        <>
          Are you sure you want to delete <strong>&ldquo;{projectName}&rdquo;</strong>?
        </>
      }
      entityName="project"
      deleteLabel="Delete Project"
      variant={variant === "dropdown" ? "menu" : "icon"}
      warning={
        projectTaskCount
          ? `This project has ${projectTaskCount} task${projectTaskCount !== 1 ? "s" : ""}. All tasks, comments, files, and documentation will be permanently removed.`
          : "All tasks, comments, files, and documentation within this project will be permanently removed from the workspace."
      }
      redirectUrl={
        redirectOnDelete
          ? `/workspace/${workspaceId}`
          : undefined
      }
      onSuccess={onSuccess}
    />
  );
};
