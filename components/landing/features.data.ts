export type FeatureItem = {
  title: string;
  description: string;
  image: string;
};

export type FeatureData = {
  title: string;
  features: FeatureItem[];
};

export const featureData: FeatureData = {
  title: "Everything you need to hit the ground running",
  features: [
    {
      title: "Visual Project Management",
      description:
        "Track tasks across Kanban boards, table views, and dashboards. Drag and drop to update status, filter by priority, and see progress at a glance.",
      image: "/visual.png",
    },
    {
      title: "Real-Time Collaboration",
      description:
        "Comment on tasks, get instant notifications when things change, attach files, and document your work with a rich text editor — all in real-time.",
      image: "/realtime.png",
    },
    {
      title: "Workspace & Access Control",
      description:
        "Invite your team, assign roles, and control who sees what — from workspace-level permissions down to individual projects.",
      image: "/workcpace-access.png",
    },
  ],
};
