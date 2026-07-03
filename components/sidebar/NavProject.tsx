'use client'

import { projectProps, workspaceMembersProps } from "@/utils/types"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AccessLevel } from "@prisma/client"
import { CreateProjectForm } from "../project/create-project-dialog"
import { ChevronDown, Folder } from "lucide-react"
import { cn } from "@/lib/utils"


export const NavProject = ({
    projects,
    workspaceMembers,
    currentUserRole
}: {
    projects: projectProps[]
    ,
    workspaceMembers: workspaceMembersProps[],
    currentUserRole: AccessLevel | null
}) => {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathName = usePathname();

    return (
        <>
            <SidebarGroup>
                <Collapsible defaultOpen={true} className="group/collapsible">
                    <div className="flex items-center justify-between pr-2 mb-1">
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel className="cursor-pointer select-none flex items-center gap-1.5 text-sm font-semibold text-muted-foreground tracking-wider hover:text-foreground transition-colors">
                                <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90" />
                                Projects
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                        {currentUserRole !== AccessLevel.MEMBER && (
                            <CreateProjectForm workspaceMembers={workspaceMembers} />
                        )}
                    </div>
                    <CollapsibleContent>
                        <SidebarMenu>
                            {
                                projects.map((project) => {
                                    const href = `/workspace/${project.workspaceId}/projects/${project.id}`;
                                    const isProjectActive = pathName === href || pathName.startsWith(`${href}/`);
                                    
                                    return (
                                        <SidebarMenuItem key={project.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isProjectActive}
                                                tooltip={project.name}
                                            >
                                                <Link href={href} onClick={() => setOpenMobile(false)}>
                                                    <Folder className={cn("size-3.5", isProjectActive ? "text-foreground" : "text-muted-foreground")} />
                                                    <span className={cn(
                                                        "capitalize font-medium text-xs transition-colors",
                                                        isProjectActive ? "text-foreground" : "text-foreground/75"
                                                    )}>
                                                        {project.name}
                                                    </span>
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