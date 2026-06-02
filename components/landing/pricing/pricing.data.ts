export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

export const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Individuals & small projects",
    features: [
      "Up to 3 projects",
      "Basic Kanban boards",
      "7-day activity history",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "Growing teams",
    features: [
      "Unlimited projects",
      "Advanced workflow automation",
      "Unlimited activity history",
      "Priority 24/7 support",
      "Custom role permissions",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Large organizations",
    features: [
      "Dedicated success manager",
      "SAML SSO & Advanced Security",
      "Custom integrations",
      "Audit logs",
      "Custom contract & SLA",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];
