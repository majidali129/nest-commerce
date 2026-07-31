import type { OrderStatus } from "./order"

export interface DashboardStat {
  key: string
  label: string
  value: number
  format: "currency" | "number"
  delta: string
  subtext: string
}

export interface RevenuePoint {
  month: string
  revenue: number
  orders: number
}

export interface OrdersByStatusPoint {
  status: OrderStatus
  count: number
}

export interface TopProductPoint {
  title: string
  revenue: number
}
