'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
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

/**
 * TaskDetailProperties Component
 * Displays and manages task properties in the sidebar (status, priority, assignee, dates)
 */
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

  // Helper function to get status color
  const getStatusColor = (s: TaskStatus) => {
    switch (s) {
      case 'TODO':
        return 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'IN_REVIEW':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'BACKLOG':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'BLOCKED':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200';
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'LOW':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'CRITICAL':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200';
    }
  };

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
    <div className='bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6 space-y-6'>
      <h3 className='font-semibold text-lg text-gray-900 dark:text-white'>
        Task Properties
      </h3>

      {/* Status */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Status
        </label>
        <Select value={status} onValueChange={handleStatusChange} disabled={isLoadingStatus}>
          <SelectTrigger className='w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='TODO'>📝 To Do</SelectItem>
            <SelectItem value='IN_PROGRESS'>🔄 In Progress</SelectItem>
            <SelectItem value='IN_REVIEW'>👀 In Review</SelectItem>
            <SelectItem value='COMPLETED'>✅ Completed</SelectItem>
            <SelectItem value='BACKLOG'>📋 Backlog</SelectItem>
            <SelectItem value='BLOCKED'>🚫 Blocked</SelectItem>
          </SelectContent>
        </Select>
        <div className='pt-1'>
          <Badge className={cn('text-xs', getStatusColor(status))}>
            {status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      {/* Priority */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Priority
        </label>
        <Select value={priority} onValueChange={handlePriorityChange} disabled={isLoadingPriority}>
          <SelectTrigger className='w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='LOW'>🟢 Low</SelectItem>
            <SelectItem value='MEDIUM'>🟡 Medium</SelectItem>
            <SelectItem value='HIGH'>🟠 High</SelectItem>
            <SelectItem value='CRITICAL'>🔴 Critical</SelectItem>
          </SelectContent>
        </Select>
        <div className='pt-1'>
          <Badge className={cn('text-xs', getPriorityColor(priority))}>
            {priority}
          </Badge>
        </div>
      </div>

      {/* Assignee */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Assigned To
        </label>
        <Select
          value={assigneeId || 'unassigned'}
          onValueChange={handleAssigneeChange}
          disabled={isLoadingAssignee}
        >
          <SelectTrigger className='w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='unassigned'>👤 Unassigned</SelectItem>
            {workspaceMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {assigneeName && (
          <div className='pt-1'>
            <Badge variant='secondary' className='dark:bg-slate-800'>
              {assigneeName}
            </Badge>
          </div>
        )}
      </div>

      {/* Start Date */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Start Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700',
                !startDate && 'text-gray-500 dark:text-gray-400'
              )}
              disabled={isLoadingStartDate}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? format(new Date(startDate), 'MMM d, yyyy') : 'Pick a date'}
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
        {startDate && (
          <button
            onClick={() => handleStartDateChange(undefined)}
            className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
          >
            Clear date
          </button>
        )}
      </div>

      {/* Due Date */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Due Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700',
                !dueDate && 'text-gray-500 dark:text-gray-400'
              )}
              disabled={isLoadingDueDate}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Pick a date'}
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
        {dueDate && (
          <button
            onClick={() => handleDueDateChange(undefined)}
            className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
          >
            Clear date
          </button>
        )}
      </div>

      {/* Days Remaining */}
      {dueDate && (
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3'>
          <p className='text-sm text-blue-800 dark:text-blue-200'>
            <span className='font-semibold'>
              {Math.ceil(
                (new Date(dueDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </span>{' '}
            days remaining
          </p>
        </div>
      )}
    </div>
  );
};
