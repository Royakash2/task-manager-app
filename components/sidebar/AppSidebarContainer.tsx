import { User } from '@prisma/client';
import React from 'react'
import { getWorkspaceProjectByWorkspceId } from '@/app/data/workspace/project/user-workspace-project';
import { getUserById } from '@/app/data/user/get-user-by-id';
import AppSidebar from './AppSidebar';

export interface AppSidebarDataProps extends User {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    workspaces: {
        name: string;
    }[]
}

const AppSidebarContainer = async ({ data, workspaceId }: { data: AppSidebarDataProps, workspaceId: string }) => {
    const {projects,projectAccess } = await getWorkspaceProjectByWorkspceId(workspaceId);
    const user = await getUserById();
    return <AppSidebar
        user={user as User}
         key={user?.id}
         data={data}
        projectAccess={projectAccess}
         projects={projects}
          />
}

export default AppSidebarContainer;