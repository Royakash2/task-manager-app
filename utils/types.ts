import { $Enums, AccessLevel, Comment, WorkspaceMembers, Task, TaskStatus } from "@prisma/client";

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
  };
}

export interface CommentProps extends Comment {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

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
  }[];
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

export interface ProjectTaskProps extends Task {
  assigneeTo: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  project: { id: string; name: string };
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: ProjectTaskProps[];
}
