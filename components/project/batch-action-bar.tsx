"use client";

import { LoadingButton } from "../ui/loading-button";
import { Trash2 } from "lucide-react";

interface BatchActionBarProps {
  selectedCount: number;
  isDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export const BatchActionBar = ({
  selectedCount,
  isDeleting,
  onDelete,
  onCancel,
}: BatchActionBarProps) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md border">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2 ml-auto">
        <LoadingButton
          variant="destructive"
          size="sm"
          onClick={onDelete}
          loading={isDeleting}
          loadingText="Deleting..."
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete ({selectedCount})
        </LoadingButton>
        <LoadingButton
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </LoadingButton>
      </div>
    </div>
  );
};
