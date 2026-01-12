
import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import {  User } from '@prisma/client'

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
            project: projectProps
        }) {
    return (
        <div>AppSidebar</div>
    )
}

export default AppSidebar