export const ORDER_REPOSITORY = 'ORDER_REPOSITORY'
export const ORDER_ITEM_REPOSITORY = 'ORDER_ITEM_REPOSITORY'

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export type OrderAddressSnapshot = {
  recipientName: string
  email: string
  phone: string
  line1: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type OrderProductSnapshot = {
  productId: number
  variantId?: number | null
  name: string
  sku?: string | null
  imageUrl?: string | null
  attributes?: {
    size: string
    color: string
  } | null
}
