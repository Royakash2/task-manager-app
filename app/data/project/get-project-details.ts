import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { verifyAccess } from "@/lib/permissions";
import { TaskStatus } from "@prisma/client";

export const getProjectDetails = async (workspaceId: string, projectId: string) => {
  try {
    const { user } = await userRequired();

    await verifyAccess(user.id, workspaceId, projectId);

    const totalWorkspaceMembers = await db.workspaceMembers.count({
        where: {
            workspaceId
        }
    })

    const [project, comments] = await Promise.all([
        db.project.findUnique({
            where: {
                id: projectId
            },
            include: {
                projectAccess: {
                    include: {
                        workspaceMember: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                        email: true,
                                    }
                                }
                            }
                        }
                    }
                },
                tasks: {
                    where: { deletedAt: null },
                    include: {
                        assigneeTo: {
                            select: {
                                name: true,
                                image: true,
                                id: true
                            }
                        },
                        project: {
                            select: {
                                name: true,
                                id: true,

                            }
                        }
                    }
                },
                activities: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 50
                }
            }
        }),
        db.comment.findMany({
            where: {
                projectId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        })
    ]);

    if (!project) {
      return { error: "Project not found" };
    }

    const tasks = {
        total: project.tasks.length,
        completed: project.tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
        inProgress: project.tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
        overdue: project.tasks.filter((task) => task.status !== TaskStatus.COMPLETED && task.dueDate && new Date(task.dueDate) < new Date()).length,
        items: project.tasks,
    }
    return {
       project : {
        ...project,
       members : project.projectAccess.map((access) => access.workspaceMember)
       },
       tasks,
       activities: project.activities,
       totalWorkspaceMembers,
       comments
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch project details" };
  }
}