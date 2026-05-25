import db from "@/lib/db";
import { userRequired } from "../user/get-user";

export const getProjectById = async (projectId: string) => {
    await userRequired();

    const tasks = await db.task.findMany({
        where: {
            projectId,
            deletedAt: null,
        },
        include: {
            assigneeTo: {
                select: { id: true, name: true, email: true, image: true },
            },
            project: { select: { id: true, name: true, workspaceId: true } },
            attachments: true,
        },
    });

    return { tasks };
};