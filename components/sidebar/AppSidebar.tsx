
import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { User } from '@prisma/client'
import { projectProps, workspaceMembersProps } from '@/utils/types'
import { Sidebar, SidebarGroupLabel, SidebarHeader } from '../ui/sidebar'
import { Avatar, AvatarImage } from '../ui/avatar'

function AppSidebar(
    { user,
        data,
        workspaceMembers,
        project
    }
        :
        {
            user: User,
            data: AppSidebarDataProps,
            workspaceMembers: workspaceMembersProps[],
            project: projectProps[]
        }) {
    return (
       <>
       <Sidebar collapsible='icon' >
        <SidebarHeader className='bg-background'>
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src={'/global.svg'} />

                </Avatar>
                <SidebarGroupLabel>
                    <span className='text-xl font-bold'>Aura</span>
                </SidebarGroupLabel>
            </div>
            <div className='flex items-center gap-0'>
                <SidebarGroupLabel>
                    <span className='text-xl font-bold'>Workspace</span>
                </SidebarGroupLabel>
            </div>
        </SidebarHeader>
       </Sidebar>
       </> 
    )
}

export default AppSidebar