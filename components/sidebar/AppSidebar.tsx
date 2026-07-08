
'use client'

import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { AccessLevel, User } from '@prisma/client'
import { projectProps, workspaceMembersProps } from '@/utils/types'
import { Sidebar, SidebarContent, SidebarHeader } from '../ui/sidebar'

import WorkspaceSelector from './WorkspaceSelector'
import { NavMain } from './NavMain'
import { NavProject } from './NavProject'

import { SidebarUserProfile } from './SidebarUserProfile'

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

    return (
        <>
            <Sidebar collapsible='icon' >
                <SidebarHeader className='bg-sidebar'>

                    <div className='w-full'>
                        <WorkspaceSelector workspaces={data.workspaces} />
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
