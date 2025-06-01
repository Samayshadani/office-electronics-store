import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our products or services? We're here to help you find the perfect solution for your
              office needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="block text-sm font-medium">
                        First Name
                      </label>
                      <Input id="first-name" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="block text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="last-name" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your inquiry in detail..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="shadow-md border-0">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <MapPin className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Address</h3>
                        <p className="text-gray-600 mt-1">
                          Shop No-2, Usmani Complex, Opp. St. Xaviers School Doranda, Ranchi, Jharkhand, India- 834002
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Phone className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Phone</h3>
                        <p className="text-gray-600 mt-1">
                          call: +91 7488388900
                          <br />
                          Whatapp : 7004787478
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-1">
                          dashingdealindia@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Business Hours</h3>
                        <p className="text-gray-600 mt-1">
                          Monday-Friday: 9AM-6PM
                          <br />
                          Saturday: 10AM-4PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
                {/* In a real application, you would integrate a map service here */}
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <p className="text-gray-600">Map location would be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What are your shipping options?</h3>
                <p className="text-gray-600">
                  We offer standard shipping (3-5 business days), express shipping (1-2 business days), and free
                  shipping on orders over $500.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What is your return policy?</h3>
                <p className="text-gray-600">
                  We offer a 30-day return policy on most items. Products must be in original condition with all
                  packaging and accessories.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Do you offer business accounts?</h3>
                <p className="text-gray-600">
                  Yes, we offer special pricing and terms for business customers. Please contact our sales team for more
                  information.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How can I track my order?</h3>
                <p className="text-gray-600">
                  After your order ships, you will receive a confirmation email with tracking information. You can also
                  log into your account to track your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
