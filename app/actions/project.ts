"use server";
import { projectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export const createProject = async (data: projectDataType) => {
    const { user } = await userRequired();
    if (!user) throw new Error("Unauthorized: User not found");

    const validateData = projectSchema.safeParse(data);
    if (!validateData.success) throw new Error("Invalid data: " + validateData.error.message);

    const { name, description, workspaceId, membersAccess: rawAccess } = validateData.data;

    const workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) throw new Error("Workspace not found");

    const members = await db.workspaceMembers.findMany({ where: { workspaceId } });

    if (!members.some((member) => member.userId === user.id))
        throw new Error("You are not a member of this workspace");

    const membersAccess = rawAccess?.length ? rawAccess : [user.id];

    const project = await db.project.create({ data: { name, description, workspaceId } });

    await db.projectAccess.createMany({
        data: members
            .filter((member) => membersAccess.includes(member.userId))
            .map((member) => ({ workspaceMemberId: member.id, projectId: project.id, hasAccess: true })),
        skipDuplicates: true,
    });

    redirect(`/workspace/${workspaceId}/project/${project.id}`);
};