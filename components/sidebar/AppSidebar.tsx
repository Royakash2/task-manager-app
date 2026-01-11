
import React from 'react'
import { AppSidebarDataProps } from './AppSidebarContainer'
import { ProjectAccess, User } from '@prisma/client'

function AppSidebar({user, data, projectAccess}: {user: User, data: AppSidebarDataProps, projectAccess: ProjectAccess[]}) {
  return (
    <div>AppSidebar</div>
  )
}

export default AppSidebar