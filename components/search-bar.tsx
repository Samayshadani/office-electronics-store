"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock product data - in a real app this would come from an API
const allProducts = [
  { id: 1, name: "MacBook Pro 16-inch M3", category: "laptops", brand: "Apple" },
  { id: 2, name: "Dell XPS Desktop", category: "desktops", brand: "Dell" },
  { id: 3, name: "Sony WH-1000XM5", category: "accessories", brand: "Sony" },
  { id: 4, name: "ThinkPad X1 Carbon", category: "laptops", brand: "Lenovo" },
  { id: 5, name: "HP EliteDesk 800", category: "desktops", brand: "HP" },
  { id: 6, name: "Logitech MX Master 3S", category: "accessories", brand: "Logitech" },
  { id: 7, name: "Surface Laptop Studio", category: "laptops", brand: "Microsoft" },
  { id: 8, name: "MacBook Air M3", category: "laptops", brand: "Apple" },
  { id: 9, name: "Dell XPS 13 Plus", category: "laptops", brand: "Dell" },
  { id: 10, name: "ASUS ROG Zephyrus G14", category: "laptops", brand: "ASUS" },
  { id: 11, name: "iMac 24-inch M3", category: "desktops", brand: "Apple" },
  { id: 12, name: "ASUS ROG Strix GT35", category: "desktops", brand: "ASUS" },
]

export function SearchBar({ className = "" }: { className?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof allProducts>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 1) {
      setIsSearching(true)
      // Filter products based on search term
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.brand.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase()),
      )
      setSearchResults(results.slice(0, 5)) // Limit to 5 results for dropdown
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim().length > 0) {
      setIsSearching(false)
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          className="pl-10 pr-10 bg-gray-50 border-0 focus:bg-white transition-colors"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("")
              setIsSearching(false)
              setSearchResults([])
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => setIsSearching(false)}
                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500">
                  {product.brand} • {product.category}
                </div>
              </Link>
            ))}
          </div>
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-center text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              onClick={() => {
                setIsSearching(false)
                router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
              }}
            >
              See all results for "{searchTerm}"
            </Button>
          </div>
        </div>
      )}

      {isSearching && searchResults.length === 0 && searchTerm.length > 1 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border p-4 text-center">
          <p className="text-gray-500">No products found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
