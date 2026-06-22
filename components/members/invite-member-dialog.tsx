"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { inviteMember } from "@/app/actions/members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AccessLevel } from "@prisma/client";

interface InviteMemberDialogProps {
  currentUserRole: AccessLevel | null;
  children?: React.ReactNode;
}

export const InviteMemberDialog = ({ currentUserRole, children }: InviteMemberDialogProps) => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<typeof AccessLevel.ADMIN | typeof AccessLevel.MEMBER>(AccessLevel.MEMBER);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setPending(true);
    try {
      const result = await inviteMember(workspaceId, {
        email: email.trim(),
        role,
      });

      if (result.success) {
        toast.success(`${result.data?.name} has been invited as ${role.toLowerCase()}`);
        setEmail("");
        setRole(AccessLevel.MEMBER);
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to invite member");
      }
    } catch (error) {
      console.error("[INVITE_DIALOG_ERROR]:", error);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  const canManage = currentUserRole === AccessLevel.OWNER || currentUserRole === AccessLevel.ADMIN;
  const isOwner = currentUserRole === AccessLevel.OWNER;

  if (!canManage) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button size="sm" className="cursor-pointer">
            <UserPlus className="size-4 mr-1.5" />
            Invite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invite Member</DialogTitle>
          <DialogDescription>
            Add a new member to this workspace by email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="MEMBER"
                  checked={role === AccessLevel.MEMBER}
                  onChange={() => setRole(AccessLevel.MEMBER)}
                  className="size-4 accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Member</span>
                  <span className="text-xs text-muted-foreground">
                    Can create projects and manage tasks
                  </span>
                </div>
              </label>
              {isOwner && (
              <label className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === AccessLevel.ADMIN}
                  onChange={() => setRole(AccessLevel.ADMIN)}
                  className="size-4 accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground">
                    Manage workspace, projects & members
                  </span>
                </div>
              </label>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="flex-1 cursor-pointer">
              {pending ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
