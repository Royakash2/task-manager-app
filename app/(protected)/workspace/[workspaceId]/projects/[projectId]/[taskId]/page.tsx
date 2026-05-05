import { getTaskById } from '@/app/data/project/get-task-by-id';
import React from 'react'

interface TaskDetailPageProps {
  params: Promise<{ 
    workspaceId: string; 
    projectId: string;
    taskId: string;
  }>;
}

const TaskDetailPage = async (props: TaskDetailPageProps) => {
  const { taskId } = await props.params;
  const { task } = await getTaskById(taskId);

  return (
    <div className='flex flex-col pb-3 px-3'>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Assigned To: {task.assigneeTo?.name || "Unassigned"}</p>
    </div>
  )
}

export default TaskDetailPage;
