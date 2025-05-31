import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-orange-500/20 rounded-full mb-6">
              <Mail className="h-8 w-8 text-orange-400" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated with Latest Tech</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get exclusive deals, product launches, and tech insights delivered to your inbox
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">Subscribe</Button>
          </div>

          <p className="text-sm text-gray-400 mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
        </div>
      </div>
    </section>
  )
}
