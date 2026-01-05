"use server";

import { workspaceSchema } from "@/lib/schema";
import { userRequired } from "../data/user/get-user";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateInviteCode } from "@/utils/get-invite-code";

type WorkspaceData = z.infer<typeof workspaceSchema>;

export const createWorkspace = async (data: WorkspaceData) => {
  const { user } = await userRequired();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const validateData = workspaceSchema.safeParse(data);
  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  const { name, description } = validateData.data;

  // Generate a random invite code
  const inviteCode = generateInviteCode();

  const workspace = await db.workspace.create({
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

  redirect(`/workspace/${workspace.id}`);
};
