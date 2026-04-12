import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { ThemeToggle } from "../theme-toggole";
import { Button } from "../ui/button";
import { Bell, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ProfileAvatar } from "../profile-avatar";

interface WorkspaceNavbarProps {
    id: string;
    name: string;
    email: string;
    image: string;
}

export const WorkspaceNavbar = ({ id, name, email, image }: WorkspaceNavbarProps) => {
    return (
        <nav className="w-full flex items-center justify-between p-4">
            <div>
                <Popover>
                    <PopoverTrigger className="cursor-pointer">
                        <ProfileAvatar url={image || undefined} name={name} size="md" />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-60 p-2 space-y-2">
                        <div className="flex flex-col space-y-1 p-2">
                            <p className="text-sm font-medium leading-none">{name}</p>
                            <p className="text-xs text-muted-foreground leading-none">{email}</p>
                        </div>
                        <div className="h-px bg-border my-1" />
                        <LogoutLink className="w-full">
                            <Button variant="ghost" className="w-full justify-start text-sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </Button>
                        </LogoutLink>
                    </PopoverContent>
                </Popover>
               
            </div>

            <div className="flex items-center gap-2">
                <Button variant={"ghost"}>
                    <Bell />
                </Button>
                <ThemeToggle />
                
            </div>
        </nav>
    );
};