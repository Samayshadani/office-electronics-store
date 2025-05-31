"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { RelatedProducts } from "@/components/related-products"
import { CustomerReviews } from "@/components/customer-reviews"

// Mock product data - in real app this would come from API
const product = {
  id: 1,
  name: "MacBook Pro 16-inch M3",
  brand: "Apple",
  price: 2499,
  originalPrice: 2799,
  category: "laptops",
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ],
  colorOptions: [
    { name: "Space Gray", code: "#343434", images: ["/placeholder.svg?height=500&width=500"] },
    { name: "Silver", code: "#E3E3E3", images: ["/placeholder.svg?height=500&width=500"] },
  ],
  rating: 4.9,
  reviews: 128,
  stock: 15,
  description:
    "The MacBook Pro 16-inch with M3 chip delivers exceptional performance for professional workflows. Featuring a stunning Liquid Retina XDR display, advanced camera and audio, and all-day battery life.",
  features: [
    "Apple M3 Pro chip with 12-core CPU and 18-core GPU",
    "16GB unified memory",
    "512GB SSD storage",
    "16.2-inch Liquid Retina XDR display",
    "1080p FaceTime HD camera",
    "Six-speaker sound system with force-cancelling woofers",
    "Up to 22 hours battery life",
    "Three Thunderbolt 4 ports, HDMI port, SDXC card slot",
  ],
  specifications: {
    Display: "16.2-inch Liquid Retina XDR",
    Processor: "Apple M3 Pro chip",
    Memory: "16GB unified memory",
    Storage: "512GB SSD",
    Graphics: "18-core GPU",
    Battery: "Up to 22 hours",
    Weight: "4.7 pounds",
    Dimensions: "14.01 x 9.77 x 0.66 inches",
  },
  customerReviews: [
    {
      id: 1,
      name: "John D.",
      date: "May 15, 2025",
      verified: true,
      rating: 5,
      title: "Exceptional Performance",
      content:
        "Exceptional performance and build quality. The M3 chip handles everything I throw at it with ease. Highly recommended for professional work. Battery life is incredible, lasting me through an entire workday with plenty to spare.",
      helpful: 24,
      images: ["/placeholder.svg?height=120&width=120"],
    },
    {
      id: 2,
      name: "Sarah M.",
      date: "May 10, 2025",
      verified: true,
      rating: 4,
      title: "Great but could use more ports",
      content:
        "Great laptop overall. The display is stunning and battery life is impressive. Only wish it had more ports. The performance is stellar for video editing and software development. Would recommend to creative professionals.",
      helpful: 18,
    },
    {
      id: 3,
      name: "Michael T.",
      date: "May 5, 2025",
      verified: true,
      rating: 5,
      title: "Worth every penny",
      content:
        "This is my third MacBook Pro and it's by far the best one yet. The M3 chip is incredibly fast, and the screen is absolutely gorgeous. The keyboard feels great to type on and the trackpad is responsive. Highly recommend!",
      helpful: 31,
    },
  ],
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const { addItem } = useCart()
  const { toast } = useToast()

  // In a real application, we would fetch the product data based on the params.id
  useEffect(() => {
    // This would be a fetch call in a real application
    console.log(`Fetching product with ID: ${params.id}`)
  }, [params.id])

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    })
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-orange-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-orange-600 font-medium">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>

              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              <Badge className="bg-red-500 text-white">Save ${product.originalPrice - product.price}</Badge>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {product.colorOptions && (
              <div className="space-y-3">
                <label className="block font-medium">
                  Color: <span className="text-gray-600">{product.colorOptions[selectedColor].name}</span>
                </label>
                <div className="flex items-center space-x-3">
                  {product.colorOptions.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedColor === index ? "ring-2 ring-offset-2 ring-orange-500" : ""
                      }`}
                      style={{ backgroundColor: color.code }}
                      aria-label={`Select ${color.name}`}
                    >
                      {selectedColor === index && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-green-600">{product.stock} in stock</span>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-lg inline-block mb-2">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">Orders over $500</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-lg inline-block mb-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-gray-600">Full coverage</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-purple-100 rounded-lg inline-block mb-2">
                  <RotateCcw className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-gray-600">No questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="font-medium text-gray-900">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <CustomerReviews
                reviews={product.customerReviews}
                rating={product.rating}
                totalReviews={product.reviews}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products Section */}
        <div className="mt-20">
          <RelatedProducts category={product.category} currentProductId={product.id} />
        </div>
      </div>
    </div>
  )
}
