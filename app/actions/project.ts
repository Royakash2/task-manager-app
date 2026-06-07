"use server";
import { ProjectData } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import { requireRole } from "@/lib/permissions";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { deleteAttachments } from "@/utils/file-attachments";
import { actionError, logActivity } from "@/utils/actions";

export const createProject = async (data: ProjectData) => {
  try {
    const { user } = await userRequired();
    const validatedData = projectSchema.parse(data);
    await requireRole(user.id, data.workspaceId, "OWNER", "ADMIN");

    const workspaceMembers = await db.workspaceMembers.findMany({
      where: {
        workspaceId: data.workspaceId,
      },
    });

    const membersAccess =
      validatedData.membersAccess?.length === 0
        ? [user.id]
        : validatedData.membersAccess?.includes(user.id)
          ? validatedData.membersAccess
          : [...(validatedData.membersAccess || []), user.id];

    await db.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        workspaceId: validatedData.workspaceId,
        projectAccess: {
          create: membersAccess?.map((memberId) => ({
            workspaceMemberId: workspaceMembers.find(
              (member) => member.userId === memberId,
            )!.id,
            hasAccess: true,
          })),
        },
      },
    });

    await logActivity(
      "PROJECT_CREATED",
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
    await requireRole(user.id, workspaceId, "OWNER", "ADMIN");

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
      projectId,
      workspaceId,
    );

    revalidatePath(`/workspace/${workspaceId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return actionError(error, "Failed to delete project");
  }
};
