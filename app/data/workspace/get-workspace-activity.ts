import db from "@/lib/db";
import type { DashboardActivityItem } from "@/utils/types";

export const getWorkspaceActivity = async (
  workspaceId: string,
): Promise<DashboardActivityItem[]> => {
  const activities = await db.activity.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      type: true,
      description: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return activities.map((a) => ({
    id: a.id,
    type: a.type,
    description: a.description ?? "",
    createdAt: a.createdAt,
    user: a.user,
  }));
};
