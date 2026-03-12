import { $Enums, AccessLevel, WorkspaceMembers } from "@prisma/client";

export interface workspaceMembersProps extends WorkspaceMembers {
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
    accessLevel: AccessLevel;
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

export interface workspaceProps {
  id: string;
  userId: string;
  createdAt: Date;
  workspaceId: string;
  accessLevel: $Enums.AccessLevel;
  workspace: {
    name: string;
  };
}
