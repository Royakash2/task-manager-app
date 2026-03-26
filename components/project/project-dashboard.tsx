import { commentProps, projectProps } from '@/utils/types';
import { Activity, Task } from '@prisma/client';
import React from 'react'
import { ProjectHeader } from './project-header';

interface ProjectDashboardProps {
    project: Project;
    tasks: {
        completed: number;
        inProgress: number;
        overdue: number;
        total: number;
        items: Task[]
    };
    activities: Activity[];
    totalWorkspaceMembers: number;
    comments: commentProps[];
}

const ProjectDashboard = ({
    project,
    tasks,
    activities,
    totalWorkspaceMembers,
    comments
}: ProjectDashboardProps) => {
    return (
        <div className='flex flex-col gap-6 2xl:px-6 py-0'>
           <ProjectHeader
           project={project}
           
           />
        </div>
    )
}

export default ProjectDashboard;