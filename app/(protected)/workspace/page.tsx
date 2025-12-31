import { getUserWorkspaces } from '@/app/workspace/getUserWorkspace'
import React from 'react'

const WorkspacePage = async () => {
    const {data} = await getUserWorkspaces()
    if(!data) return null;
    if(data.onboardingCompleted){
    
    }
        return (
            <div>
                <h1 className='text-4xl font-bold'>Workspace page</h1>
            </div>
      
    )
}

export default WorkspacePage;
