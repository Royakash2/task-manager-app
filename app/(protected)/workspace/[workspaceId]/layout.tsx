import { getUserWorkspaces } from '@/app/workspace/getUserWorkspace';
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
      <AppSidebarContainer data={data} workspaceId={workspaceId}/>
     </div>
     <main className='w-full overflow-y-auto min-h-screen'>
      <div className='flex items-start'>
        <SidebarTrigger className='pt-3'/>
      </div>
     </main>
    </SidebarProvider>
  )
}

export default workspaceLayout;