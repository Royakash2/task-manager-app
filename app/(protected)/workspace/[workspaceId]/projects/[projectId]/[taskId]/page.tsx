import { getTaskById } from '@/app/data/project/get-task-by-id';
import { TaskDetailHeader } from '@/components/task/task-detail-header';
import { TaskDetailProperties } from '@/components/task/task-detail-properties';
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
  const { task } = await getTaskById(taskId);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950'>
      {/* Header */}
      <TaskDetailHeader
        taskTitle={task.title}
        taskId={taskId}
        projectId={projectId}
        projectName={task.project.name}
        workspaceId={workspaceId}
      />

      {/* Main Content */}
      <div className='flex-1 py-6 px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Content Area (2/3) */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6'>
              <h1 className='text-3xl font-bold mb-4 text-gray-900 dark:text-white'>{task.title}</h1>
              <p className='text-gray-600 dark:text-gray-400'>{task.description}</p>
            </div>
          </div>

          {/* Right Sidebar (1/3) */}
          <div className='lg:col-span-1 space-y-6'>
            <TaskDetailProperties
              status={task.status}
              priority={task.priority}
              assigneeId={task.assigneeId}
              assigneeName={task.assigneeTo?.name}
              startDate={task.startDate}
              dueDate={task.dueDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
