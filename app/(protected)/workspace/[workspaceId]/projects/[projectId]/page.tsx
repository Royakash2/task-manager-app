import { getProjectDetails } from '@/app/data/project/get-project-details';
import ProjectDashboard from '@/components/project/project-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { commentProps } from '@/utils/types';
import Link from 'next/link';
import React from 'react'
interface ProjectPageProps {
    params: Promise<{ workspaceId: string; projectId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProjectPage = async (props: ProjectPageProps) => {
    const { workspaceId, projectId } = await props.params;
    const searchParams = await props.searchParams;
    const { project, tasks, activities, totalWorkspaceMembers, comments } = await getProjectDetails(workspaceId, projectId)
    return (
        <div className='flex flex-col pb-3 px-3'>
            <Tabs defaultValue={(searchParams.view as string) || 'Dashboard'}
            className='w-full'>
                <TabsList>
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
                  project={project}
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 tasks={tasks as any}
                 activities={activities!}
                 totalWorkspaceMembers={totalWorkspaceMembers!}
                 comments={comments as commentProps[]}
                  />
                </TabsContent>
                <TabsContent value='Table'>
                    {/* <Table /> */}
                    table
                </TabsContent>
                <TabsContent value='Kanban'>
                    {/* <Kanban /> */}
                    kanban
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default ProjectPage;
