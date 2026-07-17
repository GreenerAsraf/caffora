import { HeroSection } from "@/components/sections/hero-section"
import { StatsBar } from "@/components/sections/stats-bar"
import { CategoriesSection } from "@/components/sections/categories-section"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { OffersSection } from "@/components/sections/offers-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { BlogPreviewSection } from "@/components/sections/blog-preview-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <FeaturedProducts />
      <OffersSection />
      <FeaturesSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <NewsletterSection />
    </div>
  )
}
