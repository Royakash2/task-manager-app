import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import React from 'react'
interface ProjectPageProps {
    params: Promise<{ workspaceId: string; projectId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProjectPage = async (props: ProjectPageProps) => {
    const { workspaceId, projectId } = await props.params;
    const searchParams = await props.searchParams;
    return (
        <div className='flex flex-col pb-3 px-3'>
            <Tabs defaultValue={(searchParams.view as string) || 'Dashboard'}
            className='w-full'>
                <TabsList>
                    <Link href={`?view=Dashboard`}>
                      <TabsTrigger className='px-1.5 md:px-3' value='Dashboard'>Dashboard</TabsTrigger>
                    </Link>
                    <Link href={`?view=Tasks`}>
                      <TabsTrigger className='px-1.5 md:px-3' value='Tasks'>Tasks</TabsTrigger>
                    </Link>
                    <Link href={`?view=Calendar`}>
                      <TabsTrigger className='px-1.5 md:px-3' value='Calendar'>Calendar</TabsTrigger>
                    </Link>
                </TabsList>
            </Tabs>
        </div>
    )
}
export default ProjectPage;
