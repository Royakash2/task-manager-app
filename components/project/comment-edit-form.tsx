import { Check, X } from "lucide-react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentEditFormProps {
  initialContent: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CommentEditForm = ({
  initialContent,
  isSaving,
  onChange,
  onSave,
  onCancel,
  onKeyDown,
}: CommentEditFormProps) => {
  return (
    <div className="space-y-2 mt-1">
      <Textarea
        value={initialContent}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="min-h-20 resize-none text-sm focus-visible:ring-primary/20"
        disabled={isSaving}
        autoFocus
      />
      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 cursor-pointer text-muted-foreground"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          className="h-8 cursor-pointer"
          onClick={onSave}
          disabled={isSaving || !initialContent.trim()}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
