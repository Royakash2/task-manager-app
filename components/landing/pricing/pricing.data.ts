export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  comingSoon?: boolean;
};

export const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "All features, completely free — no limits.",
    features: [
      "Unlimited projects & workspaces",
      "Kanban boards with drag & drop",
      "Table view with sorting & filtering",
      "Project dashboards & charts",
      "Task management with due dates & priorities",
      "Rich text documentation editor",
      "File attachments",
      "Real-time team collaboration & comments",
      "Role-based access & member invites",
      "Real-time notifications & activity feed",
    ],
    cta: "Get Started Free",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$—",
    period: "",
    description: "For growing teams with advanced needs.",
    features: [
      "Everything in Free",
      "Premium features — coming soon",
    ],
    cta: "Coming Soon",
    highlighted: false,
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "$—",
    period: "",
    description: "For large organizations.",
    features: [
      "Everything in Free",
      "Enterprise features — coming soon",
    ],
    cta: "Coming Soon",
    highlighted: false,
    comingSoon: true,
  },
];
