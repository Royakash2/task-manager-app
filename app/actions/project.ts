"use server";
import { projectDataType } from "@/components/project/create-project-form";
import { userRequired } from "../data/user/get-user";
import db from "@/lib/db";
import { projectSchema } from "@/lib/schema";

export const createProject = async (data: projectDataType) => {
    const { user } = await userRequired();
    const workspace = await db.workspace.findUnique({
        where: {
            id: data?.workspaceId,
        },
        include: {
          projects:{select:{id:true}}
        },

    });

    const validateData = projectSchema.safeParse(data);
    const workspaceMemberMembers = await db.workspaceMembers.findMany({
        where:{
            workspaceId:data?.workspaceId,
          
        }
    });
    const isMember = workspaceMemberMembers.some((member) => member.userId === user?.id);
    if(!isMember){
        throw new Error("You are not a member of this workspace");
    }
    
   
};
   
   