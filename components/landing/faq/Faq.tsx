"use client";

import { SectionHeader } from "../../ui/section-header";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqData } from "./faq.data";

export const Faq = () => {
  return (
    <section id="faq" className="py-24 md:py-32 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <div className="sticky top-24 lg:top-32">
              <SectionHeader
                badge="FAQ"
                title="Frequently Asked Questions"
              />
            </div>
          </div>
          
          <div className="lg:col-span-7 mt-4 lg:mt-0">
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/40"
                >
                  <AccordionTrigger
                    className="flex flex-1 items-center justify-between py-6 sm:py-8 text-left font-mono text-[17px] sm:text-xl md:text-[22px] tracking-tight transition-all outline-none text-foreground group uppercase hover:no-underline [&>svg]:hidden"
                  >
                    <span>{faq.question}</span>
                    <div className="relative w-5 h-5 flex items-center justify-center font-mono text-muted-foreground group-data-[state=open]:text-foreground transition-colors ml-4 shrink-0 text-xl">
                      <span className="absolute transition-all duration-300 transform rotate-0 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0 opacity-100">+</span>
                      <span className="absolute transition-all duration-300 transform -rotate-90 group-data-[state=open]:rotate-0 opacity-0 group-data-[state=open]:opacity-100">-</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-10 pt-2 pr-4 sm:pr-12 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
