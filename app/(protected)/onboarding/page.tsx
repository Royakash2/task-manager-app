import { userRequired } from '@/app/data/user/get-user';
import { getUserWorkspaces } from '@/app/data/workspace/getUserWorkspace'
import { OnboardingForm } from '@/components/OnboardingForm';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function OnboardingPage() {
    const { data } = await getUserWorkspaces();
    const {user} = await userRequired();
    if(data?.onboardingCompleted && data?.workspaces.length > 0){
        redirect('/workspace')
    }else if(data?.onboardingCompleted ){
        redirect('/create-workspace')
    }
    const name = `${user?.given_name || ''} ${user?.family_name || ''}`;
    return (
        <div>
        <OnboardingForm
         name={name}
         email={user?.email || ''}
         image={user?.picture|| ''}
        />
        </div>
      
    )
}