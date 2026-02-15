import { User } from '@prisma/client';
// refresh
import React from 'react'
import { getWorkspaceProjectByWorkspaceId } from '@/app/data/workspace/project/user-workspace-project';
import { getUserById } from '@/app/data/user/get-user-by-id';
import AppSidebar from './AppSidebar';
import { projectProps, workspaceMembersProps, workspaceProps } from '@/utils/types';

export interface AppSidebarDataProps extends User {
    workspaces: workspaceProps[]
}

const AppSidebarContainer = async ({ data, workspaceId }: { data: AppSidebarDataProps, workspaceId: string }) => {
    const {projects,workspaceMembers } = await getWorkspaceProjectByWorkspaceId(workspaceId);
    const user = await getUserById();
    return <AppSidebar
        user={user as User}
         data={data}
         workspaceMembers={workspaceMembers as unknown as workspaceMembersProps[]}
         project={projects as unknown as projectProps[]}
          />
}

export default AppSidebarContainer;