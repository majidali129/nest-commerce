export interface Review {
  id: string
  product_id: string
  author_name: string
  rating: number
  title?: string
  body: string
  created_at: string
  verified_purchase?: boolean
}
