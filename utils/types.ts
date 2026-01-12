import { AccessLevel, Workspace } from "@prisma/client";

export interface workspaceMembersProps extends Workspace {
  user: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  projectAccess: {
    id: string;
    hasAccess: boolean;
    projectId: string;
  };
}

export interface projectProps {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  members: {
    id: string;
    userId: string;
    workspaceId: string;
    accessLevel:AccessLevel;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      image?: string;
      email: string;
    };
  };
}
