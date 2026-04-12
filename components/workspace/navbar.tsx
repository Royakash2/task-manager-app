import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { ThemeToggle } from "../theme-toggole";
import { Button } from "../ui/button";
import { Bell, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverTrigger } from "../ui/popover";
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
                <h1 className="text-2xl font-bold">Home</h1>
                <span className="text-sm text-muted-foreground">
                    Manage all your task in one place.
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button variant={"ghost"}>
                    <Bell />
                </Button>
                <ThemeToggle />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={"ghost"}>
                                <LogoutLink><LogOut /></LogoutLink>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sign Out</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Popover>
                    <PopoverTrigger asChild>
                        <ProfileAvatar url={image || undefined} name={name} />
                    </PopoverTrigger>
                </Popover>
            </div>
        </nav>
    );
};