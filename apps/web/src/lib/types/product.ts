export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface ProductImage {
  id: string
  url: string
  alt: string
  is_primary: boolean
  sort_order: number
}

export interface ProductVariant {
  id: string
  color?: string
  size?: string
  sku: string
  /** Present on API-mapped variants; falls back to product price in UI. */
  price?: number
  compare_at_price?: number
  discount_percent?: number
  stock?: number
  stock_status: StockStatus
  image_url?: string
  image_alt?: string
  is_default?: boolean
}

export interface Product {
  id: string
  slug: string
  title: string
  short_description: string
  description: string
  brand: string
  category_id: string
  product_type: string
  price: number
  compare_at_price?: number
  /** Percent off when on sale (e.g. 25). Omit when not discounted. */
  discount_percent?: number
  currency: string
  is_featured: boolean
  is_published: boolean
  sku: string
  stock_status: StockStatus
  rating_average: number
  rating_count: number
  images: ProductImage[]
  variants: ProductVariant[]
  colors: string[]
  sizes: string[]
  tags?: string[]
  created_at: string
  updated_at: string
  published_at: string | null
}
