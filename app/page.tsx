
import { Hero } from "@/components/landing/hero-section/Hero";
import { Features } from "@/components/landing/Features";
import { ProductShowcase } from "@/components/landing/product-showcase/Product-showcase";
import { Testimonials } from "@/components/landing/testimonials/Testimonials";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { Cta } from "@/components/landing/cta-section/Cta";
import { Footer } from "@/components/landing/footer/Footer";
import { Navbar } from "@/components/landing/navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <ProductShowcase />
        <Testimonials />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
