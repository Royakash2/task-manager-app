"use server";
import { projectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import { verifyAccess } from "@/lib/permissions";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { deleteAttachments } from "@/utils/file-attachments";

export const createProject = async (data: projectDataType) => {
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

export const deleteProject = async (
  workspaceId: string,
  projectId: string,
) => {
  try {
    const { user } = await userRequired();
    await verifyAccess(user.id, workspaceId, projectId);

    // Fetch project name + all task attachment URLs for UploadThing cleanup
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

    // Hard delete — Prisma cascade removes tasks, comments, activities,
    // projectAccess, documentation, and files automatically
    await db.project.delete({ where: { id: projectId } });

    // Log activity (no projectId since the project is being deleted)
    await db.activity.create({
      data: {
        type: "PROJECT_DELETED",
        description: `deleted project "${project.name}"`,
        userId: user.id,
      },
    });

    revalidatePath(`/workspace/${workspaceId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
};
