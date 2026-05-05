'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskDetailHeaderProps {
  taskTitle: string;
  taskId: string;
  projectId: string;
  projectName: string;
  workspaceId: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

/**
 * TaskDetailHeader Component
 * Displays the header of the task detail page with navigation, breadcrumbs, and actions
 */
export const TaskDetailHeader = ({
  taskTitle,
  taskId,
  projectId,
  projectName,
  workspaceId,
  onDelete,
  onEdit,
}: TaskDetailHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className='flex items-center justify-between py-4 px-6 border-b bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800'>
      {/* Left Section - Back Button & Breadcrumbs */}
      <div className='flex items-center gap-4'>
        {/* Back Button */}
        <Button
          variant='ghost'
          size='icon'
          onClick={handleBack}
          className='hover:bg-gray-100 dark:hover:bg-slate-800'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>

        {/* Breadcrumbs */}
        <nav className='flex items-center gap-2 text-sm'>
          {/* Workspace Link */}
          <Link
            href={`/workspace/${workspaceId}`}
            className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            Workspace
          </Link>

          <span className='text-gray-400 dark:text-gray-600'>/</span>

          {/* Project Link */}
          <Link
            href={`/workspace/${workspaceId}/projects/${projectId}`}
            className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            {projectName}
          </Link>

          <span className='text-gray-400 dark:text-gray-600'>/</span>

          {/* Current Task (Non-clickable) */}
          <span className='text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs'>
            {taskTitle}
          </span>
        </nav>
      </div>

      {/* Right Section - Actions Menu */}
      <div className='flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-gray-100 dark:hover:bg-slate-800'
            >
              <MoreVertical className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800'>
            {onEdit && (
              <DropdownMenuItem className='dark:hover:bg-slate-800 cursor-pointer' onClick={onEdit}>
                ✏️ Edit Task
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild className='dark:hover:bg-slate-800 cursor-pointer'>
              <Link
                href={`/workspace/${workspaceId}/projects/${projectId}/${taskId}`}
              >
                👁️ View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='dark:hover:bg-slate-800 cursor-pointer'>
              🔗 Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem className='dark:hover:bg-slate-800 cursor-pointer'>
              ⭐ Add to Favorites
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuItem className='border-t border-gray-200 dark:border-slate-800 pt-1 mt-1 dark:hover:bg-slate-800 cursor-pointer'>
                  <button
                    onClick={onDelete}
                    className='text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 w-full text-left'
                  >
                    🗑️ Delete Task
                  </button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
