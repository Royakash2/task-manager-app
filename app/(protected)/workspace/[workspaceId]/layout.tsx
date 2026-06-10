import { getUserWorkspaces } from '@/app/data/workspace/getUserWorkspace';
import AppSidebarContainer from '@/components/sidebar/AppSidebarContainer';
import type { AppSidebarDataProps } from '@/components/sidebar/AppSidebarContainer';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { WorkspaceNavbar } from '@/components/workspace/navbar';
import { redirect } from 'next/navigation';
import React from 'react'
interface Props {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

const workspaceLayout = async ({ children, params }: Props) => {
  const { data } = await getUserWorkspaces();
  const { workspaceId } = await params;


  if (data?.onboardingCompleted && data?.workspaces?.length === 0) {
    redirect("/create-workspace");
  } else if (!data?.onboardingCompleted) {
    redirect("/onboarding");
  }
  
  if (data?.workspaces && !data.workspaces.some((w) => w.workspaceId === workspaceId)) {
    redirect("/workspace");
  }
  return (
    <SidebarProvider>
     <div className='flex w-full bg-sidebar h-screen'>
      <AppSidebarContainer data={data as unknown as AppSidebarDataProps} workspaceId={workspaceId}/>
      <main className='w-full overflow-y-auto min-h-screen bg-background'>
      <div className='sticky top-0 z-50  border-b flex items-center bg-background'>
        <SidebarTrigger className='px-4 cursor-pointer z-50 '/>
        <WorkspaceNavbar />
      </div>
      <div className='p-0 md:p-4 pt-2 lg:p-4'>
        {children}
        
      </div>
     </main>
     </div>
     
    </SidebarProvider>
  )
}

export default workspaceLayout;