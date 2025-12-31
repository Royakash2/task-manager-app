import { getUserWorkspaces } from '@/app/workspace/getUserWorkspace'
import { Button } from '@/components/ui/button'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function OnboardingPage() {
    const { data } = await getUserWorkspaces();
    if(data?.onboardingCompleted && data?.workspaces.length > 0){
        redirect('/workspace')
    }else if(data?.onboardingCompleted ){
        redirect('/create-workspace')
    }
    return (
        <div>
            <h1 className='text-4xl font-bold'>onboarding page</h1>
             <Button> <LogoutLink>Log out</LogoutLink></Button>
        </div>
      
    )
}