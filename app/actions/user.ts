"use server";

import { userRequired } from "../data/user/get-user";
import { userSchema, UserData } from "@/lib/schema";
import db from "@/lib/db";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { actionError } from "@/utils/actions";
import {
  deleteKindeUser,
  handleSoleOwnershipTransfer,
} from "@/utils/account-deletion";

// ── Server actions ──────────────────────────────────────────────────────────

export const createUser = async (data: UserData) => {
  try {
    const { user } = await userRequired();
    const validateData = userSchema.safeParse(data);

    if (!validateData.success) {
      throw new Error("Invalid data");
    }

    const userData = await db.user.create({
      data: {
        id: user.id,
        email: data.email as string,
        name: validateData.data.name,
        about: validateData.data.about,
        country: validateData.data.country,
        industryType: validateData.data.industryType,
        role: validateData.data.role,
        onboardingCompleted: true,
        image: data.image,
        subscription: {
          create: {
            plan: SubscriptionPlan.FREE,
            status: SubscriptionStatus.ACTIVE,
            customerPeriodEnd: new Date(),
            cancelAtPeriodEnd: false,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        workspaces: true,
      },
    });

    //  Todo send user welcome email
    if (userData.workspaces.length === 0) {
      return { success: true, redirectTo: "/create-workspace" };
    }
    return { success: true, redirectTo: "/workspace" };
  } catch (error) {
    console.error("[CREATE_USER_ERROR]:", error);
    return actionError(error, "Failed to create user");
  }
};

export const deleteAccount = async () => {
  try {
    const { user } = await userRequired();

    // ── 1. Handle sole-owned workspaces (transfer or delete) ──
    await handleSoleOwnershipTransfer(user.id);

    // ── 2. Delete user from Kinde auth (non-blocking) ──
    await deleteKindeUser(user.id);

    // ── 3. Delete user from DB ──
    //    Prisma cascade handles: Subscription
    //    Prisma SetNull handles: Task.assigneeId, Task.createdById, Notification.actorId
    //    Prisma SetNull (new): Comment.userId, Activity.userId
    await db.user.delete({ where: { id: user.id } });

    return { success: true as const, redirectTo: "/" };
  } catch (error) {
    console.error("[DELETE_ACCOUNT_ERROR]:", error);
    return actionError(error, "Failed to delete account");
  }
};

export const updateUser = async (data: Partial<UserData>) => {
  try {
    const { user } = await userRequired();
    const validated = userSchema.partial().parse(data);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.about !== undefined && { about: validated.about }),
        ...(validated.country !== undefined && { country: validated.country }),
        ...(validated.industryType !== undefined && { industryType: validated.industryType }),
        ...(validated.role !== undefined && { role: validated.role }),
        ...(validated.image !== undefined && { image: validated.image }),
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("[UPDATE_USER_ERROR]:", error);
    return actionError(error, "Failed to update user profile");
  }
};
