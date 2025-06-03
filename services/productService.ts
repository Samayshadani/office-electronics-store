// services/productService.ts

export interface Product {
    category: string
    name: string
    price: number
  
    // Most backend entries should include these—but some categories may omit them.
    originalPrice?: number
    imageUrl?: string
    brand?: string
    rating?: number
    reviews?: number
    stock?: number
    description?: string
    specs?: string[]
    // …and any other fields your frontend relies on.
  }
  
  // Raw shape of your Firebase JSON: each key maps either to an array or to an object.
  type RawProductGroups = Record<string, Array<Record<string, any>> | Record<string, any>>
  
  const FIREBASE_URL =
    "https://electronics-9833f-default-rtdb.asia-southeast1.firebasedatabase.app/products.json"
  
  /*
   Fetches and flattens all products from Firebase.  
   * Handles both array‐valued and object‐valued categories.
   */
  export async function fetchAllProducts(): Promise<Product[]> {
    const res = await fetch(FIREBASE_URL)
    if (!res.ok) {
      throw new Error(`Failed to fetch products: HTTP ${res.status}`)
    }
  
    const data: RawProductGroups = await res.json()
    const flattened: Product[] = []
  
    Object.entries(data).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        // e.g. "GamingMouse": [ { … }, { … }, … ]
        items.forEach((item) => {
          flattened.push({
            ...(item as Omit<Product, "category">),
            category,
          })
        })
      }
      else if (items && typeof items === "object") {
        // “cabinets” is an object; each value has fields like { model, price: "₹ 5,500", … }
        Object.values(items).forEach((item) => {
          const raw = item as Record<string, any>
          // 1) Use `model` as `name`
          const name = typeof raw.model === "string" ? raw.model : raw.name
          // 2) Parse `"₹ 5,500"` → 5500
          let priceNum = 0
          if (typeof raw.price === "number") {
            priceNum = raw.price
          } else if (typeof raw.price === "string") {
            const digits = raw.price.replace(/[^\d]/g, "")
            priceNum = parseInt(digits, 10) || 0
          }
      
          flattened.push({
            category,
            name: name,
            price: priceNum,
            imageUrl: raw.imageUrl,
            // optional: combine a few cabinet fields into description if you like
            // description: raw.dimension
            //   ? `${raw.dimension} • ${raw.panel} • ${raw.fan}`
            //   : undefined,
            // you can also copy `weight`, `usbPort`, etc. into other optional props if needed
          })
        })
      }
      
    })
  
    return flattened
  }
  
  /*
    Returns only those products whose category string (case‐insensitive) is exactly "laptops".
   */
  export async function fetchLaptops(): Promise<Product[]> {
    const all = await fetchAllProducts()
    return all.filter((p) => p.category.toLowerCase() === "laptops")
  }

  export async function fetchDesktops(): Promise<Product[]> {
  const all = await fetchAllProducts()
  return all.filter((p) => p.category.toLowerCase() === "desktops")
}

export async function fetchAccessories(): Promise<Product[]> {
  const all = await fetchAllProducts()
  return all.filter(
    (p) =>
      p.category.toLowerCase() !== "laptops" &&
      p.category.toLowerCase() !== "desktops"
  )
}