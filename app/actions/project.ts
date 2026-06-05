"use server";
import { projectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import { verifyAccess } from "@/lib/permissions";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { deleteAttachments } from "@/utils/file-attachments";
import { actionError, logActivity } from "@/utils/actions";

export const createProject = async (data: projectDataType) => {
  try {
    const { user } = await userRequired();
    const validatedData = projectSchema.parse(data);
    await verifyAccess(user.id, data.workspaceId);

    const workspaceMembers = await db.workspaceMembers.findMany({
      where: {
        workspaceId: data.workspaceId,
      },
    });

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
      },
    });

    await logActivity(
      "project_created",
      `created Project ${validatedData.name}`,
      user.id,
      undefined,
      validatedData.workspaceId,
    );

    revalidatePath(`/workspace/${data.workspaceId}`);
    return { success: true };
  } catch (error) {
    console.error("[CREATE_PROJECT_ERROR]:", error);
    return actionError(error, "Failed to create project");
  }
};

export const deleteProject = async (workspaceId: string, projectId: string) => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId, projectId);

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        name: true,
        tasks: {
          select: {
            attachments: {
              select: { url: true },
            },
          },
        },
      },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Clean up UploadThing files across all tasks before cascade delete
    const allFileUrls = project.tasks.flatMap((t) =>
      t.attachments.map((a) => a.url),
    );
    if (allFileUrls.length > 0) {
      await deleteAttachments(allFileUrls);
    }

    await db.project.delete({ where: { id: projectId } });
    await logActivity(
      "PROJECT_DELETED",
      `deleted project "${project.name}"`,
      user.id,
    );

    revalidatePath(`/workspace/${workspaceId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return actionError(error, "Failed to delete project");
  }
};
