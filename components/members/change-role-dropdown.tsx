"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { updateMemberRole } from "@/app/actions/members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface ChangeRoleDropdownProps {
  memberId: string;
  currentRole: string;
  isOwner: boolean;
}

export const ChangeRoleDropdown = ({
  memberId,
  currentRole,
  isOwner,
}: ChangeRoleDropdownProps) => {
  const workspaceId = useWorkspaceId();
  const [role, setRole] = useState(currentRole);
  const [pending, setPending] = useState(false);

  if (!isOwner || currentRole === "OWNER") return null;

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return;

    setPending(true);
    setRole(newRole);
    try {
      const result = await updateMemberRole(
        workspaceId,
        memberId,
        newRole as "ADMIN" | "MEMBER",
      );
      if (!result.success) {
        setRole(role); // revert
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      console.error("[CHANGE_ROLE_DIALOG_ERROR]:", error);
      setRole(role); // revert
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={pending}>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          {role}
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Change role
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={role} onValueChange={handleRoleChange}>
          <DropdownMenuRadioItem value="MEMBER" className="cursor-pointer">
            <div className="flex flex-col">
              <span className="text-sm">Member</span>
              <span className="text-xs text-muted-foreground">
                Access assigned tasks only
              </span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ADMIN" className="cursor-pointer">
            <div className="flex flex-col">
              <span className="text-sm">Admin</span>
              <span className="text-xs text-muted-foreground">
                Manage workspace & projects
              </span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
