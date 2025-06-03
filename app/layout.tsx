import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DASHING DEAL STORE - Premium Laptops, Desktops & Accessories",
  description:
    "Discover the latest laptops, desktops, and office accessories. Premium quality electronics for your business needs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
