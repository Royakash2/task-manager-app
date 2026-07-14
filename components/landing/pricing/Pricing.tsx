import { SectionHeader } from "../../ui/section-header";
import { tiers } from "./pricing.data";
import { PricingCard } from "./PricingCard";

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/20 dark:bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 ">
      
        <SectionHeader
          badge="Pricing"
          title="Simple pricing for every team"
          description="Whether youre starting small or scaling fast, our product grows with your needs."
        />

        <div className="flex flex-col w-full gap-3 items-center lg:flex-row lg:justify-center">
          {tiers.map((tier, i) => (
            <PricingCard key={i} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
};
