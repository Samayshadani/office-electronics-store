import { HeroSlider } from "@/components/hero-slider"
import { CategoryShowcase } from "@/components/category-showcase"
import { FeaturedProducts } from "@/components/featured-products"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { OffersSection } from "@/components/offers-section"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <StatsSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <TestimonialsSection />
      <OffersSection />
      <NewsletterSection />
    </div>
  )
}
