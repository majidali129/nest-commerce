import type { ShippingInfo } from "./cart"

export type CustomerAddress = ShippingInfo & { id: string; label: string }

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  order_count: number
  total_spent: number
  addresses: CustomerAddress[]
}
