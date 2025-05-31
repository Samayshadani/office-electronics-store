"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, SearchIcon } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Mock product data - in a real app this would come from an API
const allProducts = [
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
    category: "laptops",
  },
  {
    id: 2,
    name: "Dell XPS Desktop",
    brand: "Dell",
    price: 1899,
    originalPrice: 2199,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 89,
    stock: 8,
    description: "High-performance desktop for demanding applications",
    specs: ["Intel i7-13700", "32GB RAM", "1TB SSD", "RTX 4070"],
    category: "desktops",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 399,
    originalPrice: 449,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 256,
    stock: 25,
    description: "Premium noise-canceling wireless headphones",
    specs: ["30hr Battery", "Noise Canceling", "Quick Charge", "Multipoint"],
    category: "accessories",
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
    category: "laptops",
  },
  {
    id: 5,
    name: "HP EliteDesk 800",
    brand: "HP",
    price: 1299,
    originalPrice: 1499,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 94,
    stock: 18,
    description: "Compact business desktop with reliable performance",
    specs: ["Intel i5-13500", "16GB RAM", "512GB SSD", "Windows 11 Pro"],
    category: "desktops",
  },
  {
    id: 6,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    price: 99,
    originalPrice: 119,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 342,
    stock: 45,
    description: "Advanced wireless mouse for productivity",
    specs: ["8K DPI", "70-day Battery", "USB-C", "Multi-device"],
    category: "accessories",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchTerm, setSearchTerm] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  const { addItem } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  // Update search term when URL query changes
  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const brands = Array.from(new Set(allProducts.map((p) => p.brand)))
  const categories = Array.from(new Set(allProducts.map((p) => p.category)))

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand

    let matchesPrice = true
    if (priceRange === "under-500") matchesPrice = product.price < 500
    else if (priceRange === "500-1000") matchesPrice = product.price >= 500 && product.price < 1000
    else if (priceRange === "1000-2000") matchesPrice = product.price >= 1000 && product.price < 2000
    else if (priceRange === "over-2000") matchesPrice = product.price >= 2000

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
        // For relevance, prioritize exact matches in name
        const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
        const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
        return bNameMatch - aNameMatch
    }
  })

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = (product: any) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {sortedProducts.length} results for "{searchTerm}"
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
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Refine your search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue />
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
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-500">Under $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                      <SelectItem value="over-2000">Over $2,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedBrand("all")
                    setPriceRange("all")
                    setSortBy("relevance")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 text-white">Save ${product.originalPrice - product.price}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleAddToWishlist(product)
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                          />
                        </Button>
                      </div>
                    </Link>

                    <CardContent className="p-6">
                      <Link href={`/product/${product.id}`}>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {product.name}
                            </h3>
                            <Badge variant="outline" className="mt-1">
                              {product.category}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.reviews})</span>
                          </div>

                          <p className="text-sm text-gray-600">{product.description}</p>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                              </div>
                              <p className="text-xs text-green-600 font-medium">{product.stock} in stock</p>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <Button
                        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "{searchTerm}". Try adjusting your search or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedBrand("all")
                    setPriceRange("all")
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
