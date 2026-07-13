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
            className={cn("size-6 rounded-sm", className)}
        >
            <AvatarFallback className={cn("font-semibold", fallbackClassName)}>
                {name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
        </Avatar>
    );
};