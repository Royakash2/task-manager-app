"use client"
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { workspaceProps } from '@/utils/types'

import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkspaceAvatar } from '@/components/workspace/workspace-avatar';
import Link from 'next/link';


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
                            <SidebarMenuButton 
                                size={'lg'} 
                                className='w-full min-w-0 data-[state=open]:bg-sidebar-accent/80 data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center border border-border/10 hover:border-border/30 hover:bg-muted/40 transition-all duration-200'
                            >
                                <WorkspaceAvatar size='md' name={selectedWorkspace?.workspace.name as string || 'W'} />
                                <div className='flex flex-col text-left group-data-[collapsible=icon]:hidden truncate min-w-0 capitalize ml-1'>
                                    <span className='text-sm font-semibold leading-tight truncate text-foreground'>
                                        {selectedWorkspace?.workspace.name}
                                    </span>
                                    {selectedWorkspace?.workspace.description && (
                                        <span className='text-[10px] text-muted-foreground truncate font-normal mt-0.5 leading-none'>
                                            {selectedWorkspace?.workspace.description}
                                        </span>
                                    )}
                                </div>
                                <ChevronsUpDown className='size-3.5 shrink-0 ml-auto group-data-[collapsible=icon]:hidden text-muted-foreground/80' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-64 p-1.5 shadow-xl border-border/60 rounded-xl bg-popover/95 backdrop-blur-xs'>
                            <div className='max-h-56 overflow-y-auto py-1 space-y-0.5'>
                                {
                                    workspaces.map(workspace => (
                                        <DropdownMenuItem 
                                            key={workspace.id} 
                                            onClick={() => onWorkspaceSelect(workspace?.workspaceId)}
                                            className='rounded-lg px-2.5 py-2 cursor-pointer transition-colors duration-150 focus:bg-sidebar-accent/60'
                                        >
                                            <div className='flex flex-row items-center gap-3 min-w-0 w-full'>
                                                <WorkspaceAvatar name={workspace.workspace.name as string || 'W'} />
                                                <div className='flex flex-col text-left min-w-0 capitalize flex-1'>
                                                    <span className='text-sm font-medium truncate leading-normal text-foreground'>
                                                        {workspace.workspace.name}
                                                    </span>
                                                    {workspace.workspace.description && (
                                                        <span className='text-[10px] text-muted-foreground truncate font-normal mt-0.5 leading-none max-w-[170px]'>
                                                            {workspace.workspace.description}
                                                        </span>
                                                    )}
                                                </div>
                                                {
                                                    workspace.workspaceId === workspaceId && (
                                                        <Check className='ml-auto shrink-0 size-3.5 text-primary' />
                                                    )
                                                }

                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                }
                            </div>
                            <DropdownMenuSeparator className='bg-border/40' />
                            <DropdownMenuItem asChild className='rounded-lg px-2.5 py-2 cursor-pointer focus:bg-sidebar-accent/60 text-muted-foreground hover:text-foreground mt-0.5'>
                                <Link href="/create-workspace" className="flex items-center gap-2.5 w-full text-xs font-medium">
                                    <Plus className="size-4 shrink-0 text-muted-foreground" />
                                    <span>Create Workspace</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}

export default WorkspaceSelector;