"use client";

import Image from "next/image";

import { SectionHeader } from "../../ui/section-header";
import { showcaseData } from "./product-showcase.data";

export const ProductShowcase = () => {
  return (
    <section id="product-showcase" className="py-24 md:py-32 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-20 md:mb-32">
          <SectionHeader
            badge="How It Works"
            title="Everything you need to work faster"
            description="VelloX brings all your tasks, and teammates into one unified workspace designed for speed and clarity."
          
          />
        </div>
        
        <div className="flex flex-col gap-24 md:gap-32">
          {showcaseData.map((item, index) => (
            <div key={item.value} className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 md:gap-24 items-start`}>
              {/* Left Content */}
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-muted-foreground font-mono text-sm tracking-widest font-semibold uppercase">
                    / {item.content.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-[1.2] mb-4">
                  {item.content.title}
                </h3>
                <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed font-light">
                  {item.content.description}
                </p>
              </div>
              
              {/* Right Visual */}
              <div className="flex-1 w-full">
                <div className="w-full aspect-4/3 sm:aspect-16/11 relative rounded-sm border border-foreground/30 bg-muted p-4 sm:p-6 lg:p-8">
                  
                  {/* Inner Image Container */}
                  <div className="relative w-full h-full rounded-sm overflow-hidden border border-border/40 bg-background">
                     <Image 
                       src={item.content.imageSrc} 
                       alt={item.content.imageAlt} 
                       fill 
                       className="object-cover" 
                       sizes="(max-width: 768px) 100vw, 50vw"
                     />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
