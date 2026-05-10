import { projectProps } from '@/utils/types'
import { Task, User } from '@prisma/client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ProjectAvatar } from '../project/Project-avatar'
import { ProfileAvatar } from '../profile-avatar'
export interface TaskProps {
  task:Task & {
  assigneeTo: User,
  project: projectProps
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

        <CardContent>

        </CardContent>
    </Card>

  )
}

export default TaskDetails