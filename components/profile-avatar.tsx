import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ProfileAvatar = ({
  url,
  name,
  size = "md",
  className,
  numOfChars = 1,
}: {
  name?: string | null;
  url?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  numOfChars?: number;
}) => {
  const displayName = name || "?";

  return (
    <Avatar
      className={cn(
        "h-8 w-8 rounded-full",
        size === "sm" && "h-6 w-6",
        size === "md" && "h-8 w-8",
        size === "lg" && "h-10 w-10",
        size === "xs" && "h-5 w-5",
        className
      )}
    >
      <AvatarImage src={url || undefined} alt={displayName} />
      <AvatarFallback className="rounded-full bg-blue-600/10 text-blue-600 font-medium">
        {displayName.substring(0, numOfChars).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
