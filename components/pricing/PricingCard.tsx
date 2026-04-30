import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PricingTier } from "./pricing.data";

export const PricingCard = ({ tier }: { tier: PricingTier }) => {
  return (
    <Card
      className={`relative flex flex-col p-8 py-8 rounded-3xl transition-all duration-300 gap-0 ${
        tier.highlighted
          ? "bg-white dark:bg-slate-900 border-blue-500/50 dark:border-blue-500/50 shadow-2xl shadow-blue-900/10 dark:shadow-none md:-translate-y-4 ring-1 ring-blue-500/20 z-10"
          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm"
      }`}
    >
      {tier.highlighted && (
        <Badge className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-md border-transparent">
          Most Popular
        </Badge>
      )}

      <CardHeader className="p-0 gap-0 mb-6">
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {tier.name}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
          {tier.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1">
        <div className="mb-8 flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
          {tier.period && (
            <span className="text-slate-500 dark:text-slate-400 font-medium">{tier.period}</span>
          )}
        </div>

        <ul className="flex flex-col gap-4 mb-8 flex-1">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-blue-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-0">
        <Button
          variant={tier.highlighted ? "default" : "outline"}
          className={`w-full rounded-xl py-6 font-semibold ${tier.highlighted ? "shadow-lg shadow-blue-500/25" : ""}`}
        >
          {tier.cta}
        </Button>
      </CardFooter>
    </Card>
  );
};

