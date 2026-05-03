"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showcaseTabs } from "./product-showcase.data";
import { ShowcaseTabContent } from "./ShowcaseTabContent";
import { SectionHeader } from "../ui/section-header";

export const ProductShowcase = () => {
  return (
    <section id="product-showcase" className="py-24 md:py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          badge="Product Showcase"
          title="Everything you need to work faster"
          description="VelloX brings all your tools, tasks, and teammates into one unified workspace designed for speed and clarity."
        />
        
        <Tabs defaultValue={showcaseTabs[0].value} className="mt-12 md:mt-16">
          <TabsList className="flex flex-wrap h-auto w-full max-w-2xl mx-auto items-center justify-center gap-2 sm:gap-4 md:gap-8 bg-transparent">
            {showcaseTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2  px-4 py-2.5 text-sm font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all cursor-pointer"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mx-auto mt-12 max-w-7xl rounded-2xl bg-muted/40 dark:bg-muted/10 border border-border/50 p-6 lg:p-12 shadow-sm">
            {showcaseTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0 outline-none">
                <ShowcaseTabContent content={tab.content} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};
