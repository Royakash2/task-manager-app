import { User, Workspace } from "@prisma/client";

export interface workspaceMembersProps extends Workspace {
    user:{
        id: string;
        name: string;
        image: string;
        email: string;
    }
   
}