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
};
