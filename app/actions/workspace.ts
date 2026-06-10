"use server";

import { workspaceSchema, WorkspaceData } from "@/lib/schema";
import { userRequired } from "../data/user/get-user";
import { requireOwner } from "@/lib/permissions";
import db from "@/lib/db";

import { generateInviteCode } from "@/utils/get-invite-code";
import { deleteAttachments } from "@/utils/file-attachments";
import { revalidatePath } from "next/cache";
import { actionError, logActivity } from "@/utils/actions";

export const createWorkspace = async (data: WorkspaceData) => {
  try {
    const { user } = await userRequired();

    const validateData = workspaceSchema.parse(data);

    const { name, description } = validateData;

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

    await logActivity(
      "WORKSPACE_CREATED",
      `created workspace "${name}"`,
      user.id,
      undefined,
      res.id,
    );

    return { success: true, data: res };
  } catch (error) {
    console.error("[CREATE_WORKSPACE_ERROR]:", error);

    return actionError(error, "Failed to create workspace");
  }
};

export const updateWorkspace = async (
  workspaceId: string,
  data: Partial<WorkspaceData>,
) => {
  try {
    const { user } = await userRequired();
    await requireOwner(user.id, workspaceId);

    const validated = workspaceSchema.partial().parse(data);

    const workspace = await db.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
      },
    });

    await logActivity(
      "WORKSPACE_UPDATED",
      `updated workspace settings`,
      user.id,
      undefined,
      workspaceId,
    );

    revalidatePath(`/workspace/${workspaceId}`, "layout");

    return { success: true, data: workspace };
  } catch (error) {
    console.error("[UPDATE_WORKSPACE_ERROR]:", error);
    return actionError(error, "Failed to update workspace");
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();
    await requireOwner(user.id, workspaceId);

    // Fetch all file URLs across all projects/tasks so we can clean up UploadThing
    const workspaceData = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        name: true,
        projects: {
          select: {
            tasks: {
              select: {
                attachments: {
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });

    if (!workspaceData) {
      return { success: false, error: "Workspace not found" };
    }

    // Clean up UploadThing files across all tasks before cascade delete
    const allFileUrls = workspaceData.projects.flatMap((p) =>
      p.tasks.flatMap((t) => t.attachments.map((a) => a.url)),
    );
    if (allFileUrls.length > 0) {
      await deleteAttachments(allFileUrls);
    }

    await logActivity(
      "WORKSPACE_DELETED",
      `deleted workspace "${workspaceData.name}"`,
      user.id,
      undefined,
      workspaceId,
    );

    await db.workspace.delete({
      where: { id: workspaceId },
    });

    revalidatePath("/workspace", "layout");

    return { success: true };
  } catch (error) {
    console.error("[DELETE_WORKSPACE_ERROR]:", error);
    return actionError(error, "Failed to delete workspace");
  }
};
