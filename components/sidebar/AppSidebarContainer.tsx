import { User } from '@prisma/client';
import React from 'react'
import { getWorkspaceProjectByWorkspceId } from '@/app/data/workspace/project/user-workspace-project';
import { getUserById } from '@/app/data/user/get-user-by-id';

interface DataProps extends User {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    workspaces:{
        name: string;
    }[]
}

const AppSidebarContainer = async ({data, workspaceId}: {data: DataProps, workspaceId: string}) => {
    const {} =await getWorkspaceProjectByWorkspceId(workspaceId);
    const user = await getUserById();
  return <AppSidebar />
}

export default AppSidebarContainer;