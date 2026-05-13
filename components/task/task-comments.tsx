'use client';
import { CommentProps } from '@/utils/types';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useWorkSpaceId } from '@/hooks/UseWorkspaceId';
import { useProjectId } from '@/hooks/UseProjectId';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CommentList } from '../project/comment-lists';
import { createComment } from '@/app/actions/comment';
import { toast } from 'sonner';

interface TaskCommentProps {
    taskId: string
    comments: CommentProps[]
}

const TaskComments = ({ taskId, comments }: TaskCommentProps) => {
    const workspaceId = useWorkSpaceId();
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

            if (response.success) {
                setNewComment("");
                toast.success("Comment posted!");
            } else {
                toast.error(response.error || "Failed to post comment");
            }
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
        <Card className="shadow-sm border-muted-foreground/10">
            <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[100px] resize-none focus-visible:ring-primary/20"
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
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </div>
                <div className="pt-2">
                    <CommentList comments={comments} />
                </div>
            </CardContent>
        </Card>
    )
}

export default TaskComments;
