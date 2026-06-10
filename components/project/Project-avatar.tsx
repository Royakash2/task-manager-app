import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

export const ProjectAvatar = ({
    name,
    className,
    fallbackClassName,
}: {
    name: string;
    className?: string;
    fallbackClassName?: string;
}) => {
    return (
        <Avatar
            className={cn("size-6 rounded-md", className)}
        >
            <AvatarFallback className={cn("bg-blue-600 text-white rounded-sm font-medium", fallbackClassName)}>
                {name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
        </Avatar>
    );
};