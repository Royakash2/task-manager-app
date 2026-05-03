import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface CtaBlockProps {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  buttonPrimary: {
    label: string;
    href: string;
  };
  buttonSecondary: {
    label: string;
    href: string;
  };
}

export const CtaBlock = ({
  title = "Blocks built with Shadcn & Tailwind",
  description = "Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  imageSrc = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
  imageAlt = "placeholder hero",
  buttonPrimary = {
    label: "Get Started",
    href: "/",
  },
  buttonSecondary = {
    label: "Learn More",
    href: "/",
  },
}: CtaBlockProps) => {
  return (
    <section className="py-24 md:py-32 bg-muted/20 border-t border-border/40">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 mt-0 text-4xl font-bold tracking-tight text-balance lg:text-5xl text-foreground">
              {title}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="">
                <a href={buttonPrimary.href}>
                  {buttonPrimary.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="">
                <a href={buttonSecondary.href}>
                  {buttonSecondary.label}
                </a>
              </Button>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1000}
              height={600}
              className="max-h-[500px] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
