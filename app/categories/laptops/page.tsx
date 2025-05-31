"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Laptop } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

const laptops = [
  {
    id: 1,
    name: "MacBook Pro 16-inch M3",
    brand: "Apple",
    price: 2499,
    originalPrice: 2799,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 128,
    stock: 15,
    description: "Powerful laptop with M3 chip for professional workflows",
    specs: ["M3 Pro Chip", "16GB RAM", "512GB SSD", "16.2-inch Display"],
    category: "Professional",
  },
  {
    id: 4,
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1799,
    originalPrice: 1999,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 167,
    stock: 12,
    description: "Ultra-lightweight business laptop with premium build",
    specs: ["Intel i7-1365U", "16GB RAM", "512GB SSD", '14" OLED'],
    category: "Business",
  },
  {
    id: 7,
    name: "Surface Laptop Studio",
    brand: "Microsoft",
    price: 1599,
    originalPrice: 1799,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 72,
    stock: 8,
    description: "Versatile laptop with unique hinge design",
    specs: ["Intel i7-11370H", "16GB RAM", "512GB SSD", "14.4-inch Touch"],
    category: "Creative",
  },
  {
    id: 8,
    name: "MacBook Air M3",
    brand: "Apple",
    price: 1299,
    originalPrice: 1499,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 183,
    stock: 20,
    description: "Lightweight and powerful for everyday tasks",
    specs: ["M3 Chip", "8GB RAM", "256GB SSD", "13.6-inch Display"],
    category: "Everyday",
  },
  {
    id: 9,
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    price: 1399,
    originalPrice: 1599,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 95,
    stock: 14,
    description: "Premium ultrabook with stunning display",
    specs: ["Intel i7-1360P", "16GB RAM", "512GB SSD", "13.4-inch OLED"],
    category: "Premium",
  },
  {
    id: 10,
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    price: 1899,
    originalPrice: 2199,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 156,
    stock: 9,
    description: "Gaming laptop with excellent performance",
    specs: ["AMD Ryzen 9", "32GB RAM", "1TB SSD", "RTX 4070"],
    category: "Gaming",
  },
]

export default function LaptopsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<number[]>([])

  const { addItem } = useCart()
  const { toast } = useToast()

  const brands = Array.from(new Set(laptops.map((p) => p.brand)))
  const categories = Array.from(new Set(laptops.map((p) => p.category)))

  const filteredLaptops = laptops.filter((laptop) => {
    const matchesSearch =
      laptop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laptop.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = selectedBrand === "all" || laptop.brand === selectedBrand
    const matchesCategory = selectedCategory === "all" || laptop.category === selectedCategory

    let matchesPrice = true
    if (priceRange === "under-1000") matchesPrice = laptop.price < 1000
    else if (priceRange === "1000-1500") matchesPrice = laptop.price >= 1000 && laptop.price < 1500
    else if (priceRange === "1500-2000") matchesPrice = laptop.price >= 1500 && laptop.price < 2000
    else if (priceRange === "over-2000") matchesPrice = laptop.price >= 2000

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice
  })

  const sortedLaptops = [...filteredLaptops].sort((a, b) => {
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

  const toggleFavorite = (laptopId: number) => {
    setFavorites((prev) => (prev.includes(laptopId) ? prev.filter((id) => id !== laptopId) : [...prev, laptopId]))
  }

  const handleAddToCart = (laptop: (typeof laptops)[0]) => {
    addItem({
      id: laptop.id,
      name: laptop.name,
      price: laptop.price,
      image: laptop.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${laptop.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
              <Laptop className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Premium Laptops</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover our curated collection of high-performance laptops designed for professionals, creatives, and
              everyday users who demand excellence.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">150+</div>
                <div className="text-blue-200">Models Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2 Year</div>
                <div className="text-blue-200">Warranty</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Free</div>
                <div className="text-blue-200">Shipping</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-200">Support</div>
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
            <Input placeholder="Search laptops..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

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
                <SelectItem value="1000-1500">$1,000 - $1,500</SelectItem>
                <SelectItem value="1500-2000">$1,500 - $2,000</SelectItem>
                <SelectItem value="over-2000">Over $2,000</SelectItem>
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
            Showing {sortedLaptops.length} of {laptops.length} laptops
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLaptops.map((laptop) => (
            <Card
              key={laptop.id}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
            >
              <div className="relative">
                <img
                  src={laptop.image || "/placeholder.svg"}
                  alt={laptop.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 text-white">Save ${laptop.originalPrice - laptop.price}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(laptop.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(laptop.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{laptop.brand}</p>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {laptop.name}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {laptop.category}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(laptop.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({laptop.reviews})</span>
                  </div>

                  <p className="text-sm text-gray-600">{laptop.description}</p>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {laptop.specs.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${laptop.price}</span>
                        <span className="text-sm text-gray-500 line-through">${laptop.originalPrice}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">{laptop.stock} in stock</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(laptop)
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

        {sortedLaptops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No laptops found matching your criteria.</p>
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
