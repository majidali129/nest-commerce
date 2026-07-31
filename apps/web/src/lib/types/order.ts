import type { ShippingInfo } from "./cart"

export type OrderStatus = "paid" | "processing" | "shipped" | "delivered"

export interface OrderLineItem {
  id: string
  product_id: string
  title: string
  image_url: string
  price: number
  quantity: number
  color?: string
  size?: string
}

export interface OrderTimelineStep {
  status: OrderStatus
  label: string
  date: string
  completed: boolean
}

export interface Order {
  id: string
  placed_at: string
  status: OrderStatus
  item_count: number
  subtotal: number
  shipping: number
  discount: number
  total: number
  items: OrderLineItem[]
  shipping_address: ShippingInfo
  delivery_estimate: string
  timeline: OrderTimelineStep[]
}
