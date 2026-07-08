'use client';
import { CommentProps } from '@/utils/types';
import { AccessLevel } from '@prisma/client';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useProjectId } from '@/hooks/use-project-id';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CommentList } from '../project/comment-lists';
import { createComment } from '@/app/actions/comment';
import { toast } from 'sonner';

interface TaskCommentProps {
    taskId: string
    comments: CommentProps[]
    currentUserId: string
    currentUserRole?: AccessLevel | null | undefined
}

const TaskComments = ({ taskId, comments, currentUserId, currentUserRole }: TaskCommentProps) => {
    const workspaceId = useWorkspaceId();
    const projectId = useProjectId();
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        const trimmedComment = newComment.trim();
        if (!trimmedComment || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await createComment(
                trimmedComment,
                taskId,
                projectId,
                workspaceId
            );

            if ("error" in response) {
                toast.error(response.error || "Failed to post comment");
                return;
            }
            setNewComment("");
            toast.success("Comment posted!");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <Card className="shadow-none">
            <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Textarea
                        placeholder="Add a comment..."
                        className="min-h-25 resize-none focus-visible:ring-primary/20"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={isSubmitting || !newComment.trim()}
                            onClick={handleSubmit}
                            className='cursor-pointer px-6 text-sm'
                            size="sm"
                        >
                            {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                    </div>
                </div>
                <div className="pt-2">
                    <CommentList
                        comments={comments}
                        currentUserId={currentUserId}
                        currentUserRole={currentUserRole}
                        workspaceId={workspaceId}
                        projectId={projectId}
                        taskId={taskId}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default TaskComments;
