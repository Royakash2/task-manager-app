"use server";
import { projectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export const createProject = async (data: projectDataType) => {
  const { user } = await userRequired();
  const workspace = await db.workspace.findUnique({
    where: { id: data.workspaceId },
    include: {
      projects: { select: { id: true } },
    },
  });
  const validatedData = projectSchema.parse(data);
  const isUserMember = await db.workspaceMembers.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: data.workspaceId,
      },
    },
  });
  if (!isUserMember) {
    throw new Error("You are not a member of this workspace");
  }
  if (validatedData.membersAccess?.length === 0) {
    validatedData.membersAccess = [user.id];
  } else if (!validatedData.membersAccess?.includes(user.id)) {
    validatedData.membersAccess?.push(user.id);
  }
};
