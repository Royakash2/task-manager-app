"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { testimonials } from "./testimonials.data";
import { TestimonialCard } from "./TestimonialCard";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/navigation";

export const Testimonials = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-24 md:py-32 bg-background overflow-hidden relative">
      <div className="px-4 md:px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:-mb-12">
        <SectionHeader
          badge="Testimonials"
          title="Trusted by dev teams big & small"
          description="See what eng leaders are saying about VelloX"
        />
        
        <div className="flex items-center gap-3 md:pb-32">
          <Button variant="outline" size="icon" className="swiper-prev-btn rounded-full border-foreground/30 hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="swiper-next-btn rounded-full border-foreground/30 hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 mt-8">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          loop={true}
          navigation={{
            prevEl: '.swiper-prev-btn',
            nextEl: '.swiper-next-btn',
          }}
          className="w-full overflow-visible!"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} className="flex" style={{ height: "auto" }}>
              <TestimonialCard testimonial={t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
