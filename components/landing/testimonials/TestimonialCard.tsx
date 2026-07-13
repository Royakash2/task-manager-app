import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Testimonial } from "./testimonials.data";

export const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="w-full h-full flex flex-col justify-between border-foreground/30 bg-muted/50 rounded p-6 sm:p-8 group transition-colors shadow-none">
      <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      
      <div className="flex justify-between items-end mt-8">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
            <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" sizes="40px" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm tracking-tight">{testimonial.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{testimonial.role}</span>
          </div>
        </div>
        
        {testimonial.company && (
          <div className="hidden sm:block text-muted-foreground/60 font-sans font-semibold text-xs tracking-wider uppercase">
            {testimonial.company}
          </div>
        )}
      </div>
    </Card>
  );
};
