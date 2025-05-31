import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Gift, Percent } from "lucide-react"

export function OffersSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these limited-time deals and exclusive promotions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Offer */}
          <Card className="lg:col-span-2 border-0 shadow-xl overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="bg-white/20 text-white mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Limited Time
                  </Badge>
                  <h3 className="text-3xl font-bold mb-2">Black Friday Sale</h3>
                  <p className="text-xl opacity-90">Up to 40% off on selected laptops and desktops</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">40%</div>
                  <div className="text-sm opacity-80">OFF</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Featured laptop"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">MacBook Pro M3</p>
                    <p className="opacity-80">Starting from $1,999</p>
                  </div>
                </div>
                <Button className="bg-white text-orange-600 hover:bg-gray-100 w-full">Shop Now</Button>
              </div>
            </CardContent>
          </Card>

          {/* Side Offers */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Gift className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Free Accessories</h4>
                    <p className="text-sm text-gray-600">With laptop purchase over $1,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Percent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Student Discount</h4>
                    <p className="text-sm text-gray-600">Extra 10% off with valid student ID</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <h4 className="font-bold mb-2">Bundle Deal</h4>
                <p className="text-sm opacity-90 mb-4">Desktop + Monitor + Keyboard combo</p>
                <Button className="bg-white text-purple-600 hover:bg-gray-100 w-full">Save $300</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
