"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNotifications } from "@/hooks/use-notifications";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Bell, CheckSquare, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AccessLevel } from "@prisma/client";

interface NavMainProps {
  currentUserRole?: AccessLevel | null | undefined;
}

export const NavMain = ({ currentUserRole }: NavMainProps) => {
  const workspaceId = useWorkspaceId();
  const { setOpenMobile } = useSidebar();
  const { unreadCount } = useNotifications();

  const isMember = currentUserRole === AccessLevel.MEMBER;

  const items = [
    {
      label: "Home",
      href: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
      path: "home",
    },
    {
      label: "Notifications",
      href: `/workspace/${workspaceId}/notifications`,
      icon: Bell,
      path: "notifications",
      badge: unreadCount,
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
    ...(!isMember
      ? [
          {
            label: "Settings",
            href: `/workspace/${workspaceId}/settings`,
            icon: Settings,
            path: "settings",
          },
        ]
      : []),
  ];

  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => {
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
                    {(item.badge ?? 0) > 0 && (
                      <span
                        className={cn(
                          "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                          "bg-primary text-primary-foreground"
                        )}
                      >
                        {(item.badge ?? 0) > 9 ? "9+" : item.badge ?? 0}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
};
