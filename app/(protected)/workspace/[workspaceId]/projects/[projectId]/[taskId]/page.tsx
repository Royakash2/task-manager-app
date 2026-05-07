import { getTaskById } from '@/app/data/task/get-task-by-id';
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
  const { task } = await getTaskById(taskId, workspaceId, projectId);
  console.log('task',task);
  

  return (
    <div className='flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950'>
      {/* Header */}
      task detail page
    </div>
  );
}

export default TaskDetailPage;
