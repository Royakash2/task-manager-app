import { $Enums, User } from '@prisma/client';
import React from 'react'
import { getWorkspaceProjectByWorkspceId } from '@/app/data/workspace/project/user-workspace-project';
import { getUserById } from '@/app/data/user/get-user-by-id';
import AppSidebar from './AppSidebar';

export interface AppSidebarDataProps extends User {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    accessLevel: $Enums.AccessLevel;
    workspaces: {
        name: string;
    }[]
}

const AppSidebarContainer = async ({ data, workspaceId }: { data: AppSidebarDataProps, workspaceId: string }) => {
    const {projects,workspaceMembers } = await getWorkspaceProjectByWorkspceId(workspaceId);
    const user = await getUserById();
    return <AppSidebar
        user={user as User}
         data={data}
         workspaceMembers={workspaceMembers}
         project={projects}
          />
}

export default AppSidebarContainer;