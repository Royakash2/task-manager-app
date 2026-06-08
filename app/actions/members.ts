"use server";

import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";
import { inviteMemberSchema, updateMemberRoleSchema } from "@/lib/schema";
import { getUserRole, requireOwner, requireRole } from "@/lib/permissions";
import { getMemberWithUser } from "../data/members/get-member-with-user";
import { revalidatePath } from "next/cache";
import { actionError, logActivity } from "@/utils/actions";

export const inviteMember = async (
  workspaceId: string,
  data: { email: string; role: "ADMIN" | "MEMBER" },
) => {
  try {
    const { user } = await userRequired();
    await requireRole(user.id, workspaceId, "OWNER", "ADMIN");

    const validated = inviteMemberSchema.parse(data);

    // ADMIN can only invite as MEMBER, not ADMIN
    if (validated.role === "ADMIN") {
      await requireOwner(user.id, workspaceId);
    }

    const invitedUser = await db.user.findUnique({
      where: { email: validated.email },
      select: { id: true, name: true, email: true },
    });

    if (!invitedUser) {
      return {
        success: false,
        error: "No user found with this email. They need to sign up first.",
      };
    }

    const existingMember = await db.workspaceMembers.findUnique({
      where: {
        userId_workspaceId: {
          userId: invitedUser.id,
          workspaceId,
        },
      },
    });

    if (existingMember) {
      return {
        success: false,
        error: `${invitedUser.name} is already a member of this workspace.`,
      };
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    });

    await db.$transaction([
      db.workspaceMembers.create({
        data: {
          userId: invitedUser.id,
          workspaceId,
          accessLevel: validated.role,
        },
      }),
      logActivity(
        "MEMBER_INVITED",
        `added ${invitedUser.name} to "${workspace?.name ?? "the workspace"}" as ${validated.role.toLowerCase()}`,
        user.id,
        undefined,
        workspaceId,
      )
    ]);

    revalidatePath(`/workspace/${workspaceId}`, "layout");

    return {
      success: true,
      data: { name: invitedUser.name, email: invitedUser.email },
    };
  } catch (error) {
    console.error("[INVITE_MEMBER_ERROR]:", error);
    return actionError(error, "Failed to invite member");
  }
};

export const updateMemberRole = async (
  workspaceId: string,
  memberId: string,
  newRole: "ADMIN" | "MEMBER",
) => {
  try {
    const { user } = await userRequired();
    await requireOwner(user.id, workspaceId);

    const validated = updateMemberRoleSchema.parse({ memberId, newRole });

    const member = await getMemberWithUser(validated.memberId);

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    // Prevent self-demotion
    if (member.userId === user.id && member.accessLevel === "OWNER") {
      return {
        success: false,
        error: "You cannot change your own role as the workspace owner.",
      };
    }

    // Prevent changing an OWNER's role
    if (member.accessLevel === "OWNER") {
      return {
        success: false,
        error: "Cannot change the role of a workspace owner.",
      };
    }

    await db.$transaction([
      db.workspaceMembers.update({
        where: { id: validated.memberId },
        data: { accessLevel: validated.newRole },
      }),
      logActivity(
        "MEMBER_ROLE_CHANGED",
        `changed ${member.user.name}'s role to ${validated.newRole.toLowerCase()}`,
        user.id,
        undefined,
        workspaceId,
      )
    ]);

    revalidatePath(`/workspace/${workspaceId}`, "layout");

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_MEMBER_ROLE_ERROR]:", error);
    return actionError(error, "Failed to update member role");
  }
};

export const removeMember = async (workspaceId: string, memberId: string) => {
  try {
    const { user } = await userRequired();
    await requireRole(user.id, workspaceId, "OWNER", "ADMIN");

    const member = await getMemberWithUser(memberId);

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    // Prevent removing yourself
    if (member.userId === user.id) {
      return {
        success: false,
        error: "You cannot remove yourself from the workspace.",
      };
    }

    // Prevent removing owners
    if (member.accessLevel === "OWNER") {
      return {
        success: false,
        error: "Cannot remove a workspace owner.",
      };
    }

    // ADMIN can only remove MEMBERs, not other ADMINs
    if (member.accessLevel === "ADMIN") {
      const actorRole = await getUserRole(user.id, workspaceId);
      if (actorRole !== "OWNER") {
        return {
          success: false,
          error: "Only workspace owners can remove admins.",
        };
      }
    }

    await db.$transaction([
      db.workspaceMembers.delete({
        where: { id: memberId },
      }),
      db.task.updateMany({
        where: {
          assigneeId: member.userId,
          project: {
            workspaceId: workspaceId
          }
        },
        data: {
          assigneeId: null
        }
      }),
      logActivity(
        "MEMBER_REMOVED",
        `removed ${member.user.name} from the workspace`,
        user.id,
        undefined,
        workspaceId,
      )
    ]);

    revalidatePath(`/workspace/${workspaceId}`, "layout");

    return { success: true };
  } catch (error) {
    console.error("[REMOVE_MEMBER_ERROR]:", error);
    return actionError(error, "Failed to remove member");
  }
};
