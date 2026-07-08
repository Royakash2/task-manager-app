import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

const sizeMap = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10 sm:size-14 2xl:size-16",
} as const;

const fallbackSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg sm:text-2xl 2xl:text-3xl font-bold",
} as const;

export const WorkspaceAvatar = ({
  name,
  size = "sm",
  className,
  fallbackClassName,
}: {
  name: string;
  size?: keyof typeof sizeMap;
  className?: string;
  fallbackClassName?: string;
}) => {
  return (
    <Avatar className={cn(sizeMap[size], "rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "bg-blue-600 text-white rounded-sm font-medium",
          fallbackSizeMap[size],
          fallbackClassName,
        )}
      >
        {name?.charAt(0)?.toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
};
