"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Heart, ShoppingCart, Filter, Grid, List } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

const products = [
  {
    id: 1,
    name: "MacBook Pro 16-inch M3",
    brand: "Apple",
    price: 2499,
    originalPrice: 2799,
    category: "laptops",
    image: "/Macbook.jpg?height=300&width=300",
    rating: 4.9,
    reviews: 128,
    stock: 15,
    description: "Powerful laptop with M3 chip for professional workflows",
    features: ["M3 Pro Chip", "16GB RAM", "512GB SSD", "Liquid Retina Display"],
  },
  {
    id: 2,
    name: "Dell XPS Desktop",
    brand: "Dell",
    price: 1899,
    originalPrice: 2199,
    category: "desktops",
    image: "/desktop.jpg?height=300&width=300",
    rating: 4.7,
    reviews: 89,
    stock: 8,
    description: "High-performance desktop for demanding applications",
    features: ["Intel i7-13700", "32GB RAM", "1TB SSD", "RTX 4070"],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 399,
    originalPrice: 449,
    category: "accessories",
    image: "/headphone.jpg?height=300&width=300",
    rating: 4.8,
    reviews: 256,
    stock: 25,
    description: "Premium noise-canceling wireless headphones",
    features: ["30hr Battery", "Noise Canceling", "Quick Charge", "Multipoint"],
  },
  {
    id: 4,
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1799,
    originalPrice: 1999,
    category: "laptops",
    image: "/product.jpg?height=300&width=300",
    rating: 4.6,
    reviews: 167,
    stock: 12,
    description: "Ultra-lightweight business laptop with premium build",
    features: ["Intel i7-1365U", "16GB RAM", "512GB SSD", '14" OLED'],
  },
  {
    id: 5,
    name: "HP EliteDesk 800",
    brand: "HP",
    price: 1299,
    originalPrice: 1499,
    category: "desktops",
    image: "/eliteDesk.jpg?height=300&width=300",
    rating: 4.5,
    reviews: 94,
    stock: 18,
    description: "Compact business desktop with reliable performance",
    features: ["Intel i5-13500", "16GB RAM", "512GB SSD", "Windows 11 Pro"],
  },
  {
    id: 6,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    price: 99,
    originalPrice: 119,
    category: "accessories",
    image: "/MXmaster.jpg?height=300&width=300",
    rating: 4.7,
    reviews: 342,
    stock: 45,
    description: "Advanced wireless mouse for productivity",
    features: ["8K DPI", "70-day Battery", "USB-C", "Multi-device"],
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<number[]>([])

  const { addItem } = useCart()
  const { toast } = useToast()

  const brands = Array.from(new Set(products.map((p) => p.brand)))
  const categories = Array.from(new Set(products.map((p) => p.category)))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)

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
        return 0
    }
  })

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
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

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }
    const router = useRouter();

  const handleClick = () => {
    router.push('/product/id');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Discover our complete range of office electronics</p>
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
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                  <label className="block text-sm font-medium mb-2">Brands</label>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
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
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <p className="text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
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

            {/* Products */}
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white ${viewMode === "list" ? "flex" : ""}`}
                >
                  <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}
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
                        toggleFavorite(product.id)
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                      />
                    </Button>
                  </div>
                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                        <h3 onClick={handleClick} className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
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

                      <div className={`${viewMode === "list" ? "flex items-center justify-between" : "space-y-3"}`}>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                          </div>
                          <p className="text-xs text-green-600 font-medium">{product.stock} in stock</p>
                        </div>
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
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
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
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
