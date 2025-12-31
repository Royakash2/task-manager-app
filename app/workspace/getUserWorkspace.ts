import db from "@/lib/db";
import { userRequired } from "../data/user/get-user";

export const getUserWorkspaces = async () => {
  try {
    const { user } = await userRequired();
    // Add this check
    if (!user) return null; 

    const workspace =await db.user.findUnique(
        {
            where: {
                id: user.id,
            },
            include: {
                workspaces: {
                    select: {
                        id: true,
                        userId: true,
                        workspace: {select:{name:true}},
                        workspaceId: true,
                        accessLevel:true,
                        createdAt:true
                    }
                }
               
            },
        }
    )
    return workspace
  } catch (error) {
    console.log(error);
  }
};
