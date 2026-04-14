import { formatDistanceToNow } from "date-fns";
import { ProfileAvatar } from "../profile-avatar";
import { CommentProps } from "@/utils/types";

export const CommentList = ({ comments }: { comments: CommentProps[] }) => {
  return (
    <div className="space-y-6">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-4">
          <ProfileAvatar 
            url={comment.user.image || undefined}
            name={comment.user.name}
            numOfChars={2}
            size="md"
          />
        
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
               <p className="font-semibold text-xs">{comment.user.name}</p>
               <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                 {formatDistanceToNow(new Date(comment.createdAt), {
                   addSuffix: true,
                 })}
               </span>
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 w-fit">
               <p className="text-xs text-foreground/90">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};