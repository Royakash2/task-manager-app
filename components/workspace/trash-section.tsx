"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, FolderKanban, RotateCcw } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TrashedTask {
  id: string;
  title: string;
  deletedAt: Date | null;
  project: {
    id: string;
    name: string;
  };
}

interface TrashSectionProps {
  tasks: TrashedTask[];
  onPermanentDelete: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  onRecover: (taskId: string) => Promise<{ success: boolean; error?: string }>;
}

export const TrashSection = ({ tasks, onPermanentDelete, onRecover }: TrashSectionProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<"delete" | "recover" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const allSelected = selectedIds.size === tasks.length;
  const hasSelection = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkRecover = async () => {
    setPendingAction("recover");
    const ids = [...selectedIds];
    const results = await Promise.allSettled(
      ids.map((id) => onRecover(id)),
    );
    let successCount = 0;
    const errors: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++;
      } else {
        const errorMsg =
          result.status === "fulfilled"
            ? result.value.error || "Unknown error"
            : result.reason?.message || "Unknown error";
        errors.push(errorMsg);
      }
    }
    if (errors.length > 0) {
      toast.error(`${errors.length} task${errors.length === 1 ? "" : "s"} failed: ${errors.join(", ")}`);
    }
    if (successCount > 0) {
      toast.success(`${successCount} task${successCount === 1 ? "" : "s"} recovered`);
    }
    setSelectedIds(new Set());
    setPendingAction(null);
  };

  const handleBulkDelete = async () => {
    setPendingAction("delete");
    const ids = [...selectedIds];
    const results = await Promise.allSettled(
      ids.map((id) => onPermanentDelete(id)),
    );
    setConfirmOpen(false);
    let successCount = 0;
    const errors: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++;
      } else {
        const errorMsg =
          result.status === "fulfilled"
            ? result.value.error || "Unknown error"
            : result.reason?.message || "Unknown error";
        errors.push(errorMsg);
      }
    }
    if (errors.length > 0) {
      toast.error(`${errors.length} task${errors.length === 1 ? "" : "s"} failed: ${errors.join(", ")}`);
    }
    if (successCount > 0) {
      toast.success(`${successCount} task${successCount === 1 ? "" : "s"} permanently deleted`);
    }
    setSelectedIds(new Set());
    setPendingAction(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trash2 className="size-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Trash</CardTitle>
          <Badge variant="secondary" className="ml-auto text-xs">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </Badge>
        </div>
        <CardDescription>
          Soft-deleted tasks waiting for permanent removal. Only workspace owners can manage these.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <Trash2 className="size-4 shrink-0" />
            <span>No trashed tasks.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-md border border-border">
              <div className="flex items-center gap-2.5 px-3 py-1.5 border-b border-border bg-background sticky top-0 z-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {allSelected ? "Deselect all" : "Select all"}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              <div className={tasks.length > 3 ? "max-h-45 overflow-y-auto space-y-0" : "space-y-0"}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 border-t border-border first:border-t-0"
                >
                  <Checkbox
                    checked={selectedIds.has(task.id)}
                    onCheckedChange={() => toggleOne(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FolderKanban className="size-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {task.project.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {hasSelection && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Badge variant="secondary" className="text-xs">
                  {selectedIds.size} selected
                </Badge>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs cursor-pointer"
                    disabled={pendingAction === "recover"}
                    onClick={handleBulkRecover}
                  >
                    <RotateCcw className="size-3 mr-1" />
                    {pendingAction === "recover" ? "..." : "Recover Selected"}
                  </Button>
                  <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs cursor-pointer"
                        disabled={pendingAction === "delete"}
                      >
                        <Trash2 className="size-3 mr-1" />
                        {pendingAction === "delete" ? "..." : "Delete Selected"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                          <Trash2 className="size-5" />
                          Delete Selected Tasks
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                          Are you sure you want to permanently delete{" "}
                          <strong>{selectedIds.size} trashed task{selectedIds.size === 1 ? "" : "s"}</strong>?
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
                        <p className="font-medium text-destructive mb-1">
                          This action cannot be undone.
                        </p>
                        <p>
                          The selected tasks, their comments, and attachments will be
                          permanently removed from the database.
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setConfirmOpen(false)}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleBulkDelete}
                          className="cursor-pointer"
                        >
                          {pendingAction === "delete" ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
