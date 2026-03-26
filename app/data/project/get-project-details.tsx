import db from "@/lib/db";
import { userRequired } from "../user/get-user";
import { TaskStatus } from "@prisma/client";

export const getProjectDetails = async (workspaceId: string, projectId: string) => {
    try {
        const { user } = await userRequired()
        const [isUserMember, totalWorkspaceMembers] = await Promise.all([
            db.workspaceMembers.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: user.id,
                        workspaceId
                    }
                }
            }),
            db.workspaceMembers.count({
                where: {
                    workspaceId
                }
            })
        ])
        if (!isUserMember) {
            throw new Error("You are not a member of this workspace")
        }

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
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    tasks: {
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
                        }
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
                }
            })
        ]);

        const tasks = {
            total: project?.tasks.length,
            completed: project?.tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
            inProgress: project?.tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
            overdue: project?.tasks.filter((task) => task.status !== TaskStatus.COMPLETED && task.dueDate && new Date(task.dueDate) < new Date()).length,
            items: project?.tasks
        }
        return {
           project : {
            ...project,
           members : project?.projectAccess.map((access) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            access.workspaceMember
           })
           },
           tasks,
           activities: project?.activities,
           totalWorkspaceMembers,
           comments
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: true,
            message: "Failed to get project details",
        };
    }
}