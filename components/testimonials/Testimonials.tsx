"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { firstRow, secondRow } from "./testimonials.data";
import { TestimonialCard } from "./TestimonialCard";

export const Testimonials = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-24 md:py-32 dark:bg-background border-t border-border/40 overflow-hidden relative">
      <div className="px-4 md:px-6 relative z-10 mb-16">
        <SectionHeader
          title="Loved by modern teams"
          description="Don't just take our word for it. Here is what industry leaders have to say about their experience with VelloX."
        />
      </div>

      <div className="relative flex flex-col gap-6 md:gap-8 overflow-hidden z-10 w-full py-4">
        {/* Left and Right Fade masks for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-1/6 md:w-1/4 bg-linear-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/6 md:w-1/4 bg-linear-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Row 1: Scrolls Left */}
        <motion.div 
          className="flex gap-6 md:gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
        >
          {firstRow.map((t, i) => (
            <TestimonialCard key={`row1-${i}`} testimonial={t} />
          ))}
        </motion.div>

        {/* Row 2: Scrolls Right */}
        <motion.div 
          className="flex gap-6 md:gap-8 w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        >
          {secondRow.map((t, i) => (
            <TestimonialCard key={`row2-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
