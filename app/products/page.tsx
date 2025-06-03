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
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Heart, ShoppingCart, Filter, Grid, List } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { fetchAllProducts } from "@/services/productService"

// 1) Interfaces

// RawProductGroups = “category” → either an array of objects, or (for cabinets) an object whose values are objects.
type RawProductGroups = Record<string, Array<Record<string, any>> | Record<string, any>>

interface Product {
  category: string
  name: string
  price: number

  // Optional fields (only exist in some categories)
  imageUrl?: string
  brand?: string
  originalPrice?: number
  rating?: number
  reviews?: number
  stock?: number
  description?: string
  features?: string[]
  // …and any other fields present in your JSON
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<number[]>([])

  const { addItem } = useCart()
  const { toast } = useToast()

  // 2) Fetch & flatten
  useEffect(() => {
    setLoading(true)
    fetchAllProducts()
      .then((products) => {
        setAllProducts(products)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])
  

  // 3) Derive brand & category lists
  const brands = Array.from(
    new Set(
      allProducts
        .map((p) => p.brand)
        .filter((b): b is string => typeof b === "string" && b.length > 0)
    )
  )
  const categories = Array.from(new Set(allProducts.map((p) => p.category)))

  // 4) Filtering logic
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      (product.name ?? ""
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())) ||
      (product.brand ?? "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory

    const matchesBrand =
      selectedBrands.length === 0 ||
      (product.brand && selectedBrands.includes(product.brand))

    let matchesPrice = true
    if (priceRange === "under-500") {
      matchesPrice = product.price < 500
    } else if (priceRange === "500-1000") {
      matchesPrice = product.price >= 500 && product.price < 1000
    } else if (priceRange === "1000-2000") {
      matchesPrice = product.price >= 1000 && product.price < 2000
    } else if (priceRange === "over-2000") {
      matchesPrice = product.price >= 2000
    }

    return (
      matchesSearch && matchesCategory && matchesBrand && matchesPrice
    )
  })

  // 5) Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  // 6) Favorite toggle
  const toggleFavorite = (productIndex: number) => {
    setFavorites((prev) =>
      prev.includes(productIndex)
        ? prev.filter((id) => id !== productIndex)
        : [...prev, productIndex]
    )
  }

  // 7) Add to cart
  const handleAddToCart = (product: Product, index: number) => {
    addItem({
      id: index,
      name: product.name,
      price: product.price,
      image: product.imageUrl || "/placeholder.svg",
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // 8) Loading & error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading products…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-medium">
          Failed to load products: {error}
        </p>
      </div>
    )
  }

  // 9) Render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover our complete range of electronics
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Search
                  </label>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brands
                  </label>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => {
                            setSelectedBrands((prev) =>
                              prev.includes(brand)
                                ? prev.filter((b) => b !== brand)
                                : [...prev, brand]
                            )
                          }}
                        />
                        <label htmlFor={brand} className="text-sm">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <Select
                    value={priceRange}
                    onValueChange={setPriceRange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-500">Under ₹500</SelectItem>
                      <SelectItem value="500-1000">₹500 – ₹1,000</SelectItem>
                      <SelectItem value="1000-2000">₹1,000 – ₹2,000</SelectItem>
                      <SelectItem value="over-2000">Over ₹2,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <p className="text-gray-600">
                Showing {sortedProducts.length} of {allProducts.length} products
              </p>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
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
                    <SelectItem value="name">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products List / Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {sortedProducts.map((product, idx) => (
                <Card
                  key={idx}
                  className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : ""
                    }`}
                  >
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    />
                    <div className="absolute top-3 left-3">
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <Badge className="bg-red-500 text-white">
                            Save ₹
                            {product.originalPrice - product.price}
                          </Badge>
                        )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(idx)
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(idx)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>

                  <CardContent
                    className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {product.brand || product.category}
                        </p>
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      {product.rating !== undefined &&
                        product.reviews !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating!)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({product.reviews})
                            </span>
                          </div>
                        )}

                      {product.description && (
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                      )}

                      <div
                        className={`${
                          viewMode === "list"
                            ? "flex items-center justify-between"
                            : "space-y-3"
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.stock !== undefined && (
                            <p className="text-xs text-green-600 font-medium">
                              {product.stock} in stock
                            </p>
                          )}
                        </div>
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product, idx)
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedBrands([])
                    setPriceRange("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
