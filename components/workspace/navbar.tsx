import { ThemeToggle } from "../theme-toggole";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

export const WorkspaceNavbar = () => {
    return (
        <nav className="w-full flex items-center p-4">
            <div className="flex items-center gap-2 ml-auto">
                <Button variant={"ghost"}>
                    <Bell />
                </Button>
                <ThemeToggle />
            </div>
        </nav>
    );
};