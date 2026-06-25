import { $Enums, AccessLevel, Comment, WorkspaceMembers, Task, TaskStatus, NotificationType } from "@prisma/client";

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
  }[];
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

export interface TaskStats {
  completed: number;
  inProgress: number;
  overdue: number;
  total: number;
  items: ProjectTaskProps[];
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: ProjectTaskProps[];
}

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  userId: string;
  actorId: string | null;
  actor: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  workspaceId: string | null;
  projectId: string | null;
  taskId: string | null;
  createdAt: Date;
}

export interface WorkspaceMemberProps {
  id: string;
  userId: string;
  accessLevel: AccessLevel;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

// ── Dashboard types ─────────────────────────────────────────────────────────

export interface ProjectDashboardStat {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  memberCount: number;
  members: { id: string; name: string; image: string | null }[];
  lastActivityAt: Date | null;
}

export interface DashboardActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  user: { name: string; image: string | null };
}

export interface WorkspaceDashboardData {
  workspace: {
    name: string;
    description: string | null;
  };
  currentUserRole: AccessLevel | null;
  taskStats: {
    total: number;
  };
  projectsStats: ProjectDashboardStat[];
  memberCount: number;
  workspaceMembers: workspaceMembersProps[];
  recentActivities: DashboardActivityItem[];
}
