import { projectProps, Activity, CommentProps } from '@/utils/types';
import { Task } from '@prisma/client';
import React from 'react'
import { ProjectHeader } from './project-header';
import { Card } from '../ui/card';
import TaskDistributionChart from './task-distrubution-chart';
import { ActivityFeed } from './activity-feed';
import { CommentList } from './comment-lists';
import { CircleProgress } from './circel-progress';
import { History, MessageSquare } from "lucide-react";


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
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card>
              <CircleProgress
              title="Task Completion"
              value={tasks.completed / tasks.total * 100}
              subTitle={`${tasks.completed} / ${tasks.total} tasks`}
              variant="success"
              />
              </Card>
              <Card>
              <CircleProgress
              title="Task In Progress"
              value={tasks.inProgress / tasks.total * 100}
              subTitle={`${tasks.inProgress} ongoing`}
              variant="inProgress"
              />
              </Card>
              <Card>
              <CircleProgress
              title="Task Overdue"
              value={tasks.overdue / tasks.total * 100}
              subTitle={`${tasks.overdue} overdue tasks`}
              variant="warning"
              />
              </Card>
              <Card>
              <CircleProgress
              title="Team Members"
              value={project.members.length}
              subTitle={`${project.members.length} members`}
              variant="default"
              showPercentage={false}
              />
              </Card>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <TaskDistributionChart tasks={tasks}/>
               
                <Card className='p-6 flex flex-col'>
                    <div className="flex items-center justify-between pb-6">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                            Recent Activities
                        </h3>
                        <History className="w-4 h-4 text-muted-foreground" />
                    </div>
                   <ActivityFeed activities={activities.slice(0, 5)}/>
               </Card>
                <Card className='p-6 flex flex-col'>
                    <div className="flex items-center justify-between pb-6">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                            Recent Comments
                        </h3>
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </div>
                   <CommentList comments={comments.slice(0, 5) }/>
               </Card>
           </div>
        </div>
    )
}

export default ProjectDashboard;