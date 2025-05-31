"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight, Star, Zap } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "MacBook Pro M3",
    subtitle: "Unleash Your Creative Power",
    description:
      "Experience unprecedented performance with the new M3 chip. Perfect for professionals who demand excellence.",
    price: "$2,499",
    originalPrice: "$2,799",
    image: "/placeholder.svg?height=600&width=800",
    background: "from-slate-900 via-purple-900 to-slate-900",
    badge: "New Arrival",
    features: ["M3 Pro Chip", "18-core GPU", "22hr Battery"],
    link: "/product/1",
  },
  {
    id: 2,
    title: "Gaming Desktop Pro",
    subtitle: "Ultimate Gaming Experience",
    description: "Dominate every game with RTX 4080, Intel i9 processor, and lightning-fast SSD storage.",
    price: "$3,299",
    originalPrice: "$3,799",
    image: "/placeholder.svg?height=600&width=800",
    background: "from-red-900 via-orange-900 to-yellow-900",
    badge: "Best Seller",
    features: ["RTX 4080", "Intel i9-13900K", "32GB DDR5"],
    link: "/categories/desktops",
  },
  {
    id: 3,
    title: "Workspace Essentials",
    subtitle: "Complete Your Setup",
    description: "Premium accessories designed to enhance your productivity and comfort throughout the day.",
    price: "From $99",
    originalPrice: "",
    image: "/placeholder.svg?height=600&width=800",
    background: "from-emerald-900 via-teal-900 to-cyan-900",
    badge: "Bundle Deal",
    features: ["Wireless Charging", "Ergonomic Design", "Premium Materials"],
    link: "/categories/accessories",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section
      className="relative h-[80vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.background}`}>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="container mx-auto px-4 h-full relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
              {/* Content */}
              <div className="text-white space-y-8 lg:pr-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    <span className="text-sm font-medium">{slide.badge}</span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">{slide.title}</h1>

                  <h2 className="text-2xl lg:text-3xl font-light text-white/90">{slide.subtitle}</h2>

                  <p className="text-lg text-white/80 leading-relaxed max-w-lg">{slide.description}</p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-3">
                  {slide.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                      <Zap className="h-4 w-4 mr-2 text-orange-400" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold">{slide.price}</span>
                  {slide.originalPrice && (
                    <span className="text-xl text-white/60 line-through">{slide.originalPrice}</span>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={slide.link}>
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="relative lg:block hidden">
                <div className="relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent rounded-2xl transform -rotate-6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
