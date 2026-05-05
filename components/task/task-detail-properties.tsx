'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { UserIcon, CircleDashed, Flag, CalendarPlus, CalendarClock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TaskStatus, TaskPriority } from '@prisma/client'; 

interface TaskDetailPropertiesProps {
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  assigneeName?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  workspaceMembers?: Array<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }>;
  onStatusChange?: (status: TaskStatus) => Promise<void>;
  onPriorityChange?: (priority: TaskPriority) => Promise<void>;
  onAssigneeChange?: (assigneeId: string | null) => Promise<void>;
  onStartDateChange?: (date: Date | null) => Promise<void>;
  onDueDateChange?: (date: Date | null) => Promise<void>;
}

export const TaskDetailProperties = ({
  status,
  priority,
  assigneeId,
  assigneeName,
  startDate,
  dueDate,
  workspaceMembers = [],
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onStartDateChange,
  onDueDateChange,
}: TaskDetailPropertiesProps) => {
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLoadingPriority, setIsLoadingPriority] = useState(false);
  const [isLoadingAssignee, setIsLoadingAssignee] = useState(false);
  const [isLoadingStartDate, setIsLoadingStartDate] = useState(false);
  const [isLoadingDueDate, setIsLoadingDueDate] = useState(false);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange && newStatus !== status) {
      setIsLoadingStatus(true);
      try {
        await onStatusChange(newStatus as TaskStatus);
      } finally {
        setIsLoadingStatus(false);
      }
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority: string) => {
    if (onPriorityChange && newPriority !== priority) {
      setIsLoadingPriority(true);
      try {
        await onPriorityChange(newPriority as TaskPriority);
      } finally {
        setIsLoadingPriority(false);
      }
    }
  };

  // Handle assignee change
  const handleAssigneeChange = async (newAssigneeId: string) => {
    if (onAssigneeChange) {
      setIsLoadingAssignee(true);
      try {
        await onAssigneeChange(newAssigneeId === 'unassigned' ? null : newAssigneeId);
      } finally {
        setIsLoadingAssignee(false);
      }
    }
  };

  // Handle start date change
  const handleStartDateChange = async (date: Date | undefined) => {
    if (onStartDateChange) {
      setIsLoadingStartDate(true);
      try {
        await onStartDateChange(date || null);
      } finally {
        setIsLoadingStartDate(false);
      }
    }
  };

  // Handle due date change
  const handleDueDateChange = async (date: Date | undefined) => {
    if (onDueDateChange) {
      setIsLoadingDueDate(true);
      try {
        await onDueDateChange(date || null);
      } finally {
        setIsLoadingDueDate(false);
      }
    }
  };

  return (
    <div className='bg-background dark:bg-slate-900/40 rounded-xl border border-border/50 p-5 space-y-5 shadow-sm backdrop-blur-sm'>
      <h3 className='font-semibold text-base text-foreground'>Properties</h3>

      <div className='flex flex-col gap-1'>
        {/* Status */}
        <div className='flex items-center min-h-10 group'>
          <div className='w-32 shrink-0 flex items-center text-sm text-muted-foreground'>
            <CircleDashed className='w-4 h-4 mr-2' />
            Status
          </div>
          <div className='flex-1 min-w-0'>
            <Select value={status} onValueChange={handleStatusChange} disabled={isLoadingStatus}>
              <SelectTrigger className='h-8 w-full border-transparent bg-transparent hover:bg-muted/50 hover:border-border focus:ring-0 shadow-none transition-all'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TODO'>To Do</SelectItem>
                <SelectItem value='IN_PROGRESS'>In Progress</SelectItem>
                <SelectItem value='IN_REVIEW'>In Review</SelectItem>
                <SelectItem value='COMPLETED'>Completed</SelectItem>
                <SelectItem value='BACKLOG'>Backlog</SelectItem>
                <SelectItem value='BLOCKED'>Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Priority */}
        <div className='flex items-center min-h-10 group'>
          <div className='w-32 shrink-0 flex items-center text-sm text-muted-foreground'>
            <Flag className='w-4 h-4 mr-2' />
            Priority
          </div>
          <div className='flex-1 min-w-0'>
            <Select value={priority} onValueChange={handlePriorityChange} disabled={isLoadingPriority}>
              <SelectTrigger className='h-8 w-full border-transparent bg-transparent hover:bg-muted/50 hover:border-border focus:ring-0 shadow-none transition-all'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LOW'>Low</SelectItem>
                <SelectItem value='MEDIUM'>Medium</SelectItem>
                <SelectItem value='HIGH'>High</SelectItem>
                <SelectItem value='CRITICAL'>Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assignee */}
        <div className='flex items-center min-h-10 group'>
          <div className='w-32 shrink-0 flex items-center text-sm text-muted-foreground'>
            <UserIcon className='w-4 h-4 mr-2' />
            Assignee
          </div>
          <div className='flex-1 min-w-0'>
            <Select
              value={assigneeId || 'unassigned'}
              onValueChange={handleAssigneeChange}
              disabled={isLoadingAssignee}
            >
              <SelectTrigger className='h-8 w-full border-transparent bg-transparent hover:bg-muted/50 hover:border-border focus:ring-0 shadow-none transition-all'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='unassigned'>Unassigned</SelectItem>
                {workspaceMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Start Date */}
        <div className='flex items-center min-h-10 group'>
          <div className='w-32 shrink-0 flex items-center text-sm text-muted-foreground'>
            <CalendarPlus className='w-4 h-4 mr-2' />
            Start Date
          </div>
          <div className='flex-1 flex items-center gap-2 min-w-0'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className={cn(
                    'h-8 w-full justify-start text-left font-normal border border-transparent hover:border-border hover:bg-muted/50 focus:ring-0 shadow-none transition-all px-3',
                    !startDate && 'text-muted-foreground'
                  )}
                  disabled={isLoadingStartDate}
                >
                  {startDate ? format(new Date(startDate), 'MMM d, yyyy') : 'Empty'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={handleStartDateChange}
                  disabled={(date) =>
                    dueDate ? date > new Date(dueDate) : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Due Date */}
        <div className='flex items-center min-h-10 group'>
          <div className='w-32 shrink-0 flex items-center text-sm text-muted-foreground'>
            <CalendarClock className='w-4 h-4 mr-2' />
            Due Date
          </div>
          <div className='flex-1 flex items-center gap-2 min-w-0'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className={cn(
                    'h-8 w-full justify-start text-left font-normal border border-transparent hover:border-border hover:bg-muted/50 focus:ring-0 shadow-none transition-all px-3',
                    !dueDate && 'text-muted-foreground'
                  )}
                  disabled={isLoadingDueDate}
                >
                  {dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Empty'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={dueDate ? new Date(dueDate) : undefined}
                  onSelect={handleDueDateChange}
                  disabled={(date) =>
                    startDate ? date < new Date(startDate) : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

      </div>

      {/* Days Remaining */}
      {dueDate && (
        <div className='mt-6 pt-4 border-t border-border/50'>
          <div className='flex items-center justify-between text-sm'>
             <span className='text-muted-foreground'>Time Remaining</span>
             <span className={cn(
                 "font-medium", 
                 Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
             )}>
               {Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
             </span>
          </div>
        </div>
      )}
    </div>
  );
};
