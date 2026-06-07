import db from "@/lib/db";
import { userRequired } from "../user/get-user";

export const getUserWorkspaces = async () => {
  try {
    const { user } = await userRequired();

    const workspace = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {    
        workspaces: {
          select: {
            id: true,
            userId: true,
            workspace: { select: { name: true } },
            workspaceId: true,
            accessLevel: true,
            createdAt: true,
          },
        },
      },
    });
    return { data: workspace };
  } catch (error) {
    console.error(error);
    return { data: null };
  }
};
