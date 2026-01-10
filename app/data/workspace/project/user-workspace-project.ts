import db from "@/lib/db";
import { userRequired } from "../../user/get-user";

export const getWorkspaceProjectByWorkspceId = async (workspaceId: string) => {
    try {
        const user = await userRequired();
       const isUserMember = await db.workspaceMembers.findUnique({
        where:{
            userId_workspaceId:{
                userId:user.user?.id as string,
                workspaceId
            }
       }
       });
       if(!isUserMember){
       throw new Error("you are not a member of this workspace");
       }
    } catch (error) {
        console.log(error);
        return{
        success:false,
        error:true,
        message:"Failed to get workspace project"
    }
    }
    
}