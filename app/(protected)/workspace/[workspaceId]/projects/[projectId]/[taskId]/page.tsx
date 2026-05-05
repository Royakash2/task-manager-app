import React from 'react'

interface TaskDetailPageProps {
  params: Promise<{ 
    workspaceId: string; 
    projectId: string;
    taskId: string;
  }>;
}

const TaskDetailPage = async (props: TaskDetailPageProps) => {
  const { workspaceId, projectId, taskId } = await props.params;

  return (
    <div className='flex flex-col pb-3 px-3'>
      <h1>Task Detail Page</h1>
      <p>Workspace: {workspaceId}</p>
      <p>Project: {projectId}</p>
      <p>Task: {taskId}</p>
    </div>
  )
}

export default TaskDetailPage;
