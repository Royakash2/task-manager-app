"use client"
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { workspaceProps } from '@/utils/types'

import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkspaceAvatar } from '../workspace/workspace-avatar';


function WorkspaceSelector({ workspaces }: { workspaces: workspaceProps[] }) {

    const router = useRouter();
    const workspaceId = useWorkspaceId() as string;

    const selectedWorkspace = workspaces.find((workspace) => workspace.workspaceId === workspaceId);


    const onWorkspaceSelect = (id: string) => {
        router.push(`/workspace/${id}`);
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size={'lg'} className='w-full min-w-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center'>
                                <WorkspaceAvatar name={selectedWorkspace?.workspace.name as string || 'W'} />
                                <div className='text-lg font-semibold group-data-[collapsible=icon]:hidden truncate min-w-0 capitalize'>
                                    {selectedWorkspace?.workspace.name}
                                </div>
                                <ChevronsUpDown className='size-4 shrink-0 ml-auto group-data-[collapsible=icon]:hidden' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-(--radix-dropdown-menu-trigger-width)'>
                            {
                                workspaces.map(workspace => (
                                    <DropdownMenuItem key={workspace.id} onClick={() => onWorkspaceSelect(workspace?.workspaceId)}>
                                        <div className='flex flex-row items-center gap-2 min-w-0 w-full'>
                                            <WorkspaceAvatar name={workspace.workspace.name as string || 'W'} />
                                            <p className='truncate capitalize'>{workspace.workspace.name}</p>
                                            {
                                                workspace.workspaceId === workspaceId && (
                                                    <Check className='ml-auto shrink-0' />
                                                )
                                            }

                                        </div>
                                    </DropdownMenuItem>

                                ))
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}

export default WorkspaceSelector;