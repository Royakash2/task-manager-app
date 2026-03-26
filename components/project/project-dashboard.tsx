import { commentProps } from '@/utils/types';
import { Activity, Task } from '@prisma/client';
import React from 'react'

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

const ProjectDashboard = () => {
    return (
        <div>

        </div>
    )
}

export default ProjectDashboard;