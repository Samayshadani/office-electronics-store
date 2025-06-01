"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Headphones } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

const accessories = [
  {
    id: 3,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 399,
    originalPrice: 449,
    image: "/headphone.jpg?height=300&width=300",
    rating: 4.8,
    reviews: 256,
    stock: 25,
    description: "Premium noise-canceling wireless headphones",
    specs: ["30hr Battery", "Noise Canceling", "Quick Charge", "Multipoint"],
    category: "Audio",
  },
  {
    id: 6,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    price: 99,
    originalPrice: 119,
    image: "/MXmaster.jpg?height=300&width=300",
    rating: 4.7,
    reviews: 342,
    stock: 45,
    description: "Advanced wireless mouse for productivity",
    specs: ["8K DPI", "70-day Battery", "USB-C", "Multi-device"],
    category: "Input Devices",
  },
  {
    id: 15,
    name: "Dell UltraSharp 27 4K",
    brand: "Dell",
    price: 599,
    originalPrice: 699,
    image: "/dell.jpg?height=300&width=300",
    rating: 4.6,
    reviews: 189,
    stock: 18,
    description: "Professional 4K monitor with accurate colors",
    specs: ["27-inch 4K", "IPS Panel", "USB-C Hub", "Height Adjustable"],
    category: "Monitors",
  },
  {
    id: 16,
    name: "Keychron K8 Wireless",
    brand: "Keychron",
    price: 89,
    originalPrice: 109,
    image: "/keyboard.jpg?height=300&width=300",
    rating: 4.5,
    reviews: 278,
    stock: 32,
    description: "Mechanical keyboard with hot-swappable switches",
    specs: ["Mechanical", "Wireless", "Hot-swap", "RGB Backlight"],
    category: "Input Devices",
  },
  {
    id: 17,
    name: "Anker PowerConf C300",
    brand: "Anker",
    price: 129,
    originalPrice: 159,
    image: "/MXmaster.jpg?height=300&width=300",
    rating: 4.4,
    reviews: 156,
    stock: 28,
    description: "AI-powered webcam for video conferencing",
    specs: ["1080p 60fps", "AI Auto-framing", "Noise Reduction", "Privacy Shutter"],
    category: "Video",
  },
  {
    id: 18,
    name: "CalDigit TS4 Thunderbolt 4",
    brand: "CalDigit",
    price: 379,
    originalPrice: 429,
    image: "/headphone.jpg?height=300&width=300",
    rating: 4.7,
    reviews: 94,
    stock: 15,
    description: "Ultimate Thunderbolt 4 docking station",
    specs: ["18 Ports", "98W Charging", "8K Display", "Thunderbolt 4"],
    category: "Docking Stations",
  },
  {
    id: 19,
    name: "Herman Miller Sayl Chair",
    brand: "Herman Miller",
    price: 295,
    originalPrice: 345,
    image: "/dell.jpg?height=300&width=300",
    rating: 4.3,
    reviews: 67,
    stock: 12,
    description: "Ergonomic office chair with suspension back",
    specs: ["Ergonomic", "Suspension Back", "Adjustable Arms", "12-year Warranty"],
    category: "Furniture",
  },
  {
    id: 20,
    name: "Elgato Stream Deck MK.2",
    brand: "Elgato",
    price: 149,
    originalPrice: 179,
    image: "/keyboard.jpg?height=300&width=300",
    rating: 4.8,
    reviews: 203,
    stock: 22,
    description: "Customizable control deck for content creators",
    specs: ["15 LCD Keys", "Customizable", "Plugin Support", "USB-C"],
    category: "Content Creation",
  },
]

export default function AccessoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<number[]>([])

  const { addItem } = useCart()
  const { toast } = useToast()

  const brands = Array.from(new Set(accessories.map((p) => p.brand)))
  const categories = Array.from(new Set(accessories.map((p) => p.category)))

  const filteredAccessories = accessories.filter((accessory) => {
    const matchesSearch =
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = selectedBrand === "all" || accessory.brand === selectedBrand
    const matchesCategory = selectedCategory === "all" || accessory.category === selectedCategory

    let matchesPrice = true
    if (priceRange === "under-100") matchesPrice = accessory.price < 100
    else if (priceRange === "100-200") matchesPrice = accessory.price >= 100 && accessory.price < 200
    else if (priceRange === "200-400") matchesPrice = accessory.price >= 200 && accessory.price < 400
    else if (priceRange === "over-400") matchesPrice = accessory.price >= 400

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice
  })

  const sortedAccessories = [...filteredAccessories].sort((a, b) => {
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

  const toggleFavorite = (accessoryId: number) => {
    setFavorites((prev) =>
      prev.includes(accessoryId) ? prev.filter((id) => id !== accessoryId) : [...prev, accessoryId],
    )
  }

  const handleAddToCart = (accessory: (typeof accessories)[0]) => {
    addItem({
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      image: accessory.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${accessory.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
              <Headphones className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Premium Accessories</h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Complete your workspace with our carefully curated selection of premium accessories designed to enhance
              your productivity and comfort.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">200+</div>
                <div className="text-purple-200">Accessories</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Top</div>
                <div className="text-purple-200">Brands</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Fast</div>
                <div className="text-purple-200">Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Expert</div>
                <div className="text-purple-200">Support</div>
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
              placeholder="Search accessories..."
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
                <SelectItem value="under-100">Under $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200-400">$200 - $400</SelectItem>
                <SelectItem value="over-400">Over $400</SelectItem>
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
            Showing {sortedAccessories.length} of {accessories.length} accessories
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedAccessories.map((accessory) => (
            <Card
              key={accessory.id}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
            >
              <div className="relative">
                <img
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 text-white">Save ${accessory.originalPrice - accessory.price}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(accessory.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(accessory.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{accessory.brand}</p>
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {accessory.name}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {accessory.category}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(accessory.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({accessory.reviews})</span>
                  </div>

                  <p className="text-sm text-gray-600">{accessory.description}</p>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {accessory.specs.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${accessory.price}</span>
                        <span className="text-sm text-gray-500 line-through">${accessory.originalPrice}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">{accessory.stock} in stock</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(accessory)
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

        {sortedAccessories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No accessories found matching your criteria.</p>
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
