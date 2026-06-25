"use client";

import { Button } from "../ui/button";
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
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          {isDeleting ? "Deleting..." : `Delete (${selectedCount})`}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
