import { Star } from "lucide-react";
import Image from "next/image";
import type { Testimonial } from "./testimonials.data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="w-[300px] md:w-[380px] shrink-0 h-fit bg-white dark:bg-card border-slate-200 dark:border-slate-800 rounded-2xl p-5 py-5 shadow-sm gap-3">
    <CardContent className="p-0 flex flex-col gap-3">
      <div className="flex items-center gap-1 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
        &quot;{testimonial.content}&quot;
      </p>
    </CardContent>
    <CardFooter className="p-0 pt-3 border-t border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center gap-3">
        <div className={`relative w-10 h-10 rounded-full bg-linear-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-md overflow-hidden ring-2 ring-white dark:ring-slate-900`}>
          <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" sizes="40px" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{testimonial.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
        </div>
      </div>
    </CardFooter>
  </Card>
);

