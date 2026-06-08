import db from "@/lib/db";
// refresh
import { userRequired } from "../user/get-user";
import { verifyAccess, getUserRole } from "@/lib/permissions";

export const getUserWorkspaceProjects = async (workspaceId: string) => {
  try {
    const { user: kindeUser } = await userRequired();
    await verifyAccess(kindeUser.id, workspaceId);
    const role = await getUserRole(kindeUser.id, workspaceId);
    const query =
      role === "OWNER" || role === "ADMIN"
        ? { workspaceId }
        : {
            projectAccess: {
              some: {
                hasAccess: true,
                workspaceMember: { userId: kindeUser.id, workspaceId },
              },
            },
          };
    const [projects, workspaceMembers] = await Promise.all([
      db.project.findMany({
        where: query,
        select: {
          id: true,
          name: true,
          description: true,
          workspaceId: true,
        },
      }),
      db.workspaceMembers.findMany({
        where: {
          workspaceId,
        },
        include: {
            user:{
                select:{
                    id:true,
                    name:true,
                    image:true,
                    
                }
            }
        }
      }),
    ]);
    return {projects, workspaceMembers}
  } catch (error) {
    console.error(error);
    return {
      projects: [],
      workspaceMembers: [],
    };
  }
};
