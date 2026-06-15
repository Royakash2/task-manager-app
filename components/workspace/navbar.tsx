import { ThemeToggle } from "../theme-toggle";
import { NotificationDropdown } from "../notifications/notification-dropdown";

export const WorkspaceNavbar = () => {
    return (
        <nav className="w-full flex items-center p-1.5">
            <div className="flex items-center gap-2 ml-auto">
                <NotificationDropdown />
                <ThemeToggle />
            </div>
        </nav>
    );
};