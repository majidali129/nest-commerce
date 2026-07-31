export interface CartItem {
  id: string
  product_id: string
  variant_id?: string
  title: string
  image_url: string
  price: number
  quantity: number
  color?: string
  size?: string
}

export interface ShippingInfo {
  full_name: string
  email: string
  phone: string
  country: string
  city: string
  state: string
  zip_code: string
}
