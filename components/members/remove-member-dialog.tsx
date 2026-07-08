"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { removeMember } from "@/app/actions/members";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
  workspaceId: string;
}

export const RemoveMemberDialog = ({
  open,
  onOpenChange,
  memberId,
  memberName,
  workspaceId,
}: RemoveMemberDialogProps) => {
  const [pending, setPending] = useState(false);

  const handleRemove = async () => {
    setPending(true);
    try {
      const result = await removeMember(workspaceId, memberId);
      if (result.success) {
        toast.success(`${memberName} has been removed from the workspace`);
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("[REMOVE_DIALOG_ERROR]:", error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Remove Member</DialogTitle>
          <DialogDescription className="pt-1">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{memberName}</span>{" "}
            from this workspace? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 pt-2">
          <LoadingButton
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="destructive"
            className="flex-1 cursor-pointer"
            loading={pending}
            loadingText="Removing..."
            onClick={handleRemove}
          >
            Remove
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
