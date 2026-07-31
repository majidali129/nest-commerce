import type {
  Category,
  Customer,
  Order,
  Product,
  Review,
} from "#lib/types"
import {
  dashboardStats,
  ordersByStatus,
  revenueSeries,
  topProducts,
} from "./admin-stats"
import { categories } from "./categories"
import { customers } from "./customers"
import { orders } from "./orders"
import { products } from "./products"
import { reviews } from "./reviews"
import { getMockUser, mockUser } from "./user"

export {
  categories,
  customers,
  dashboardStats,
  orders,
  ordersByStatus,
  products,
  revenueSeries,
  reviews,
  topProducts,
  mockUser,
  getMockUser,
}

const publishedProducts = products.filter((p) => p.is_published)

export function getPublishedProducts(): Product[] {
  return publishedProducts
}

export function getAllProducts(): Product[] {
  return products
}

export function getProductByIdOrSlug(idOrSlug: string): Product | undefined {
  return publishedProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return publishedProducts.filter((p) => p.category_id === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return publishedProducts.filter((p) => p.is_featured)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.product_id === productId)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return publishedProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, limit)
}

export function getOrders(): Order[] {
  return orders
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id)
}

export function getCustomers(): Customer[] {
  return customers
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((customer) => customer.id === id)
}
