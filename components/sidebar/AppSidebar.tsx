
import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { User } from '@prisma/client'
import { projectProps, workspaceMembersProps } from '@/utils/types'
import { Sidebar, SidebarGroupLabel, SidebarHeader } from '../ui/sidebar'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
            <div className='flex justify-between gap-0'>
                <SidebarGroupLabel className='mb-2 uppercase text-sm text-muted-foreground font-semibold'>
                    Workspace
                </SidebarGroupLabel>
                <Button variant='outline' size='icon' asChild>
                    <Link href='/create-workspace'>
                       <Plus/>
                    </Link>
                </Button>
            </div>
        </SidebarHeader>
       </Sidebar>
       </> 
    )
}

export default AppSidebar