"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { LoadingButton } from "../ui/loading-button";
import { saveDocumentation } from "@/app/actions/documentation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import Tiptap from "../ui/Tiptap";

interface DocumentationEditorProps {
  initialContent?: string | null;
  taskId: string;
  projectId: string;
  workspaceId: string;
}

const DocumentationEditor = ({
  initialContent = "",
  taskId,
  projectId,
  workspaceId,
}: DocumentationEditorProps) => {
  const [content, setContent] = useState(initialContent || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (html: string) => {
    setContent(html);
    if (!hasChanges) setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await saveDocumentation(
        content,
        taskId,
        projectId,
        workspaceId,
      );

      if ("error" in response) {
        toast.error(response.error || "Failed to save documentation");
        return;
      }
      setHasChanges(false);
      toast.success("Documentation saved");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="shadow-none border-muted-foreground/10 pt-10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Documentation
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground/60 mt-0.5">
              Write detailed notes and documentation for this task
            </CardDescription>
          </div>
          <LoadingButton
            disabled={!hasChanges}
            loading={isSaving}
            loadingText="Saving..."
            onClick={handleSave}
            size="sm"
            className="cursor-pointer gap-1.5 text-xs"
          >
            <Save className="size-3.5" />
            Save Changes
          </LoadingButton>
        </div>
      </CardHeader>
      <CardContent>
        <Tiptap
          content={initialContent || undefined}
          onChange={handleChange}
          placeholder="Add documentation, notes, or guidelines for this task..."
        />
      </CardContent>
    </div>
  );
};

export default DocumentationEditor;
