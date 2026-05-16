'use client'

import { User } from '@prisma/client'
import { LogOut } from 'lucide-react'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs'
import { SidebarFooter, useSidebar } from '../ui/sidebar'
import { ProfileAvatar } from '../profile-avatar'
import { Button } from '../ui/button'

export const SidebarUserProfile = ({ user }: { user: User }) => {
    const { state } = useSidebar()

    return (
        <SidebarFooter className="border-t bg-background p-3">
            {state === 'expanded' ? (
                <div className="flex items-center gap-3">
                    <ProfileAvatar
                        url={user?.image || undefined}
                        name={user?.name || 'User'}
                        size="sm"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-sm font-medium leading-none truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-none mt-1 truncate">
                            {user?.email}
                        </p>
                    </div>
                    <LogoutLink>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </LogoutLink>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <ProfileAvatar
                        url={user?.image || undefined}
                        name={user?.name || 'User'}
                        size="sm"
                    />
                    <LogoutLink>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </LogoutLink>
                </div>
            )}
        </SidebarFooter>
    )
}
