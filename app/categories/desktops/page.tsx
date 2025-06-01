"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Monitor } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

const desktops = [
  {
    id: 2,
    name: "Dell XPS Desktop",
    brand: "Dell",
    price: 1899,
    originalPrice: 2199,
    image: "/desktop.jpg?height=300&width=300",
    rating: 4.7,
    reviews: 89,
    stock: 8,
    description: "High-performance desktop for demanding applications",
    specs: ["Intel i7-13700", "32GB RAM", "1TB SSD", "RTX 4070"],
    category: "Gaming",
  },
  {
    id: 5,
    name: "HP EliteDesk 800",
    brand: "HP",
    price: 1299,
    originalPrice: 1499,
    image: "/eliteDesk.jpg?height=300&width=300",
    rating: 4.5,
    reviews: 94,
    stock: 18,
    description: "Compact business desktop with reliable performance",
    specs: ["Intel i5-13500", "16GB RAM", "512GB SSD", "Windows 11 Pro"],
    category: "Business",
  },
  {
    id: 11,
    name: "iMac 24-inch M3",
    brand: "Apple",
    price: 1699,
    originalPrice: 1899,
    image: "/Imac.jpg?height=300&width=300",
    rating: 4.8,
    reviews: 156,
    stock: 12,
    description: "All-in-one desktop with stunning display",
    specs: ["M3 Chip", "16GB RAM", "512GB SSD", "24-inch 4.5K Display"],
    category: "All-in-One",
  },
  {
    id: 12,
    name: "ASUS ROG Strix GT35",
    brand: "ASUS",
    price: 2499,
    originalPrice: 2799,
    image: "/Asus-desktop.jpg?height=300&width=300",
    rating: 4.6,
    reviews: 78,
    stock: 6,
    description: "Ultimate gaming desktop with RGB lighting",
    specs: ["Intel i9-13900K", "32GB DDR5", "2TB SSD", "RTX 4080"],
    category: "Gaming",
  },
  {
    id: 13,
    name: "Lenovo ThinkCentre M90q",
    brand: "Lenovo",
    price: 899,
    originalPrice: 1099,
    image: "/eliteDesk.jpg?height=300&width=300",
    rating: 4.4,
    reviews: 112,
    stock: 25,
    description: "Tiny desktop with big performance",
    specs: ["Intel i5-13500T", "16GB RAM", "512GB SSD", "Ultra Compact"],
    category: "Mini PC",
  },
  {
    id: 14,
    name: "Custom Workstation Pro",
    brand: "Custom Build",
    price: 3299,
    originalPrice: 3699,
    image: "/desktop.jpg?height=300&width=300",
    rating: 4.9,
    reviews: 45,
    stock: 4,
    description: "Professional workstation for content creation",
    specs: ["Intel Xeon W", "64GB ECC RAM", "4TB NVMe", "RTX A4000"],
    category: "Workstation",
  },
]

export default function DesktopsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<number[]>([])

  const { addItem } = useCart()
  const { toast } = useToast()

  const brands = Array.from(new Set(desktops.map((p) => p.brand)))
  const categories = Array.from(new Set(desktops.map((p) => p.category)))

  const filteredDesktops = desktops.filter((desktop) => {
    const matchesSearch =
      desktop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desktop.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = selectedBrand === "all" || desktop.brand === selectedBrand
    const matchesCategory = selectedCategory === "all" || desktop.category === selectedCategory

    let matchesPrice = true
    if (priceRange === "under-1000") matchesPrice = desktop.price < 1000
    else if (priceRange === "1000-2000") matchesPrice = desktop.price >= 1000 && desktop.price < 2000
    else if (priceRange === "2000-3000") matchesPrice = desktop.price >= 2000 && desktop.price < 3000
    else if (priceRange === "over-3000") matchesPrice = desktop.price >= 3000

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice
  })

  const sortedDesktops = [...filteredDesktops].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const toggleFavorite = (desktopId: number) => {
    setFavorites((prev) => (prev.includes(desktopId) ? prev.filter((id) => id !== desktopId) : [...prev, desktopId]))
  }

  const handleAddToCart = (desktop: (typeof desktops)[0]) => {
    addItem({
      id: desktop.id,
      name: desktop.name,
      price: desktop.price,
      image: desktop.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${desktop.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
              <Monitor className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Powerful Desktops</h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              From gaming rigs to professional workstations, find the perfect desktop computer to power your
              productivity and creativity.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">80+</div>
                <div className="text-green-200">Desktop Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold">3 Year</div>
                <div className="text-green-200">Extended Warranty</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Custom</div>
                <div className="text-green-200">Configurations</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Expert</div>
                <div className="text-green-200">Setup Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="h-5 w-5" />
            <h2 className="font-bold text-lg">Filters</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <Input
              placeholder="Search desktops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                <SelectItem value="over-3000">Over $3,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedDesktops.length} of {desktops.length} desktops
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDesktops.map((desktop) => (
            <Card
              key={desktop.id}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
            >
              <div className="relative">
                <img
                  src={desktop.image || "/placeholder.svg"}
                  alt={desktop.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 text-white">Save ${desktop.originalPrice - desktop.price}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(desktop.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(desktop.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{desktop.brand}</p>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {desktop.name}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {desktop.category}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(desktop.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({desktop.reviews})</span>
                  </div>

                  <p className="text-sm text-gray-600">{desktop.description}</p>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {desktop.specs.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${desktop.price}</span>
                        <span className="text-sm text-gray-500 line-through">${desktop.originalPrice}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">{desktop.stock} in stock</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(desktop)
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedDesktops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No desktops found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedBrand("all")
                setSelectedCategory("all")
                setPriceRange("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
