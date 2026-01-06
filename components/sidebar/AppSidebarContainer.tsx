import { User } from '@prisma/client';
import React from 'react'
import { getWorkspaceProjectByWorkspceId } from '@/app/data/workspace/project/user-workspace-project';

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
    const {} = getWorkspaceProjectByWorkspceId(workspaceId);
  return <AppSidebar data={data} workspaceId={workspaceId}/>
}

export default AppSidebarContainer;