import db from "@/lib/db";
import { userRequired } from "../../user/get-user";
import { Prisma } from "@/lib/generated/prisma/client";
import { $Enums } from "@prisma/client";

export const getWorkspaceProjectByWorkspceId = async (workspaceId: string) => {
  try {
    const user = await userRequired();
    const isUserMember = await db.workspaceMembers.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.user?.id as string,
          workspaceId,
        },
      },
    });
    if (!isUserMember) {
      throw new Error("you are not a member of this workspace");
    }
    const query: Prisma.ProjectWhereUniqueInput =
      isUserMember.accessLevel === $Enums.AccessLevel.OWNER
        ? { workspaceId }
        : {
            projectAccess: {
              some: {
                hasAccess: true,
                workspaceMember: { userId: user?.user?.id, workspaceId },
              },
            },
          };
    const [projects, projectAccess] = await Promise.all([
      db.project.findMany({
        where: query,
        select: {
          id: true,
          name: true,
          description: true,
          workspaceId: true,
        },
      }),
    ]);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to get workspace project",
    };
  }
};
