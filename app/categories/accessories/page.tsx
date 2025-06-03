// app/categories/accessories/page.tsx
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
import { Star, Heart, ShoppingCart, Filter, Headphones } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { fetchAccessories, Product } from "@/services/productService"

export default function AccessoriesPage() {
  // 1) fetched accessories + loading/error state
  const [accessories, setAccessories] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 2) UI filtering/sorting state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<string[]>([]) // uniqueKey strings

  const { addItem } = useCart()
  const { toast } = useToast()

  // 3) फ़ेच करते हैं उन प्रोडक्ट्स को जो accessories हों (laptops/desktops नहीं)
  useEffect(() => {
    setLoading(true)
    fetchAccessories()
      .then((data) => {
        setAccessories(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching accessories:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // 4) derive unique brands और sub-categories
  const brands = Array.from(
    new Set(accessories.map((p) => p.brand).filter((b): b is string => !!b))
  )
  const categories = Array.from(
    new Set(accessories.map((p) => p.category).filter((c): c is string => !!c))
  )

  // 5) apply filters: search, brand, category, price
  const filteredAccessories = accessories.filter((accessory) => {
    const nameLower = (accessory.name ?? "").toLowerCase()
    const brandLower = (accessory.brand ?? "").toLowerCase()
    const matchesSearch =
      nameLower.includes(searchTerm.toLowerCase()) ||
      brandLower.includes(searchTerm.toLowerCase())
    const matchesBrand =
      selectedBrand === "all" || accessory.brand === selectedBrand
    const matchesCategory =
      selectedCategory === "all" || accessory.category === selectedCategory

    let matchesPrice = true
    if (priceRange === "under-100") {
      matchesPrice = accessory.price < 100
    } else if (priceRange === "100-200") {
      matchesPrice = accessory.price >= 100 && accessory.price < 200
    } else if (priceRange === "200-400") {
      matchesPrice = accessory.price >= 200 && accessory.price < 400
    } else if (priceRange === "over-400") {
      matchesPrice = accessory.price >= 400
    }

    return (
      matchesSearch &&
      matchesBrand &&
      matchesCategory &&
      matchesPrice
    )
  })

  // 6) sorting logic
  const sortedAccessories = [...filteredAccessories].sort((a, b) => {
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

  // 8) add to cart with numeric index as ID
  const handleAddToCart = (accessory: Product, idx: number) => {
    addItem({
      id: idx, // numeric ID
      name: accessory.name!,
      price: accessory.price,
      image: accessory.imageUrl || "/placeholder.svg",
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${accessory.name} has been added to your cart.`,
    })
  }

  // 9) loading / error views
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading accessories…</p>
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
      <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
              <Headphones className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Premium Accessories
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Complete your workspace with our curated selection of accessories designed
              to enhance productivity and comfort.
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
            {/* Search */}
            <Input
              placeholder="Search accessories..."
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

            {/* Sub-Category */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
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
                <SelectItem value="under-100">Under $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="200-400">$200 - $400</SelectItem>
                <SelectItem value="over-400">Over $400</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedAccessories.length} of {accessories.length} accessories
          </p>
        </div>

        {/* Grid of Accessories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedAccessories.map((accessory, idx) => {
            const uniqueKey = `${accessory.category}-${accessory.name}`

            return (
              <Card
                key={idx}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
              >
                <div className="relative">
                  <img
                    src={accessory.imageUrl || "/placeholder.svg"}
                    alt={accessory.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {accessory.originalPrice &&
                    accessory.originalPrice > accessory.price && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white">
                          Save ${accessory.originalPrice - accessory.price}
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
                    <p className="text-sm text-gray-500 font-medium">
                      {accessory.brand}
                    </p>
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
                          className={`h-4 w-4 ${
                            i < Math.floor(accessory.rating ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({accessory.reviews ?? 0})
                    </span>
                  </div>

                  {accessory.description && (
                    <p className="text-sm text-gray-600">
                      {accessory.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {accessory.specs?.slice(0, 2).map((spec, sidx) => (
                      <span
                        key={sidx}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${accessory.price}
                        </span>
                        {accessory.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${accessory.originalPrice}
                          </span>
                        )}
                      </div>
                      {accessory.stock !== undefined && (
                        <p className="text-xs text-green-600 font-medium">
                          {accessory.stock} in stock
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(accessory, idx)
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

        {sortedAccessories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No accessories found matching your criteria.
            </p>
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