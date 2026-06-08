"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CommentProps } from "@/utils/types";
import { updateComment, deleteComment } from "@/app/actions/comment";
import { CommentItem } from "./comment-item";
import { CommentEditForm } from "./comment-edit-form";

interface CommentListProps {
  comments: CommentProps[];
  currentUserId?: string;
  currentUserRole?: string | null;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
}

export const CommentList = ({
  comments,
  currentUserId,
  currentUserRole,
  workspaceId,
  projectId,
  taskId,
}: CommentListProps) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = (comment: CommentProps) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleSave = async (commentId: string) => {
    const trimmed = editContent.trim();
    if (!trimmed || isSaving) return;
    if (!taskId || !projectId || !workspaceId) return;

    setIsSaving(true);
    try {
      const res = await updateComment(
        commentId,
        trimmed,
        taskId,
        projectId,
        workspaceId,
      );

      if ("error" in res) {
        toast.error(res.error || "Failed to update comment");
        return;
      }
      setEditingCommentId(null);
      setEditContent("");
      toast.success("Comment updated");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!taskId || !projectId || !workspaceId) {
      return { success: false, error: "Missing route parameters" };
    }
    return deleteComment(commentId, taskId, projectId, workspaceId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, commentId: string) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave(commentId);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <div className="space-y-5">
      {comments?.map((comment) => {
        const isEditing = editingCommentId === comment.id;
        const isAuthor =
          !!currentUserId && comment.user.id === currentUserId;

        return (
          <div key={comment.id}>
            {isEditing ? (
              <CommentItem
                comment={comment}
                isAuthor={isAuthor}
                currentUserRole={currentUserRole}
                isEditing
              >
                <CommentEditForm
                  initialContent={editContent}
                  isSaving={isSaving}
                  onChange={setEditContent}
                  onSave={() => handleSave(comment.id)}
                  onCancel={cancelEditing}
                  onKeyDown={(e) => handleKeyDown(e, comment.id)}
                />
              </CommentItem>
            ) : (
              <CommentItem
                comment={comment}
                isAuthor={isAuthor}
                currentUserRole={currentUserRole}
                onStartEdit={() => startEditing(comment)}
                onDelete={() => handleDelete(comment.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
