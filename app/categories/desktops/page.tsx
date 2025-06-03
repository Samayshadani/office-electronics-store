// app/categories/desktops/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Monitor } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { fetchDesktops, Product } from "@/services/productService"

export default function DesktopsPage() {
  // 1) fetched data + loading/error state
  const [desktops, setDesktops] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 2) UI filtering/sorting state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<string[]>([]) // uniqueKey strings for favorites

  const { addItem } = useCart()
  const { toast } = useToast()

  // 3) फ़ेच करते हैं “desktops” category के products
  useEffect(() => {
    setLoading(true)
    fetchDesktops()
      .then((data) => {
        setDesktops(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching desktops:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // 4) derive brands and sub‐categories (fine‐grained categories within “desktops”)
  const brands = Array.from(
    new Set(desktops.map((p) => p.brand).filter((b): b is string => !!b))
  )
  const categories = Array.from(
    new Set(desktops.map((p) => p.category).filter((c): c is string => !!c))
  )

  // 5) apply filters: search, brand, category, price‐range
  const filteredDesktops = desktops.filter((desktop) => {
    const nameLower = (desktop.name ?? "").toLowerCase()
    const brandLower = (desktop.brand ?? "").toLowerCase()
    const matchesSearch =
      nameLower.includes(searchTerm.toLowerCase()) ||
      brandLower.includes(searchTerm.toLowerCase())
    const matchesBrand =
      selectedBrand === "all" || desktop.brand === selectedBrand
    const matchesCategory =
      selectedCategory === "all" || desktop.category === selectedCategory

    let matchesPrice = true
    if (priceRange === "under-1000") {
      matchesPrice = desktop.price < 1000
    } else if (priceRange === "1000-2000") {
      matchesPrice = desktop.price >= 1000 && desktop.price < 2000
    } else if (priceRange === "2000-3000") {
      matchesPrice = desktop.price >= 2000 && desktop.price < 3000
    } else if (priceRange === "over-3000") {
      matchesPrice = desktop.price >= 3000
    }

    return (
      matchesSearch && matchesBrand && matchesCategory && matchesPrice
    )
  })

  // 6) sorting logic
  const sortedDesktops = [...filteredDesktops].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0)
      case "name":
        return (a.name ?? "").localeCompare(b.name ?? "")
      default:
        return 0
    }
  })

  // 7) toggle favorite by uniqueKey (e.g. `${category}-${name}`)
  const toggleFavorite = (uniqueKey: string) => {
    setFavorites((prev) =>
      prev.includes(uniqueKey)
        ? prev.filter((k) => k !== uniqueKey)
        : [...prev, uniqueKey]
    )
  }

  // 8) add to cart, using numeric index as ID
  const handleAddToCart = (desktop: Product, idx: number) => {
    addItem({
      id: idx, // numeric ID
      name: desktop.name!,
      price: desktop.price,
      image: desktop.imageUrl || "/placeholder.svg",
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${desktop.name} has been added to your cart.`,
    })
  }

  // 9) loading / error views
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading desktops…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    )
  }

  // 10) Main JSX
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
            {/* Search */}
            <Input
              placeholder="Search desktops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Brand */}
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

            {/* Sub‐Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range */}
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

            {/* Sort By */}
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

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedDesktops.length} of {desktops.length} desktops
          </p>
        </div>

        {/* Grid of Desktops */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDesktops.map((desktop, idx) => {
            const uniqueKey = `${desktop.category}-${desktop.name}`

            return (
              <Card
                key={idx}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
              >
                <div className="relative">
                  <img
                    src={desktop.imageUrl || "/placeholder.svg"}
                    alt={desktop.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {desktop.originalPrice && desktop.originalPrice > desktop.price && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white">
                        Save ${desktop.originalPrice - desktop.price}
                      </Badge>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(uniqueKey)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(uniqueKey)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>

                <CardContent className="p-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{desktop.brand}</p>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {desktop.name}
                    </h3>
                    {desktop.category && (
                      <Badge variant="outline" className="mt-1">
                        {desktop.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(desktop.rating ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({desktop.reviews ?? 0})</span>
                  </div>

                  {desktop.description && (
                    <p className="text-sm text-gray-600">{desktop.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {desktop.specs?.slice(0, 2).map((spec, sidx) => (
                      <span key={sidx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${desktop.price}
                        </span>
                        {desktop.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${desktop.originalPrice}
                          </span>
                        )}
                      </div>
                      {desktop.stock !== undefined && (
                        <p className="text-xs text-green-600 font-medium">
                          {desktop.stock} in stock
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(desktop, idx)
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            )
          })}
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