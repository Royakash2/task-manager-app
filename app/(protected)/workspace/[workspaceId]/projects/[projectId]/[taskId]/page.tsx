import { getTaskById } from '@/app/data/task/get-task-by-id';
import TaskComments from '@/components/task/task-comments';
import TaskDetails from '@/components/task/task-details';
import { redirect } from 'next/navigation';
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
  const { task, comments } = await getTaskById(taskId, workspaceId, projectId);

  if (!task) redirect("not-found");

  return (
    <div className='flex flex-col lg:flex-row gap-6 md:px-6 pb-6 min-h-screen bg-background'>
      <div className='flex-1'>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
       <TaskDetails task={task as any} />
      </div>
     <div className='w-full lg:w-[400px]'>
      <TaskComments taskId={taskId}comments={comments}/>
     </div>
    </div>
  );
}

export default TaskDetailPage;
