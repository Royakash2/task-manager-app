import { getUserWorkspaces } from '@/app/data/workspace/getUserWorkspace';
import AppSidebarContainer from '@/components/sidebar/AppSidebarContainer';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import React from 'react'
interface Props {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

const workspaceLayout = async ({ children, params }: Props) => {
  const { data } = await getUserWorkspaces();
  const { workspaceId } = await params;


  if (data?.onboardingCompleted && !data?.workspaces) {
    redirect("/create-workspace");
  } else if (!data?.onboardingCompleted) {
    redirect("/onboarding");
  }
  return (
    <SidebarProvider>
     <div className='flex w-full bg-background h-screen'>
      <AppSidebarContainer data={data as any} workspaceId={workspaceId}/>
      <main className='w-full overflow-y-auto min-h-screen'>
      <div className='flex items-start'>
        <SidebarTrigger className='p-6 cursor-pointer'/>
        {/* <Navbar 
        id={data?.id}
        name={data?.name as string}
        email={data?.email as string}
        image={data?.image as string}
        /> */}
      </div>
      <div className='p-0 md:p-4 pt-2 lg:p-6'>
        {children}
      </div>
     </main>
     </div>
     
    </SidebarProvider>
  )
}

export default workspaceLayout;