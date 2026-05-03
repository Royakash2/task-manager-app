
import { Hero } from "@/components/hero-section/Hero";
import { Features } from "@/components/Features";
import { ProductShowcase } from "@/components/product-showcase/Product-showcase";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { Pricing } from "@/components/pricing/Pricing";
import { Cta } from "@/components/cta-section/Cta";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";

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
