import { Comment } from '@prisma/client'
import React from 'react'

const TaskComments = ({ taskId, comments }: { taskId: string, comments: Comment[] }) => {
  return (
    <div>task-comments</div>

  )
}

export default TaskComments