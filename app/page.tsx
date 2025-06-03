// "use client"
import { HeroSlider } from "@/components/hero-slider"
import { CategoryShowcase } from "@/components/category-showcase"
import { FeaturedProducts } from "@/components/featured-products"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { OffersSection } from "@/components/offers-section"
import { NewsletterSection } from "@/components/newsletter-section"
// import { useEffect } from "react"

export default function HomePage() {
  // useEffect(() => {
  //   const info = async () => {
  //     try {
  //       const response = await fetch("https://rentalforbikes-default-rtdb.asia-southeast1.firebasedatabase.app/tabs.json")
  //       if (!response.ok) {
  //         if (response.status === 404) {
  //           console.log("error")
  //         } else {
  //           console.log("error")
  //         }
  //         return
  //       }

  //       const data = response.json()
  //       console.log(data);
  //     } catch (err) {
  //       console.error("Error fetching product:", err)
  //     }
  //   }
  //   info();
  // },[])
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
