"use client"
import { useWorkSpaceId } from '@/hooks/UseWorkspaceId';
import { workspaceProps } from '@/utils/types'

import React, { useEffect, useState } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuSubItem } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkspaceAvatar } from '../workspace/workspace-avatar';


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
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size={'lg'} className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                                <WorkspaceAvatar name={selectWorkspce?.workspace.name as string || 'W'} />
                                <div className='font-semibold'>
                                    {selectWorkspce?.workspace.name}
                                </div>
                                <ChevronsUpDown className='size-4 ml-auto' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                </SidebarMenuSubItem>
            </SidebarMenu>
        </>
    )
}

export default WorkspaceSelector;