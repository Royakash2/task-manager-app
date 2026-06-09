"use server";
import { userRequired } from "../data/user/get-user";
import { requireRole } from "@/lib/permissions";
import db from "@/lib/db";
import { projectSchema, ProjectData } from "@/lib/schema";
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

    // Always include all OWNERs and ADMINs — they always have access
    const ownerAndAdminIds = workspaceMembers
      .filter((m) => m.accessLevel === "OWNER" || m.accessLevel === "ADMIN")
      .map((m) => m.userId);

    const selectedIds = validatedData.membersAccess || [];

    // Combine: OWNERs/ADMINs + selected members + ensure creator is included
    const membersAccess = [
      ...new Set([...ownerAndAdminIds, ...selectedIds, user.id]),
    ];

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

export const updateProject = async (
  workspaceId: string,
  projectId: string,
  data: Partial<Pick<ProjectData, "name" | "description">>,
) => {
  try {
    const { user } = await userRequired();
    await requireRole(user.id, workspaceId, "OWNER", "ADMIN");

    const validated = projectSchema.pick({ name: true, description: true }).partial().parse(data);

    const project = await db.project.update({
      where: { id: projectId },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && {
          description: validated.description,
        }),
      },
    });

    await logActivity(
      "PROJECT_UPDATED",
      `updated project settings`,
      user.id,
      projectId,
      workspaceId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}`);

    return { success: true, data: project };
  } catch (error) {
    console.error("[UPDATE_PROJECT_ERROR]:", error);
    return actionError(error, "Failed to update project");
  }
};

export const toggleProjectAccess = async (
  workspaceId: string,
  projectId: string,
  memberWorkspaceMemberId: string,
  hasAccess: boolean,
) => {
  try {
    const { user } = await userRequired();
    await requireRole(user.id, workspaceId, "OWNER", "ADMIN");

    // Upsert: create a ProjectAccess record if it doesn't exist, or update it
    const member = await db.workspaceMembers.findUnique({
      where: { id: memberWorkspaceMemberId },
      select: { accessLevel: true, userId: true, user: { select: { name: true } } },
    });

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    // OWNER and ADMIN always have access — can't toggle
    if (member.accessLevel === "OWNER" || member.accessLevel === "ADMIN") {
      return {
        success: false,
        error: "Workspace owners and admins always have access to all projects.",
      };
    }

    await db.projectAccess.upsert({
      where: {
        workspaceMemberId_projectId: {
          workspaceMemberId: memberWorkspaceMemberId,
          projectId,
        },
      },
      create: {
        workspaceMemberId: memberWorkspaceMemberId,
        projectId,
        hasAccess,
      },
      update: {
        hasAccess,
      },
    });

    await logActivity(
      hasAccess ? "PROJECT_ACCESS_GRANTED" : "PROJECT_ACCESS_REVOKED",
      `${hasAccess ? "granted" : "revoked"} project access for ${member.user.name}`,
      user.id,
      projectId,
      workspaceId,
    );

    revalidatePath(`/workspace/${workspaceId}/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("[TOGGLE_PROJECT_ACCESS_ERROR]:", error);
    return actionError(error, "Failed to update project access");
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
    await logActivity(
      "PROJECT_DELETED",
      `deleted project "${project.name}"`,
      user.id,
      projectId,
      workspaceId,
    );
    await db.project.delete({ where: { id: projectId } });

    revalidatePath(`/workspace/${workspaceId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return actionError(error, "Failed to delete project");
  }
};
