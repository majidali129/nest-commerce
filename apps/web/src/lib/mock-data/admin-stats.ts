import type {
  DashboardStat,
  OrdersByStatusPoint,
  RevenuePoint,
  TopProductPoint,
} from "#lib/types"

export const dashboardStats: DashboardStat[] = [
  {
    key: "revenue",
    label: "Total revenue",
    value: 48250,
    format: "currency",
    delta: "+12.4%",
    subtext: "vs. previous 30 days",
  },
  {
    key: "orders",
    label: "Orders",
    value: 316,
    format: "number",
    delta: "+8.1%",
    subtext: "vs. previous 30 days",
  },
  {
    key: "customers",
    label: "Customers",
    value: 187,
    format: "number",
    delta: "+5.6%",
    subtext: "vs. previous 30 days",
  },
  {
    key: "aov",
    label: "Avg. order value",
    value: 152.69,
    format: "currency",
    delta: "-2.3%",
    subtext: "vs. previous 30 days",
  },
]

export const revenueSeries: RevenuePoint[] = [
  { month: "Aug", revenue: 2980, orders: 21 },
  { month: "Sep", revenue: 3420, orders: 24 },
  { month: "Oct", revenue: 3180, orders: 22 },
  { month: "Nov", revenue: 4150, orders: 29 },
  { month: "Dec", revenue: 5640, orders: 38 },
  { month: "Jan", revenue: 3890, orders: 26 },
  { month: "Feb", revenue: 3560, orders: 24 },
  { month: "Mar", revenue: 4280, orders: 30 },
  { month: "Apr", revenue: 4020, orders: 28 },
  { month: "May", revenue: 4610, orders: 31 },
  { month: "Jun", revenue: 4940, orders: 33 },
  { month: "Jul", revenue: 5580, orders: 37 },
]

export const ordersByStatus: OrdersByStatusPoint[] = [
  { status: "paid", count: 64 },
  { status: "processing", count: 47 },
  { status: "shipped", count: 82 },
  { status: "delivered", count: 123 },
]

export const topProducts: TopProductPoint[] = [
  { title: "Aura Wireless Headphones", revenue: 8449 },
  { title: "Pulse Smartwatch S2", revenue: 6766 },
  { title: "Strider Runner", revenue: 4949 },
  { title: "Atlas Denim Jacket", revenue: 3239 },
  { title: "Haven Throw Blanket", revenue: 2729 },
]
