import { getProjectDetails } from '@/app/data/project/get-project-details';
import KanbanBoardContainer from '@/components/project/kanban-board-container';
import { ProjectHeader } from '@/components/project/project-header';
import ProjectDashboard from '@/components/project/project-dashboard';
import { ProjectTableContainer } from '@/components/project/project-table-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CommentProps, projectProps, ProjectTaskProps } from '@/utils/types';
import { userRequired } from '@/app/data/user/get-user';
import { getUserRole } from '@/lib/permissions';
import Link from 'next/link';
import React from 'react'
interface ProjectPageProps {
    params: Promise<{ workspaceId: string; projectId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProjectPage = async (props: ProjectPageProps) => {
    const { workspaceId, projectId } = await props.params;
    const searchParams = await props.searchParams;
    const { user } = await userRequired();
    const currentUserRole = await getUserRole(user.id, workspaceId);
    const result = await getProjectDetails(workspaceId, projectId)
    return (
        <div className='flex flex-col pb-3 px-3'>
            <ProjectHeader project={result.project as projectProps} currentUserRole={currentUserRole} />
            <Tabs defaultValue={(searchParams.view as string) || 'Dashboard'}
            className='w-full'>
                <TabsList className='mt-4'>
                    <Link href={`?view=Dashboard`}>
                      <TabsTrigger className='px-1.5 md:px-3' value='Dashboard'>Dashboard</TabsTrigger>
                    </Link>
                    <Link href={`?view=Table`}>
                      <TabsTrigger className='px-1.5 md:px-3' value='Table'>Table</TabsTrigger>
                    </Link>
                    <Link href={`?view=Kanban`}>
                      <TabsTrigger className='px-1.5 md:px-3' value='Kanban'>Kanban</TabsTrigger>
                    </Link>
                </TabsList>
                <TabsContent value='Dashboard'>
                  <ProjectDashboard
                  project={result.project as projectProps}
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 tasks={result.tasks as any}
                 activities={result.activities as Activity[]}
                 totalWorkspaceMembers={result.totalWorkspaceMembers!}
                 comments={result.comments as CommentProps[]}
                  />
                </TabsContent>
                <TabsContent value='Table'>
                  <ProjectTableContainer
                  projectId={projectId}
                  currentUserRole={currentUserRole}
                  />
                </TabsContent>
                <TabsContent value='Kanban'>
                  <KanbanBoardContainer initialTasks={result.tasks?.items as unknown as ProjectTaskProps[]} currentUserRole={currentUserRole} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default ProjectPage;
