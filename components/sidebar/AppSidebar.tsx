
'use client'

import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { User } from '@prisma/client'
import { projectProps, workspaceMembersProps } from '@/utils/types'
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from '../ui/sidebar'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import WorkspaceSelector from './WorkspaceSelector'
import { NavMain } from './NavMain'
import { NavProject } from './NavProject'
import { Logo } from '../Logo'
import { SidebarUserProfile } from './SidebarUserProfile'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

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
                        <Logo linkHref="/" />
                    </div>
                    <div className='hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 mt-1'>
                        <Link href="/">
                            <span className="text-2xl font-bold tracking-tight font-mono">V</span>
                        </Link>
                    </div>
                    <div className='flex items-center justify-between gap-2 group-data-[collapsible=icon]:block'>
                        <div className='flex-1'>
                            <WorkspaceSelector workspaces={data.workspaces} />
                        </div>
                        {state === 'expanded' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant='ghost' size='icon' asChild className='size-7 mr-2 shrink-0 hover:bg-sidebar-accent'>
                                        <Link href='/create-workspace'>
                                            <Plus className='size-4' />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Create Workspace
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </SidebarHeader>
                <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <NavMain />
                    <NavProject projects={project} workspaceMembers={workspaceMembers} />
                </SidebarContent>
                <SidebarUserProfile user={user} />
            </Sidebar>
        </>
    )
}

export default AppSidebar;
