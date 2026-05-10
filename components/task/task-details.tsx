import { projectProps } from '@/utils/types'
import { Task, User } from '@prisma/client'
import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { ProjectAvatar } from '../project/Project-avatar'
export interface TaskProps {
  task:Task & {
  assigneTo: User,
  project: projectProps
  }
}

const TaskDetails = ({ task }: TaskProps) => {
  return (
    <Card>
        <CardHeader className='flex flex-col md:flex-row justify-between '>
          <div >
            <CardTitle >{task.title}</CardTitle>
            <div className='flex items-center gap-2 mt-3 '>
                <ProjectAvatar name={task.project.name} />
                <p className='text-base text-muted-foreground'>
                    {task.project.name}
                </p>
                
            </div>
          </div>

        </CardHeader>
    </Card>

  )
}

export default TaskDetails