"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserCircle, Package, CreditCard, Settings, LogOut, MapPin, Search } from "lucide-react"
import { LoginPage } from "@/components/login-page"

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // For demo purposes - toggle login state
  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLoginToggle} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircle className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">John Smith</p>
                      <p className="text-sm text-gray-500">john.smith@example.com</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-auto bg-transparent space-y-1 p-2">
                    <Button
                      variant={activeTab === "profile" ? "secondary" : "ghost"}
                      className="justify-start w-full px-3 py-2"
                      onClick={() => setActiveTab("profile")}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                    <Button
                      variant={activeTab === "orders" ? "secondary" : "ghost"}
                      className="justify-start w-full px-3 py-2"
                      onClick={() => setActiveTab("orders")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Order History
                    </Button>
                    <Button
                      variant={activeTab === "tracking" ? "secondary" : "ghost"}
                      className="justify-start w-full px-3 py-2"
                      onClick={() => setActiveTab("tracking")}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Order Tracking
                    </Button>
                    <Button
                      variant={activeTab === "payment" ? "secondary" : "ghost"}
                      className="justify-start w-full px-3 py-2"
                      onClick={() => setActiveTab("payment")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button
                      variant={activeTab === "settings" ? "secondary" : "ghost"}
                      className="justify-start w-full px-3 py-2"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-500 hover:text-gray-900"
                      onClick={handleLoginToggle}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal information and account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="first-name" className="block text-sm font-medium">
                              First Name
                            </label>
                            <Input id="first-name" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="last-name" className="block text-sm font-medium">
                              Last Name
                            </label>
                            <Input id="last-name" defaultValue="Smith" />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium">
                              Email Address
                            </label>
                            <Input id="email" type="email" defaultValue="john.smith@example.com" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium">
                              Phone Number
                            </label>
                            <Input id="phone" defaultValue="(555) 123-4567" />
                          </div>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Address Information</CardTitle>
                      <CardDescription>Manage your shipping and billing addresses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Default Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <address className="not-italic text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">John Smith</p>
                                <p>123 Main Street</p>
                                <p>Apt 4B</p>
                                <p>New York, NY 10001</p>
                                <p>United States</p>
                                <p>(555) 123-4567</p>
                              </address>
                              <div className="mt-4 space-x-3">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-dashed shadow-sm flex items-center justify-center">
                            <CardContent className="text-center p-6">
                              <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                              <h3 className="font-medium text-gray-900 mb-2">Add New Address</h3>
                              <p className="text-sm text-gray-500 mb-4">Add a new shipping or billing address</p>
                              <Button variant="outline">Add Address</Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6 max-w-md">
                        <div className="space-y-2">
                          <label htmlFor="current-password" className="block text-sm font-medium">
                            Current Password
                          </label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="new-password" className="block text-sm font-medium">
                            New Password
                          </label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="confirm-password" className="block text-sm font-medium">
                            Confirm New Password
                          </label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600">Update Password</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and manage your past orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "ORD-2024-001",
                          date: "May 15, 2024",
                          status: "Delivered",
                          total: 2499.99,
                          items: ["MacBook Pro 16-inch M3"],
                        },
                        {
                          id: "ORD-2024-002",
                          date: "May 10, 2024",
                          status: "Shipped",
                          total: 399.99,
                          items: ["Sony WH-1000XM5 Headphones"],
                        },
                        {
                          id: "ORD-2024-003",
                          date: "May 5, 2024",
                          status: "Processing",
                          total: 1899.99,
                          items: ["Dell XPS Desktop", "Wireless Mouse"],
                        },
                      ].map((order) => (
                        <Card key={order.id} className="shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                  <h3 className="font-semibold text-gray-900">{order.id}</h3>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "Shipped"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                                <p className="text-sm text-gray-600">{order.items.join(", ")}</p>
                              </div>
                              <div className="flex flex-col md:items-end space-y-2">
                                <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Reorder
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "tracking" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Track Your Order</CardTitle>
                    <CardDescription>Enter your order number to track its status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex space-x-4">
                        <Input placeholder="Enter order number (e.g., ORD-2024-001)" className="flex-1" />
                        <Button className="bg-orange-500 hover:bg-orange-600">Track Order</Button>
                      </div>

                      {/* Sample tracking result */}
                      <Card className="bg-gray-50">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-gray-900">Order #ORD-2024-002</h3>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                In Transit
                              </span>
                            </div>
                            <p className="text-gray-600">Sony WH-1000XM5 Headphones</p>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-gray-900">Order Confirmed</p>
                                  <p className="text-sm text-gray-500">May 10, 2024 at 2:30 PM</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-gray-900">Processing</p>
                                  <p className="text-sm text-gray-500">May 11, 2024 at 9:15 AM</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-gray-900">Shipped</p>
                                  <p className="text-sm text-gray-500">May 12, 2024 at 11:45 AM</p>
                                  <p className="text-sm text-gray-500">Tracking: 1Z999AA1234567890</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-gray-500">Out for Delivery</p>
                                  <p className="text-sm text-gray-500">Estimated: May 13, 2024</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-gray-500">Delivered</p>
                                  <p className="text-sm text-gray-500">Estimated: May 13, 2024</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">Visa ending in 4242</CardTitle>
                              <div className="bg-blue-600 rounded px-2 py-1 text-white text-xs">Default</div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-gray-600 space-y-1">
                              <p>John Smith</p>
                              <p>Expires 04/26</p>
                            </div>
                            <div className="mt-4 space-x-3">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-dashed shadow-sm flex items-center justify-center">
                          <CardContent className="text-center p-6">
                            <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900 mb-2">Add Payment Method</h3>
                            <p className="text-sm text-gray-500 mb-4">Add a new credit card or payment method</p>
                            <Button variant="outline">Add Payment Method</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Order Updates</p>
                              <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Promotional Emails</p>
                              <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Product Updates</p>
                              <p className="text-sm text-gray-500">Get notified about new products</p>
                            </div>
                            <input type="checkbox" className="rounded" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Profile Visibility</p>
                              <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                            </div>
                            <input type="checkbox" className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Data Analytics</p>
                              <p className="text-sm text-gray-500">Help us improve by sharing usage data</p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600">Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
