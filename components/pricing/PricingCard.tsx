"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import type { PricingTier } from "./pricing.data";

export const PricingCard = ({ tier }: { tier: PricingTier }) => {
  const inverse = tier.highlighted;
  const popular = tier.highlighted;

  return (
    <Card
      className={` w-full border ${inverse ? "bg-black text-white dark:bg-black" : "bg-card text-card-foreground"}`}
    >
      <CardHeader className="flex flex-row justify-between items-start gap-4 pb-2">
        <CardTitle className={`text-lg font-bold ${inverse ? "text-white/70" : "text-muted-foreground"}`}>
          {tier.name}
        </CardTitle>
        {popular && (
          <motion.div
            animate={{ backgroundPositionX: "-100%" }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            className="text-sm px-3 py-1 rounded-xl border border-white/20 bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] bg-size-[200%] text-transparent bg-clip-text font-medium whitespace-nowrap"
          >
            Popular
          </motion.div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-5xl font-bold tracking-tighter leading-none">{tier.price}</span>
          {tier.period && (
            <span className={`tracking-tight font-semibold ${inverse ? "text-white/60" : "text-muted-foreground"}`}>
              {tier.period}
            </span>
          )}
        </div>
        <p className={`mt-4 text-sm ${inverse ? "text-white/70" : "text-muted-foreground"}`}>
          {tier.description}
        </p>
        <Button
          variant={inverse ? "secondary" : "default"}
          className="w-full mt-6"
        >
          {tier.cta}
        </Button>
        <ul className="flex flex-col gap-4 mt-8 text-sm">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <Check className={`h-4 w-4 shrink-0 ${inverse ? "text-white/70" : "text-primary"}`} />
              <span className={inverse ? "text-white/80" : "text-muted-foreground"}>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
