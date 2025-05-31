"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, ArrowLeft, Trash2, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your wishlist yet.</p>
              <Link href="/products">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{item.brand}</p>
                          <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">Category: {item.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                        <Button onClick={() => handleAddToCart(item)} className="bg-orange-500 hover:bg-orange-600">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearWishlist} className="text-red-600 border-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Wishlist
              </Button>
              <p className="text-sm text-gray-600">
                {items.length} item{items.length !== 1 ? "s" : ""} in wishlist
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Wishlist Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Value</span>
                  <span>${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
                <Separator />
              </div>

              <div className="mt-6 space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    items.forEach((item) => handleAddToCart(item))
                    toast({
                      title: "Added all to cart",
                      description: "All wishlist items have been added to your cart.",
                    })
                  }}
                >
                  Add All to Cart
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">Save items for later or add them to your cart</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
