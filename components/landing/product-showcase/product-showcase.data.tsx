import { Columns3, ClipboardList, Layout } from "lucide-react";
import React from "react";

export interface ShowcaseContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ShowcaseData {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: ShowcaseContent;
}

export const showcaseData: ShowcaseData[] = [
  {
    value: "tab-1",
    icon: <Columns3 className="h-auto w-4 shrink-0" />,
    label: "Kanban & Table",
    content: {
      badge: "Views",
      title: "Track tasks your way.",
      description:
        "Switch between Kanban boards, table views, and dashboards \u2014 all in one project. Drag and drop to update status, sort by any column, and see your workflow from every angle.",
      buttonText: "Explore Views",
      imageSrc:
        "/showcase-views.png",
      imageAlt: "Kanban boards and table view",
    },
  },
  {
    value: "tab-2",
    icon: <ClipboardList className="h-auto w-4 shrink-0" />,
    label: "Task Management",
    content: {
      badge: "Tasks",
      title: "From inception to completion.",
      description:
        "Create tasks with descriptions, due dates, priority levels, and file attachments. Assign team members, write rich documentation with the built-in editor, and track everything in one place.",
      buttonText: "See Tasks",
      imageSrc:
        "/showcase-tasks.png",
      imageAlt: "Task detail view",
    },
  },
  {
    value: "tab-3",
    icon: <Layout className="h-auto w-4 shrink-0" />,
    label: "Real-Time Sync",
    content: {
      badge: "Collaboration",
      title: "Stay in sync, instantly.",
      description:
        "Comment on tasks, get real-time notifications when things change, and track every update through the activity feed. Invite your team, assign roles, and control who has access to what.",
      buttonText: "Learn More",
      imageSrc:
        "/showcase-collaboration.png",
      imageAlt: "Team collaboration and notifications",
    },
  },
];
