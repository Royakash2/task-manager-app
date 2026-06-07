"use server";

import { workspaceSchema } from "@/lib/schema";
import { userRequired } from "../data/user/get-user";
import db from "@/lib/db";
import { z } from "zod";
import { generateInviteCode } from "@/utils/get-invite-code";
import { actionError } from "@/utils/actions";

type WorkspaceData = z.infer<typeof workspaceSchema>;

export const createWorkspace = async (data: WorkspaceData) => {
  try {
    const { user } = await userRequired();

    const validateData = workspaceSchema.safeParse(data);
    if (!validateData.success) {
      throw new Error("Invalid data");
    }

    const { name, description } = validateData.data;

    // Generate a random invite code
    const inviteCode = generateInviteCode();

    const res = await db.workspace.create({
      data: {
        name,
        description,
        ownerId: user.id,
        inviteCode,
        members: {
          create: {
            userId: user.id,
            accessLevel: "OWNER",
          },
        },
      },
    });

    return { success: true, data: res };
  } catch (error) {
    console.error(error);

    return actionError(error, "Failed to create workspace");
  }
};
