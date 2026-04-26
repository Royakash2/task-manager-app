
'use client'

import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { User } from '@prisma/client'
import { projectProps, workspaceMembersProps } from '@/utils/types'
import { Sidebar, SidebarContent, SidebarGroupLabel, SidebarHeader, useSidebar } from '../ui/sidebar'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import WorkspaceSelector from './WorkspaceSelector'
import { NavMain } from './NavMain'
import { NavProject } from './NavProject'
import { Logo } from '../Logo'

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
    const { state } = useSidebar()

    return (
        <>
            <Sidebar collapsible='icon' >
                <SidebarHeader className='bg-background'>
                    <div className='px-2 py-2 group-data-[collapsible=icon]:hidden'>
                        <Logo />
                    </div>
                    <div className='hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 mt-1'>
                        <span className="text-2xl font-bold tracking-tight font-mono">V</span>
                    </div>
                    <div className='flex justify-between items-center gap-0 group-data-[collapsible=icon]:hidden'>
                        <SidebarGroupLabel className='mb-2 uppercase text-sm text-muted-foreground font-semibold'>
                            Workspace
                        </SidebarGroupLabel>
                        {state === 'expanded' && (
                            <Button variant='outline' size='icon' asChild className='size-5 mr-2'>
                                <Link href='/create-workspace'>
                                    <Plus />
                                </Link>
                            </Button>
                        )}
                    </div>
                    <WorkspaceSelector workspaces={data.workspaces} />
                </SidebarHeader>
                <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">    
                    <NavMain/>
                    <NavProject projects={project} workspaceMembers={workspaceMembers} />
                </SidebarContent>
            </Sidebar>
        </>
    )
}

export default AppSidebar;