import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Cta = () => {
  return (
    <section className="relative w-full py-32 md:py-48 bg-background overflow-hidden border-t border-border/40 flex items-center justify-center">
      {/* Subtle dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808033_2px,transparent_2px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1] mb-10">
          Ready to supercharge your team&apos;s workflow?
        </h2>
        
        <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-6">
          <Link href="/api/auth/register">
            Try for free <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
