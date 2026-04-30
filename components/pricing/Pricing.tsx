import { SectionHeader } from "@/components/ui/section-header";
import { tiers } from "./pricing.data";
import { PricingCard } from "./PricingCard";

export const Pricing = () => {
  return (
    <section id="pricing" className="w-full py-24 md:py-32 bg-muted/30 dark:bg-muted/10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader
          title="Simple, transparent pricing"
          description="Choose the plan that's right for your team. Start for free, upgrade when you need to."
        />

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto items-stretch md:items-center">
          {tiers.map((tier, i) => (
            <PricingCard key={i} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
};
