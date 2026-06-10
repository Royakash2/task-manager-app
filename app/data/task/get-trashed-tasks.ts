import db from "@/lib/db";

export const getTrashedTasks = async (workspaceId: string) => {
  try {
    const tasks = await db.task.findMany({
      where: {
        deletedAt: { not: null },
        project: { workspaceId },
      },
      select: {
        id: true,
        title: true,
        deletedAt: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { deletedAt: "desc" },
    });

    return { tasks };
  } catch (error) {
    console.error("[GET_TRASHED_TASKS_ERROR]:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch trashed tasks" };
  }
};
