"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { softDeleteTask } from "@/app/actions/task";

type Props = {
  taskId: string;
  projectId: string;
  workspaceId: string;
  taskTitle: string;
  redirectOnDelete?: boolean;
  onSuccess?: () => void;
  /**
   * Trigger variant:
   * - "table" (default) — styled dropdown menu item with Trash2 + "Delete Task" text
   * - "icon" — icon-only button (for use in task details page next to Edit button)
   */
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const res = await softDeleteTask(taskId, workspaceId, projectId);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setOpen(false);
      onSuccess?.();
      toast.success("Task deleted successfully");
      router.refresh();
      if (redirectOnDelete) {
        router.push(`/workspace/${workspaceId}/projects/${projectId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant === "icon" ? (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md cursor-pointer text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <span
            className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete Task</span>
          </span>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>&ldquo;{taskTitle}&rdquo;</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
            className="cursor-pointer"
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
