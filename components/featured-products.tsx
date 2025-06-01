"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Link } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
const featuredProducts = [
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
]

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([])
  const { addItem } = useCart()
  const { toast } = useToast()

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
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
    const router = useRouter();

  const handleClick = () => {
    router.push('/products');
  };


  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium electronics with exclusive deals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white"
            >
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
                    toggleFavorite(product.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(product)
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
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

                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">{product.stock} in stock</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
            <Button onClick={handleClick} size="lg" variant="outline" className="px-8">
              View All Products
            </Button>
        </div>
      </div>
    </section>
  )
}
