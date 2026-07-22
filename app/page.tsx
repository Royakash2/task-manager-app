
import { Hero } from "@/components/landing/hero-section/Hero";
import { Features } from "@/components/landing/Features";
import { ProductShowcase } from "@/components/landing/product-showcase/Product-showcase";
import { Testimonials } from "@/components/landing/testimonials/Testimonials";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { Faq } from "@/components/landing/faq/Faq";
import { Cta } from "@/components/landing/cta-section/Cta";
import { Footer } from "@/components/landing/footer/Footer";
import { Navbar } from "@/components/landing/navbar/Navbar";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "velloX",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "description": "Experience a new atmosphere of productivity. VelloX is a premium task management platform designed to bring clarity and speed to your workflow.",
    "url": "https://getvellox.vercel.app",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <ProductShowcase />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
