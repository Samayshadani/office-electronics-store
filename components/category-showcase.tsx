import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Laptop, Monitor, Headphones } from "lucide-react"

const categories = [
  {
    id: "laptops",
    name: "Laptops",
    description: "Portable powerhouses for modern professionals",
    icon: Laptop,
    image: "/placeholder.svg?height=300&width=400",
    count: "150+ Models",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: "desktops",
    name: "Desktops",
    description: "High-performance workstations for demanding tasks",
    icon: Monitor,
    image: "/placeholder.svg?height=300&width=400",
    count: "80+ Models",
    gradient: "from-green-500 to-teal-600",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Essential peripherals to complete your setup",
    icon: Headphones,
    image: "/placeholder.svg?height=300&width=400",
    count: "200+ Items",
    gradient: "from-orange-500 to-red-600",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of office electronics, carefully curated for professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
                  ></div>
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 bg-white/90 backdrop-blur-sm rounded-xl`}>
                      <category.icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {category.count}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
