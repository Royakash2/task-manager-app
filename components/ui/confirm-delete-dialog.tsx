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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";

interface ConfirmByText {
  label: string;
  requiredText: string;
  placeholder?: string;
}

type Props = {
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  title: string;
  description: React.ReactNode;
  entityName: string;
  variant?: "menu" | "icon";
  deleteLabel?: string;
  warning?: React.ReactNode;
  redirectUrl?: string;
  onSuccess?: () => void;
  confirmByText?: ConfirmByText;
  /** When provided, the dialog is controlled externally instead of using its own trigger. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ConfirmDeleteDialog = ({
  onDelete,
  title,
  description,
  entityName,
  variant = "menu",
  deleteLabel,
  redirectUrl,
  warning,
  onSuccess: onSuccessCallback,
  confirmByText,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) => {
  const router = useRouter();
  const isControlled = externalOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? externalOpen : internalOpen;
  const [pending, setPending] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const label = deleteLabel ?? "Delete";
  const isConfirmDisabled =
    confirmByText !== undefined && confirmInput !== confirmByText.requiredText;

  const handleDelete = async () => {
    setPending(true);
    try {
      const res = await onDelete();
      if (res.error) {
        toast.error(res.error);
        return;
      }
      handleOpenChange(false);
      onSuccessCallback?.();
      toast.success(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} deleted successfully`);
      if (redirectUrl) {
        if (redirectUrl.startsWith("/api/")) {
          window.location.href = redirectUrl;
        } else {
          router.push(redirectUrl);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${entityName}`);
    } finally {
      setPending(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    externalOnOpenChange?.(nextOpen);
    if (!nextOpen) {
      setConfirmInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Don't render a trigger when dialog is externally controlled */}
      {externalOpen === undefined && (
        variant === "icon" ? (
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
              className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="text-red-500">{title}</span>
            </span>
          </DialogTrigger>
        )
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={cn(warning && "text-destructive flex items-center gap-2")}>
            {warning && <Trash2 className="h-5 w-5" />}
            {title}
          </DialogTitle>
          <DialogDescription className={cn(warning && "pt-2")}>
            {description}
          </DialogDescription>
          {warning && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-destructive mb-1">This action cannot be undone.</p>
              <p>{warning}</p>
            </div>
          )}
          {confirmByText && (
            <div className="space-y-2 pt-1">
              <p className="text-sm text-muted-foreground">
                {confirmByText.label}{" "}
                <strong className="text-foreground">{confirmByText.requiredText}</strong>
              </p>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={confirmByText.placeholder ?? "Type here"}
                className="w-full"
                autoFocus
              />
            </div>
          )}
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <LoadingButton
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={pending}
            disabled={isConfirmDisabled}
            loadingText="Deleting..."
            className="cursor-pointer"
          >
            {label}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
