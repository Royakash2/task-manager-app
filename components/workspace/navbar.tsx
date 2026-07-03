import { ThemeToggle } from "../theme-toggle";
import { NotificationDropdown } from "../notifications/notification-dropdown";
import { DynamicBreadcrumb } from "../breadcrumb/dynamic-breadcrumb";

export const WorkspaceNavbar = () => {
    return (
        <nav className="w-full flex items-center py-3 px-4">
            <div className="flex items-center">
                <DynamicBreadcrumb />
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <NotificationDropdown />
                <ThemeToggle />
            </div>
        </nav>
    );
};