'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Comment, User } from '@prisma/client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useWorkSpaceId } from '@/hooks/UseWorkspaceId';
import { useProjectId } from '@/hooks/UseProjectId';
import { useRouter } from 'next/navigation';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CommentList } from '../project/comment-lists';

type CommentWithUsers = Comment & { user: User }
interface TaskCommentProps {
    taskId: string
    comments: CommentWithUsers[]
}

const TaskComments = ({ taskId, comments }: TaskCommentProps) => {
    const workspaceId = useWorkSpaceId();
    const projectId = useProjectId();
    const router = useRouter();
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleSubmit = async () => {

    }
    return (
        <Card>
           <CardHeader>
          <CardTitle>Comments</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
            <div className="space-y-4">
                <Textarea 
                placeholder="Add a comment..."
                className="min-h-[100px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                />
                <Button disabled={isSubmitting} onClick={handleSubmit}>
                    Post Comment
                </Button>
            </div>
            <CommentList comments={comments as any} />
           </CardContent>
        </Card>

    )
}

export default TaskComments;