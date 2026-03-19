"use server";
import { projectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";

export const createProject = async (data: projectDataType) => {
  const { user } = await userRequired();
  const workspace = await db.workspace.findUnique({
    where: { id: data.workspaceId },
    include: {
      projects: { select: { id: true } },
    },
  });
  const validatedData = projectSchema.parse(data);
  const workspaceMembers = await db.workspaceMembers.findMany({
    where: {
      workspaceId: data.workspaceId,
    },
  });
  const isUserMember = workspaceMembers.some(
    (member) => member.userId === user.id,
  );
  if (!isUserMember) {
    throw new Error("You are not a member of this workspace");
  }
  if (validatedData.membersAccess?.length === 0) {
    validatedData.membersAccess = [user.id];
  } else if (!validatedData.membersAccess?.includes(user.id)) {
    validatedData.membersAccess?.push(user.id);
  }
  await db.project.create({
    data: {
      name: validatedData.name,
      description: validatedData.description,
      workspaceId: validatedData.workspaceId,
      projectAccess: {
        create: validatedData.membersAccess?.map((memberId) => ({
          workspaceMemberId: workspaceMembers.find(
            (member) => member.userId === memberId,
          )!.id,
          hasAccess: true,
        })),
      },
      activities: {
        create: {
          type: "project_created",
          description: `created Project ${validatedData.name} `,
          userId: user.id,
        },
      },
    },
  });
  return { success: true };
};
