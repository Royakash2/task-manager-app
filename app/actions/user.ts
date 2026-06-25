"use server";

import { userRequired } from "../data/user/get-user";
import { userSchema, UserData } from "@/lib/schema";
import db from "@/lib/db";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { actionError } from "@/utils/actions";

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
        indrustryType: validateData.data.industryType,
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
