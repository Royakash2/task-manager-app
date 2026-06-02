'use client'

import { useWorkSpaceId } from "@/hooks/UseWorkspaceId"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
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

    const pathname = usePathname();

    return (

        <>
        <SidebarGroup>
            <SidebarMenu>
                {
                    items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={isActive}
                                    tooltip={item.label}
                                >
                                    <Link href={item.href} onClick={() => setOpenMobile(false)}>
                                        <Icon className="size-4" />
                                        <span>{item.label}</span>
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