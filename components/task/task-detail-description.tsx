'use client'

import { useState } from 'react';
import { FileText, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TaskDetailDescriptionProps {
  initialDescription?: string | null;
  onDescriptionUpdate?: (description: string) => Promise<void>;
  isEditable?: boolean;
}

/**
 * TaskDetailDescription Component
 * Displays and manages the task description with edit functionality
 */
export const TaskDetailDescription = ({
  initialDescription,
  onDescriptionUpdate,
  isEditable = true,
}: TaskDetailDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setDescription(initialDescription || '');
    setIsEditing(false);
    setError(null);
  };

  // Handle save
  const handleSave = async () => {
    if (!onDescriptionUpdate) return;

    setIsSaving(true);
    setError(null);

    try {
      await onDescriptionUpdate(description);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update description');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if description is empty
  const isEmpty = !description || description.trim() === '';

  return (
    <div className='bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <FileText className='w-5 h-5 text-gray-600 dark:text-gray-400' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Description
          </h3>
        </div>

        {/* Edit Button */}
        {!isEditing && isEditable && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleEdit}
            className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          >
            <Edit2 className='w-4 h-4 mr-1' />
            Edit
          </Button>
        )}
      </div>

      {/* View Mode */}
      {!isEditing && (
        <div className='space-y-4'>
          {isEmpty ? (
            <div className='bg-gray-50 dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-700 rounded p-6 text-center'>
              <FileText className='w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-2' />
              <p className='text-gray-500 dark:text-gray-400 text-sm'>
                No description provided
              </p>
              {isEditable && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleEdit}
                  className='mt-3 dark:border-slate-700 dark:hover:bg-slate-800'
                >
                  Add description
                </Button>
              )}
            </div>
          ) : (
            <div className='prose dark:prose-invert max-w-none'>
              <p className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap wrap-break-word leading-relaxed'>
                {description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className='space-y-4'>
          <div className='relative'>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Write a detailed description of what needs to be done...'
              className='w-full min-h-48 resize-none bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
              disabled={isSaving}
            />
            <div className='absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400'>
              {description.length} characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3'>
              <p className='text-sm text-red-700 dark:text-red-200'>
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
            >
              <Save className='w-4 h-4 mr-2' />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={isSaving}
              className='dark:border-slate-700 dark:hover:bg-slate-800'
            >
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
          </div>

          {/* Character Info */}
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Tip: Use clear and detailed descriptions to help team members understand the task requirements.
          </p>
        </div>
      )}
    </div>
  );
};
