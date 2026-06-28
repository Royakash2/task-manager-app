
'use client'

import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { AccessLevel, User } from '@prisma/client'
import { projectProps, workspaceMembersProps } from '@/utils/types'
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from '../ui/sidebar'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import WorkspaceSelector from './WorkspaceSelector'
import { NavMain } from './NavMain'
import { NavProject } from './NavProject'

import { SidebarUserProfile } from './SidebarUserProfile'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

function AppSidebar(
    { user,
        data,
        workspaceMembers,
        project,
        currentUserRole
    }
        :
        {
            user: User,
            data: AppSidebarDataProps,
            workspaceMembers: workspaceMembersProps[],
            project: projectProps[],
            currentUserRole: AccessLevel | null
        }) {
    const { state } = useSidebar()

    return (
        <>
            <Sidebar collapsible='icon' >
                <SidebarHeader className='bg-sidebar'>

                    <div className='flex items-center justify-between gap-2 group-data-[collapsible=icon]:block'>
                        <div className='flex-1 min-w-0'>
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
                    <NavMain currentUserRole={currentUserRole} />
                    <NavProject projects={project} workspaceMembers={workspaceMembers} currentUserRole={currentUserRole} />
                </SidebarContent>
                <SidebarUserProfile user={user} />
            </Sidebar>
        </>
    )
}

export default AppSidebar;
