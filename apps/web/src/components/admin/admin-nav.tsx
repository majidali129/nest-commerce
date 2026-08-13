import {
  // LayoutDashboard,
  Package,
  // Settings,
  ShoppingCart,
  Tags,
  // Users,
} from "lucide-react"

export const adminNavItems = [
  // { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tags, end: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart, end: false },
  // { to: "/admin/customers", label: "Customers", icon: Users, end: false },
  // { to: "/admin/settings", label: "Settings", icon: Settings, end: false },
]
