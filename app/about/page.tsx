import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Office Electronics</h1>
            <p className="text-xl text-gray-300 mb-8">
              We're dedicated to bringing cutting-edge office technology to professionals and businesses worldwide since
              2005.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Our Products
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Our Mission
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Office Electronics was founded in 2005 with a simple mission: to provide high-quality office
                  technology solutions that enhance productivity and efficiency in the modern workplace.
                </p>
                <p>
                  What began as a small shop with just five employees has grown into a nationwide retailer with over 500
                  team members across 15 locations. Through our journey, we've maintained our commitment to personalized
                  service and technical excellence.
                </p>
                <p>
                  Today, we're proud to be one of the leading suppliers of office electronics, serving individual
                  professionals, small businesses, and Fortune 500 companies alike. Our curated selection of laptops,
                  desktops, and accessories represents the best in technology innovation.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <span>20+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <span>500+ Employees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <span>50,000+ Customers</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Office Electronics Team"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-orange-500/10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              These principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Quality Excellence",
                description:
                  "We meticulously curate our product selection to offer only the highest quality electronics that meet our rigorous standards.",
              },
              {
                icon: Users,
                title: "Customer First",
                description:
                  "Our customers are at the center of every decision we make. We're dedicated to providing exceptional service and solutions.",
              },
              {
                icon: TrendingUp,
                title: "Innovation Focus",
                description:
                  "We continuously seek out the latest technologies and innovative solutions to help our customers stay ahead of the curve.",
              },
            ].map((value, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="p-4 bg-orange-100 rounded-lg inline-block mb-6">
                    <value.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Meet the experts who drive our vision and ensure we deliver excellence every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Sarah Johnson",
                title: "Chief Executive Officer",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Michael Chen",
                title: "Chief Technology Officer",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "David Williams",
                title: "VP of Sales",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Amara Patel",
                title: "Chief Operations Officer",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <Card key={index} className="border-0 shadow-lg group hover:shadow-xl transition-all">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-gray-900 text-xl mb-1">{member.name}</h3>
                    <p className="text-gray-600">{member.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "20+", label: "Years in Business" },
              { value: "50K+", label: "Happy Customers" },
              { value: "15", label: "Store Locations" },
              { value: "10K+", label: "Products" },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Upgrade Your Office?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse our premium selection of office electronics and discover the perfect solution for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Browse Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
