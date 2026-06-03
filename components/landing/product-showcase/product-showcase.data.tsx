import { Layout, Pointer, Zap } from "lucide-react";
import React from "react";

export interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

export interface TabData {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

export const showcaseTabs: TabData[] = [
  {
    value: "tab-1",
    icon: <Zap className="h-auto w-4 shrink-0" />,
    label: "Fast Workflows",
    content: {
      badge: "Automations",
      title: "Automate your daily routines.",
      description:
        "Save time by setting up custom triggers and actions. VelloX automates repetitive tasks so your team can focus on what really matters.",
      buttonText: "Explore Automations",
      imageSrc:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Workflow Automations",
    },
  },
  {
    value: "tab-2",
    icon: <Pointer className="h-auto w-4 shrink-0" />,
    label: "Seamless Tracking",
    content: {
      badge: "Kanban & Lists",
      title: "Visualize your team's progress.",
      description:
        "Use powerful Kanban boards, interactive lists, and timelines to track every task from inception to completion with perfect clarity.",
      buttonText: "See Views",
      imageSrc:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1939&auto=format&fit=crop",
      imageAlt: "Kanban boards",
    },
  },
  {
    value: "tab-3",
    icon: <Layout className="h-auto w-4 shrink-0" />,
    label: "Advanced Analytics",
    content: {
      badge: "Dashboards",
      title: "Make data-driven decisions.",
      description:
        "Get a bird's-eye view of your project health. Monitor team velocity, identify bottlenecks, and generate comprehensive reports instantly.",
      buttonText: "View Analytics",
      imageSrc:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      imageAlt: "Analytics Dashboard",
    },
  },
];
