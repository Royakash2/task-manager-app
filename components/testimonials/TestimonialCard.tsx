import { Star } from "lucide-react";
import type { Testimonial } from "./testimonials.data";

export const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
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
