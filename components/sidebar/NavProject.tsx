'use-client'

import { projectProps, workspaceMembersProps } from "@/utils/types"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { CreateProjectForm } from "../project/create-project-form"


export const NavProject = ({
    projects,
    workspaceMembers
}: {
    projects: projectProps[]
    ,
    workspaceMembers: workspaceMembersProps[]
}) => {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathName = usePathname();
    return (
        <>
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel className="flex justify-between">
                    <span className="text-sm font-semibold text-muted-foreground uppercase">
                        Projects
                    </span>
                    <CreateProjectForm workspaceMembers={workspaceMembers} />
                </SidebarGroupLabel>
                <SidebarMenu>
                    {
                        projects.map((project) => {
                            const href = `/workspace/${project.workspaceId}/project/${project.id}`;
                            return (
                                <SidebarMenuItem key={project.id}>
                                    <SidebarMenuButton>
                                        <Link href={href} className={pathName === href ? "text-primary-foreground text-semibold" : "text-muted-foreground "}>
                                            <span>{project.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })
                    }
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}