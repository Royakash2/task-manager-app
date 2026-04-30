"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Product Manager at TechFlow",
    content: "VelloX completely transformed how our team collaborates. The visual boards are incredibly intuitive, and we've cut our meeting times in half.",
    avatar: "S",
    color: "from-blue-500 to-indigo-500"
  },
  {
    name: "Marcus Chen",
    role: "Lead Developer at Nexus",
    content: "Finally, a task manager that doesn't feel like a chore to use. The velocity charts give me exactly what I need to track my team's sprint progress.",
    avatar: "M",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Emily Rodriguez",
    role: "Design Director",
    content: "The aesthetic of VelloX alone makes me want to use it. But beyond the beautiful interface, the real-time activity feed keeps everyone in the loop effortlessly.",
    avatar: "E",
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    content: "We switched from Jira to VelloX and haven't looked back. It has all the power we need without the clunky, overwhelming interface.",
    avatar: "D",
    color: "from-rose-500 to-orange-500"
  },
  {
    name: "Anna Smith",
    role: "Operations Lead",
    content: "The bento box dashboard is genius. Seeing my calendar, kanban, and team activity in one unified view saves me hours of context switching every week.",
    avatar: "A",
    color: "from-amber-500 to-orange-500"
  },
  {
    name: "James Wilson",
    role: "Engineering Manager",
    content: "Role-based access actually works smoothly here. The onboarding was painless, and my team actually enjoys updating their tasks now.",
    avatar: "J",
    color: "from-cyan-500 to-blue-500"
  }
];

// Duplicate arrays for the seamless loop (we double it inside the render)
const firstRow = [...testimonials, ...testimonials];
const secondRow = [...[...testimonials].reverse(), ...[...testimonials].reverse()];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="w-[300px] md:w-[400px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
    <div className="flex items-center gap-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed flex-1">
      &quot;{testimonial.content}&quot;
    </p>
    <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <div className={`w-10 h-10 rounded-full bg-linear-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-md`}>
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{testimonial.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-24 md:py-32  dark:bg-background border-t border-border/40 overflow-hidden relative">
      <div className="  px-4 md:px-6 relative z-10 mb-16">
        <SectionHeader
          title="Loved by modern teams"
          description="Don't just take our word for it. Here is what industry leaders have to say about their experience with VelloX."
        />
      </div>

      <div className="relative flex flex-col gap-6 md:gap-8 overflow-hidden z-10 w-full">
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
