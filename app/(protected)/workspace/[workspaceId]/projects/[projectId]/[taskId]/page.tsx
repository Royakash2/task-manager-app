import { getTaskById } from '@/app/data/task/get-task-by-id';
import { getUserRole } from '@/lib/permissions';
import TaskComments from '@/components/task/task-comments';
import TaskDetails from '@/components/task/task-details';
import { NotFoundState } from '@/components/not-found-state';
import React from 'react'

interface TaskDetailPageProps {
  params: Promise<{ 
    workspaceId: string; 
    projectId: string;
    taskId: string;
  }>;
}

const TaskDetailPage = async (props: TaskDetailPageProps) => {
  const { taskId, workspaceId, projectId } = await props.params;
  const result = await getTaskById(taskId, workspaceId, projectId);

  if ("error" in result) {
    return (
      <NotFoundState
        title="Task not found"
        description="This task may have been deleted or you may not have access to it."
      />
    );
  }

  const { task, comments, documentation, currentUserId } = result;

  if (!task) {
    return (
      <NotFoundState
        title="Task not found"
        description="This task may have been deleted or you may not have access to it."
      />
    );
  }

  const currentUserRole = await getUserRole(currentUserId, workspaceId);

  return (
    <div className='flex flex-col lg:flex-row gap-4 lg:h-screen lg:overflow-hidden bg-background'>
      <div className='flex-1 lg:overflow-y-auto no-scrollbar'>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
       <TaskDetails task={task as any} documentation={documentation} currentUserRole={currentUserRole} />
      </div>
     <div className='w-full lg:w-100 lg:overflow-y-auto no-scrollbar'>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TaskComments taskId={taskId} comments={comments as any} currentUserId={currentUserId} currentUserRole={currentUserRole} />
     </div>
    </div>
  );
}

export default TaskDetailPage;
