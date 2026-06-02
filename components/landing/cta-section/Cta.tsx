import { CtaBlock } from "@/components/ui/cta";

export const Cta = () => {
  return (
    <CtaBlock   
      title="Ready to supercharge your team's workflow?"
      description="Join thousands of modern teams using VelloX to manage projects, track velocity, and deliver results faster. Start building your ultimate workspace today."
      imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
      imageAlt="Team collaborating on VelloX"
      buttonPrimary={{
        label: "Get Started Free",
        href: "/api/auth/register"
      }}
      buttonSecondary={{
        label: "See Pricing",
        href: "#pricing"
      }}
    />
  );
};
