import { formatDistanceToNow } from "date-fns";
import { ProfileAvatar } from "../profile-avatar";
import { CommentProps } from "@/utils/types";

export const CommentList = ({ comments }: { comments: CommentProps[] }) => {
  return (
    <div className="space-y-6">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3">
          <ProfileAvatar 
            url={comment.user.image || undefined}
            name={comment.user.name}
            numOfChars={2}
            size="md"
          />
        
          <div className="flex flex-1 flex-col gap-0.5 mt-0.5">
            <div className="flex items-center gap-2">
               <span className="font-medium text-sm text-foreground">{comment.user.name}</span>
               <span className="text-xs text-muted-foreground">
                 {formatDistanceToNow(new Date(comment.createdAt), {
                   addSuffix: true,
                 })}
               </span>
            </div>
            <div>
               <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
