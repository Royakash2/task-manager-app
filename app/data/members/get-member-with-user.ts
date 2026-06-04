import db from "@/lib/db";

/**
 * Fetch a workspace member by their record ID, including their name.
 */
export const getMemberWithUser = (memberId: string) =>
  db.workspaceMembers.findUnique({
    where: { id: memberId },
    include: { user: { select: { name: true } } },
  });
