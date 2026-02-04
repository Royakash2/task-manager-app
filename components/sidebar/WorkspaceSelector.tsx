"use client"
import { useWorkSpaceId } from '@/hooks/UseWorkspaceId';
import { workspaceProps } from '@/utils/types'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuSubItem } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuSubTrigger } from '../ui/dropdown-menu';
import { WorkspaceAvatar } from '../workspace/workspaceAvatar';


function WorkspaceSelector({ workspaces }: { workspaces: workspaceProps[] }) {

    const router = useRouter();
    const workSpaceId = useWorkSpaceId();
    const [selectWorkspce, setSelectWorkspce] = useState<workspaceProps | undefined>(undefined);
   

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
                <SidebarMenuSubItem>
                    <DropdownMenu>
                        <DropdownMenuSubTrigger asChild>
                            <SidebarMenuButton size={'lg'} className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                                <WorkspaceAvatar name={selectWorkspce?.workspace.name as string} />
                            </SidebarMenuButton>
                        </DropdownMenuSubTrigger>
                    </DropdownMenu>
                </SidebarMenuSubItem>
            </SidebarMenu>
        </>
    )
}

export default WorkspaceSelector;