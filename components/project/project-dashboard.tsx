import {  projectProps } from '@/utils/types';
import { Task } from '@prisma/client';
import React from 'react'
import { ProjectHeader } from './project-header';
import { Card } from '../ui/card';
import TaskDistributionChart from './task-distrubution-chart';
import { Activity, ActivityFeed } from './activity-feed';
import { CommentList, CommentProps } from './comment-lists';


interface ProjectDashboardProps {
    project: projectProps;
    tasks: {
        completed: number;
        inProgress: number;
        overdue: number;
        total: number;
        items: Task[]
    };
    activities: Activity[];
    totalWorkspaceMembers: number;
    comments: CommentProps[];
}

const ProjectDashboard = ({
    project,
    tasks,
    activities,
    comments,

}: ProjectDashboardProps) => {
    return (
        <div className='flex flex-col gap-6 2xl:px-6 py-0'>
           <ProjectHeader
           project={project}
           
           />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {/* TODO : cricle progress */}
               {/* <Card></Card> */}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <TaskDistributionChart tasks={tasks}/>
               
               <Card className='p-2'>
                   <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                   <ActivityFeed activities={activities.slice(0, 5)}/>
               </Card>
               <Card className='p-2'>
                   <h3 className="text-lg font-semibold mb-4">Recent Comments</h3>
                   <CommentList comments={comments.slice(0, 5) }/>
               </Card>
           </div>
        </div>
    )
}

export default ProjectDashboard;