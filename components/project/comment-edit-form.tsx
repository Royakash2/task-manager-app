import { Check, X } from "lucide-react";

import { LoadingButton } from "../ui/loading-button";
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
        <LoadingButton
          variant="ghost"
          size="sm"
          className="h-8 cursor-pointer text-muted-foreground"
          onClick={onCancel}
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Cancel
        </LoadingButton>
        <LoadingButton
          variant="default"
          size="sm"
          className="h-8 cursor-pointer"
          onClick={onSave}
          loading={isSaving}
          loadingText="Saving..."
          disabled={!initialContent.trim()}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          Save
        </LoadingButton>
      </div>
    </div>
  );
};
