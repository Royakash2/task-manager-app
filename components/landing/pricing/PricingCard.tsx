"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import type { PricingTier } from "./pricing.data";

export const PricingCard = ({ tier }: { tier: PricingTier }) => {
  const { isAuthenticated } = useKindeBrowserClient();
  const popular = tier.highlighted && !tier.comingSoon;
  const isFreeTier = !tier.comingSoon && tier.cta === "Get Started Free";

  return (
    <div className={`w-full flex flex-col bg-muted border ${popular ? 'border-foreground/40 ' : 'border-border '} rounded p-6 sm:p-8 relative min-h-[500px] hover:border-foreground/30 transition-colors`}>
      {popular && (
        <div className="absolute top-6 right-6 px-2.5 py-1 border border-foreground/30 bg-foreground/5 rounded text-[10px] tracking-widest uppercase font-semibold text-foreground">
          Popular
        </div>
      )}

      {tier.comingSoon && (
        <div className="absolute top-6 right-6 px-2.5 py-1 border border-muted-foreground/30 bg-muted rounded text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
          Coming Soon
        </div>
      )}

      <div className="flex flex-col gap-4 mb-8 mt-2">
        <h3 className={`text-3xl font-medium tracking-tight ${tier.comingSoon ? 'text-muted-foreground' : 'text-foreground'}`}>{tier.name}</h3>
        <div className="flex items-baseline">
          <span className={`text-4xl font-semibold tracking-tight ${tier.comingSoon ? 'text-muted-foreground' : 'text-foreground'}`}>{tier.price}</span>
          {tier.period && (
            <span className={`text-4xl font-semibold tracking-tight ${tier.comingSoon ? 'text-muted-foreground' : 'text-foreground'}`}>{tier.period}</span>
          )}
        </div>
      </div>

      <div className={`text-sm font-medium mb-6 ${tier.comingSoon ? 'text-muted-foreground' : 'text-foreground'}`}>
        Whats included :
      </div>

      <ul className="flex flex-col gap-4 mb-12">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className={`w-5 h-5 shrink-0 ${tier.comingSoon ? 'text-muted-foreground' : 'text-foreground'}`} strokeWidth={2.5} />
            <span className="text-[15px] leading-snug text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {isFreeTier ? (
        <Button asChild className="w-full mt-auto text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-sm" variant="default" size="lg">
          {isAuthenticated ? (
            <Link href="/workspace">{tier.cta}</Link>
          ) : (
            <RegisterLink>{tier.cta}</RegisterLink>
          )}
        </Button>
      ) : (
        <Button
          className={`w-full mt-auto text-sm font-semibold ${
            popular
              ? "bg-foreground text-background hover:bg-foreground/90 shadow-sm"
              : tier.comingSoon
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                : "bg-background border border-border hover:bg-muted text-foreground"
          }`}
          variant={popular ? "default" : "outline"}
          size="lg"
          disabled={tier.comingSoon}
        >
          {tier.cta}
        </Button>
      )}
    </div>
  );
};
