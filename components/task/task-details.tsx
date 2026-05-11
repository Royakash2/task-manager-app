import { projectProps } from '@/utils/types'
import { File, Task, User } from '@prisma/client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ProjectAvatar } from '../project/Project-avatar'
import { ProfileAvatar } from '../profile-avatar'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'
import { Separator } from '../ui/separator'
import Image from 'next/image'
export interface TaskProps {
  task:Task & {
  assigneeTo: User,
  project: projectProps,
  attachments: File[]
  }
}

const TaskDetails = ({ task }: TaskProps) => {
  return (
    <Card>
        <CardHeader className='flex flex-col md:flex-row justify-between items-start md:items-end '>
          <div >
            <CardTitle >{task.title}</CardTitle>
            <div className='flex items-center gap-2 mt-3 '>
                <ProjectAvatar name={task.project.name} />
                <p className='text-base text-muted-foreground'>
                    {task.project.name}
                </p>
                
            </div>
          </div>

          <div className="w-full  md:w-auto flex flex-col justify-end items-end gap-2">
            {/* <EditTaskDialog
              key={new Date().getTime()}
              task={task}
              project={task.project}
            /> */}

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Assigned To:</span>
              <ProfileAvatar
                url={task.assigneeTo?.image || undefined}
                name={task.assigneeTo?.name}
              />
              <span className="text-sm font-medium">{task.assigneeTo?.name}</span>
            </div>
          </div>

        </CardHeader>
        <Separator className='my-3' />
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {task.description || "No description"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Additional Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={task.status }>{task.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                <p className="text-sm font-medium">
                  {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
                <Badge variant={task.priority}>{task.priority}</Badge>
              </div>
            </div>
          </div>
          <div>
            <h4 className='text-sm font-semibold mb-4'>Attachments</h4>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {task.attachments.map((file: File) => (
                <div key={file.id} className="relative group cursor-pointer ">
                  <Image 
                  src={file.type === "IMAGE" ? file.url : "/pdf.png"}
                  width={100}
                  height={100}
                  alt={file.name}
                  className='w-full h-32 object-cover rounded-lg '/>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <span className="text-white text-sm">View</span>
                    </a>
                  </div>
                </div> 
              ))}
            </div>
            {task.attachments.length === 0 && (
              <div className="text-sm text-muted-foreground flex items-center h-20">
                <p>No attachments found</p>
              </div>
            )}
          </div>
        </CardContent>
    </Card>

  )
}

export default TaskDetails