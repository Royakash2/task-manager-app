'use-client'

import { projectProps, workspaceMembersProps } from "@/utils/types"
import { SidebarGroup, SidebarGroupLabel, useSidebar } from "../ui/sidebar"
import { usePathname } from "next/navigation"


export const NavProject = ({
    projects,
    workspaceMembers
}: {
    projects: projectProps[]
    ,
    workspaceMembers: workspaceMembersProps[]
}) => {
    const {isMobile,setOpenMobile} = useSidebar();
    const pathName = usePathname();
    return (
        <>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground uppercase">
                    Projects
                </span>
            </SidebarGroupLabel>
        </SidebarGroup>
        </>
    )
}