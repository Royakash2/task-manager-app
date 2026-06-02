import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess } from "@/lib/permissions";

export const getTaskById = async (
  taskId: string,
  workspaceId: string,
  projectId: string,
) => {
  const { user } = await userRequired();

  await verifyAccess(user.id, workspaceId, projectId);

  const [task, comments, documentation] = await Promise.all([
    db.task.findFirst({
      where: { id: taskId, deletedAt: null },
      include: {
        assigneeTo: { select: { id: true, name: true, image: true } },
        attachments: { select: { id: true, name: true, url: true, type: true } },
        project: {
          include: {
            projectAccess: {
              include: {
                workspaceMember: {
                  include: {
                    user: {
                      select: { id: true, name: true, image: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),

    db.comment.findMany({
      where: { taskId: taskId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),

    db.documentation.findUnique({
      where: { taskId },
    }),
  ]);

  if (!task) {
    return {
      task: null,
      comments: [],
      documentation: null,
      currentUserId: user.id,
    };
  }

  const project = {
    ...task.project,
    members: task.project.projectAccess.map((access) => access.workspaceMember),
  };

  return {
    task: { ...task, project },
    comments,
    documentation,
    currentUserId: user.id,
  };
};
