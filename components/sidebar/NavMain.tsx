'use client'

import { useWorkSpaceId } from "@/hooks/UseWorkspaceId"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
import { CheckSquare, LayoutDashboard, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NavMain = () => {
    const workspaceId = useWorkSpaceId();
    const { setOpenMobile } = useSidebar();

    const items = [
        {
            label: "Home",
            href: `/workspace/${workspaceId}`,
            icon: LayoutDashboard,
            path: "home",
        },
        {
            label: "My Tasks",
            href: `/workspace/${workspaceId}/my-tasks`,
            icon: CheckSquare,
            path: "my-tasks",
        },
        {
            label: "Members",
            href: `/workspace/${workspaceId}/members`,
            icon: Users,
            path: "members",
        },
        {
            label: "Settings",
            href: `/workspace/${workspaceId}/settings`,
            icon: Settings,
            path: "settings",
        },
    ]

    return (

        <>

        </>
    )
}