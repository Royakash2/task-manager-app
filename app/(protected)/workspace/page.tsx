import { getUserWorkspaces } from '@/app/workspace/getUserWorkspace'
import { redirect } from 'next/navigation';


export default async function WorkspacePage() {
    const { data } = await getUserWorkspaces()
    if(data?.onboardingCompleted && data?.workspaces.length === 0){
        redirect('/create-workspace')
    } else if(!data?.onboardingCompleted ){
        redirect('/onboarding')
    }else{
        redirect(`/workspace/${data?.workspaces[0].workspaceId}`)
    }
}


