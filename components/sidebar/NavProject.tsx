'use client'

import { projectProps, workspaceMembersProps } from "@/utils/types"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { CreateProjectForm } from "../project/create-project-form"
import { ChevronDown, FolderKanban } from "lucide-react"


export const NavProject = ({
    projects,
    workspaceMembers,
    currentUserRole
}: {
    projects: projectProps[]
    ,
    workspaceMembers: workspaceMembersProps[],
    currentUserRole: string | null
}) => {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathName = usePathname();

    return (
        <>
            <SidebarGroup>
                <Collapsible defaultOpen={true} className="group/collapsible">
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel className="flex justify-between cursor-pointer select-none">
                            <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase">
                                <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90" />
                                Projects
                            </span>
                            {currentUserRole !== "MEMBER" && (
                              <CreateProjectForm workspaceMembers={workspaceMembers} />
                            )}
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                            {
                                projects.map((project) => {
                                    const href = `/workspace/${project.workspaceId}/projects/${project.id}`;
                                    return (
                                        <SidebarMenuItem key={project.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathName === href}
                                                tooltip={project.name}
                                            >
                                                <Link href={href} onClick={() => setOpenMobile(false)}>
                                                    <FolderKanban className="size-4" />
                                                    <span>{project.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })
                            }
                        </SidebarMenu>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarGroup>
        </>
    )
}