"use client"
import { useWorkSpaceId } from '@/hooks/UseWorkspaceId';
import { workspaceProps } from '@/utils/types'

import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuSubItem } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkspaceAvatar } from '../workspace/workspace-avatar';


function WorkspaceSelector({ workspaces }: { workspaces: workspaceProps[] }) {

    const router = useRouter();
    const workSpaceId = useWorkSpaceId() as string;

    const selectWorkspce = workspaces.find((workspace) => workspace.workspaceId === workSpaceId);


    const onWorkspaceSelect = (id: string) => {
        router.push(`/workspace/${id}`);
    }
    console.log(selectWorkspce)

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
                        <DropdownMenuContent align='start' className='w-(--radix-dropdown-menu-trigger-width)'>
                            {
                                workspaces.map(workspace => (
                                    <DropdownMenuItem key={workspace.id} onClick={() => onWorkspaceSelect(workspace?.workspaceId)}>
                                        <div className='flex flex-row items-center gap-2'>
                                            <WorkspaceAvatar name={workspace.workspace.name as string || 'W'} />
                                            <p>{workspace.workspace.name}</p>
                                            {
                                                workspace.workspaceId === workSpaceId && (
                                                    <Check className='ml-auto' />
                                                )
                                            }

                                        </div>
                                    </DropdownMenuItem>

                                ))
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuSubItem>
            </SidebarMenu>
        </>
    )
}

export default WorkspaceSelector;