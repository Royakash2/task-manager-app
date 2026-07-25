import db from "@/lib/db";
import { AccessLevel } from "@prisma/client";
import { deleteAttachments } from "@/utils/file-attachments";

// ── Types ───────────────────────────────────────────────────────────────────

export interface TransferResult {
  workspaceId: string;
  action: "transferred" | "deleted";
}

// ── Kinde Management API ────────────────────────────────────────────────────

/**
 * Obtain a Kinde Management API access token via the client-credentials grant.
 */
async function getKindeAccessToken(): Promise<string | null> {
  const clientId = process.env.KINDE_MANAGEMENT_CLIENT_ID;
  const clientSecret = process.env.KINDE_MANAGEMENT_CLIENT_SECRET;
  const issuerUrl = process.env.KINDE_ISSUER_URL;

  if (!clientId || !clientSecret || !issuerUrl) {
    console.warn(
      "[GET_KINDE_TOKEN] Skipping: KINDE_MANAGEMENT_CLIENT_ID / SECRET not set in environment variables.",
    );
    return null;
  }

  const baseUrl = issuerUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        audience: `${baseUrl}/api`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[GET_KINDE_TOKEN] Failed:", res.status, body);
      return null;
    }

    const { access_token } = await res.json();
    return access_token;
  } catch (error) {
    console.error("[GET_KINDE_TOKEN] Exception thrown:", error);
    return null;
  }
}

/**
 * Delete a user from Kinde's auth system via the Management API.
 * Non-blocking: failures are logged but won't prevent DB deletion.
 */
export async function deleteKindeUser(kindeUserId: string): Promise<void> {
  try {
    const baseUrl =
      process.env.KINDE_ISSUER_URL?.replace(/\/+$/, "") ?? "";

    const accessToken = await getKindeAccessToken();
    if (!accessToken) return;

    // Fixed path & query param structure for user deletion
    const res = await fetch(`${baseUrl}/api/v1/user?id=${kindeUserId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[DELETE_KINDE_USER] Delete failed:", res.status, body);
      return;
    }

    console.log("[DELETE_KINDE_USER] Successfully deleted user from Kinde");
  } catch (error) {
    console.error("[DELETE_KINDE_USER] Exception thrown during user deletion:", error);
  }
}

// ── Ownership transfer ──────────────────────────────────────────────────────

/**
 * Promote the first member with the given access level to OWNER and transfer
 * workspace ownership. Returns true if a member was found and promoted.
 */
async function promoteToOwner(
  workspaceId: string,
  excludeUserId: string,
  fromLevel: AccessLevel,
): Promise<boolean> {
  const member = await db.workspaceMembers.findFirst({
    where: {
      workspaceId,
      accessLevel: fromLevel,
      userId: { not: excludeUserId },
    },
    select: { id: true, userId: true },
  });

  if (!member) return false;

  await db.$transaction([
    db.workspaceMembers.update({
      where: { id: member.id },
      data: { accessLevel: AccessLevel.OWNER },
    }),
    db.workspace.update({
      where: { id: workspaceId },
      data: { ownerId: member.userId },
    }),
  ]);

  return true;
}

/**
 * Delete all UploadThing files associated with tasks/projects in a workspace.
 * Traverses the task → project relation chain for robustness.
 */
async function cleanupWorkspaceFiles(workspaceId: string): Promise<void> {
  try {
    const files = await db.file.findMany({
      where: {
        task: {
          project: {
            workspaceId,
          },
        },
      },
      select: { url: true },
    });

    if (files.length > 0) {
      await deleteAttachments(files.map((f) => f.url));
    }
  } catch (error) {
    console.error("[CLEANUP_WORKSPACE_FILES] Error cleaning up workspace files:", error);
  }
}

/**
 * For every workspace where the user is the sole OWNER member:
 *   1. Try ADMIN → promote to OWNER and transfer ownership
 *   2. Fallback to MEMBER → promote to OWNER and transfer
 *   3. If no members remain → delete the workspace (with file cleanup)
 */
export async function handleSoleOwnershipTransfer(
  userId: string,
): Promise<TransferResult[]> {
  const soleOwnedWorkspaces = await db.workspace.findMany({
    where: {
      ownerId: userId,
      members: {
        none: {
          accessLevel: AccessLevel.OWNER,
          userId: { not: userId },
        },
      },
    },
    select: { id: true },
  });

  const results: TransferResult[] = [];

  for (const workspace of soleOwnedWorkspaces) {
    try {
      const promoted =
        (await promoteToOwner(workspace.id, userId, AccessLevel.ADMIN)) ||
        (await promoteToOwner(workspace.id, userId, AccessLevel.MEMBER));

      if (promoted) {
        results.push({ workspaceId: workspace.id, action: "transferred" });
      } else {
        await cleanupWorkspaceFiles(workspace.id);
        await db.workspace.delete({ where: { id: workspace.id } });
        results.push({ workspaceId: workspace.id, action: "deleted" });
      }
    } catch (workspaceError) {
      console.error(
        `[SOLE_OWNERSHIP_TRANSFER] Failed for workspace ${workspace.id}:`,
        workspaceError,
      );
    }
  }


  return results;
}
