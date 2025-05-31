"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

// Mock related products - in a real app would be fetched from an API
const mockProducts = [
  {
    id: 2,
    name: "Dell XPS 15 Laptop",
    brand: "Dell",
    price: 1899,
    originalPrice: 2099,
    category: "laptops",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 94,
  },
  {
    id: 4,
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1799,
    originalPrice: 1999,
    category: "laptops",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 167,
  },
  {
    id: 7,
    name: "Surface Laptop Studio",
    brand: "Microsoft",
    price: 1599,
    originalPrice: 1799,
    category: "laptops",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 72,
  },
  {
    id: 8,
    name: "MacBook Air M3",
    brand: "Apple",
    price: 1299,
    originalPrice: 1499,
    category: "laptops",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 183,
  },
]

interface RelatedProductsProps {
  category: string
  currentProductId: number
}

export function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [favorites, setFavorites] = useState<number[]>([])
  const { addItem } = useCart()
  const { toast } = useToast()

  // Filter products by category and exclude current product
  const relatedProducts = mockProducts.filter(
    (product) => product.category === category && product.id !== currentProductId,
  )

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Related Products</h2>
        <Button variant="outline">View All</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
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
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
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
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
              <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center space-x-2 my-2">
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

              <div className="flex items-center justify-between mt-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
