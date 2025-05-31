import { TrendingUp, Users, Award, Truck } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers",
    description: "Trusted by professionals worldwide",
  },
  {
    icon: Award,
    value: "15+",
    label: "Years Experience",
    description: "Leading the industry since 2009",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime Guarantee",
    description: "Reliable service you can count on",
  },
  {
    icon: Truck,
    value: "24/7",
    label: "Fast Shipping",
    description: "Quick delivery across the nation",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Office Electronics?</h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            We're committed to delivering excellence in every aspect of our service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 group-hover:bg-white/30 transition-colors">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <p className="text-orange-100">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
