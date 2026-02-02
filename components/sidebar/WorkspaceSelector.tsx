"use client"
import { useWorkSpaceId } from '@/hooks/UseWorkspaceId';
import { workspaceProps } from '@/utils/types'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { SidebarMenu } from '../ui/sidebar';


function WorkspaceSelector({ workspaces }: { workspaces: workspaceProps[] }) {

    const router = useRouter();
    const workSpaceId = useWorkSpaceId();
    const [selectWorkspceId, setSelectWorkspce] = useState<workspaceProps | undefined>(undefined);

    const onSlect = (id: string) => {
        setSelectWorkspce(
            workspaces.find((workspace) => workspace.id === id)
        )
        router.push(`/workspace/${id}`);
    }
    useEffect(() => {
        if (workSpaceId && workspaces) {
            setSelectWorkspce(
                workspaces.find((workspace) => workspace.id === workSpaceId)
            )
        }
    }, [workSpaceId, workspaces])

    return (
        <>
            <SidebarMenu>

            </SidebarMenu>
        </>
    )
}

export default WorkspaceSelector;