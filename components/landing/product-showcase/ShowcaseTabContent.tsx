import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TabContent } from "./product-showcase.data";

export const ShowcaseTabContent = ({ content }: { content: TabContent }) => {
  return (
    <div className="grid place-items-center gap-12 lg:grid-cols-2 lg:gap-16 focus-visible:outline-none focus-visible:ring-0 mt-0">
      <div className="flex flex-col gap-6 w-full items-start text-left">
        <Badge variant="outline" className="w-fit bg-background text-sm px-3 py-1 border-border/50">
          {content.badge}
        </Badge>
        <h3 className="text-3xl font-bold lg:text-4xl tracking-tight text-foreground">
          {content.title}
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {content.description}
        </p>
        <Button className="mt-2 w-fit px-8 h-12 shadow-sm" size="lg">
          {content.buttonText}
        </Button>
      </div>
      <div className="w-full relative aspect-video lg:aspect-4/3 rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-muted">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};
