import db from "@/lib/db";

/**
 * Standardized error response for server actions.
 */
export const actionError = (error: unknown, fallback: string): { success: false; error: string } => ({
  success: false,
  error: error instanceof Error ? error.message : fallback,
});

/**
 * Log an activity record in the database.
 * Used across all server actions to maintain a consistent activity feed.
 */
export const logActivity = (
  type: string,
  description: string,
  userId: string,
  projectId?: string,
  workspaceId?: string,
) =>
  db.activity.create({
    data: {
      type,
      description,
      userId,
      ...(projectId ? { projectId } : {}),
      ...(workspaceId ? { workspaceId } : {}),
    },
  });
