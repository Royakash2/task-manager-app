import { projectProps } from '@/utils/types'
import { File, Task, User } from '@prisma/client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ProjectAvatar } from '../project/Project-avatar'
import { ProfileAvatar } from '../profile-avatar'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'
import { Separator } from '../ui/separator'
import { EditTaskDialog } from './edit-task-dialog'
import { ImageLightboxPreview } from './image-lightbox-preview'
export interface TaskProps {
  task:Task & {
  assigneeTo: User,
  project: projectProps,
  attachments: File[]
  }
}

const TaskDetails = ({ task }: TaskProps) => {
  return (
    <Card className=' shadow-none'>
        <CardHeader className='flex flex-col gap-4'>
           <div className='flex flex-wrap justify-between w-full items-center gap-4'>
            <div className='flex items-center gap-2'>
                <ProjectAvatar name={task.project.name} />
                <p className='text-xs font-semibold text-muted-foreground'>
                    {task.project.name}
                </p>
            </div>
            <Separator orientation='vertical' className='h-5 hidden sm:block' />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Assigned To:</span>
              <ProfileAvatar
              size='sm'
                url={task.assigneeTo?.image || undefined}
                name={task.assigneeTo?.name}
              />
              <span className="text-xs font-medium">{task.assigneeTo?.name}</span>
            </div>
          </div>
          <div className='flex items-start justify-between gap-4'>
            <CardTitle className='text-xl md:text-2xl font-semibold leading-tight'>{task.title}</CardTitle>
          </div>
        </CardHeader>
        <Separator className='my-3' />
        <CardContent className="space-y-6">
          <div>
            <div className='flex items-center justify-between mb-2'>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</h4>
              <EditTaskDialog
                key={new Date().getTime()}
                task={task}
                project={task.project}
              />
            </div>
            <p className={`text-sm text-muted-foreground `}>
              {task.description || "No description provided for this task."}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge variant={task.status}>{task.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Priority</p>
                <Badge variant={task.priority}>{task.priority}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                <p className="text-sm font-medium">
                  {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4'>Attachments</h4>
            <ImageLightboxPreview 
              images={task.attachments.map((file) => ({
                id: file.id,
                name: file.name,
                url: file.url,
                type: file.type,
              }))}
            />
          </div>
        </CardContent>
    </Card>

  )
}

export default TaskDetails