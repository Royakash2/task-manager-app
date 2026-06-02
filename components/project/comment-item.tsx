import { formatDistanceToNow } from "date-fns";
import { Pencil } from "lucide-react";

import { ProfileAvatar } from "../profile-avatar";
import { CommentProps } from "@/utils/types";
import { Button } from "../ui/button";

interface CommentItemProps {
  comment: CommentProps;
  isAuthor: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  children?: React.ReactNode;
}

export const CommentItem = ({
  comment,
  isAuthor,
  isEditing = false,
  onStartEdit,
  children,
}: CommentItemProps) => {
  const isEdited =
    !isEditing &&
    comment.createdAt.getTime() !== comment.updatedAt.getTime();

  return (
    <div className="flex items-start gap-3 group">
      <ProfileAvatar
        url={comment.user.image || undefined}
        name={comment.user.name}
        numOfChars={2}
        size="md"
      />

      <div className="flex flex-1 flex-col gap-0.5 mt-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">
            {comment.user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>

          {isEdited && (
            <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground/50">
              (edited)
            </span>
          )}

          {isAuthor && !isEditing && onStartEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={onStartEdit}
              aria-label="Edit comment"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>

        {!isEditing ? (
          <div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
