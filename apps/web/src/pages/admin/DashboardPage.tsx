import { DollarSign, Receipt, Users, Wallet } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import {
  OrdersByStatusChart,
  RevenueChart,
  TopProductsChart,
} from "#components/admin/DashboardCharts"
import { StatCard } from "#components/admin/StatCard"
import { dashboardStats } from "#lib/mock-data"

const statIcons = {
  revenue: DollarSign,
  orders: Receipt,
  customers: Users,
  aov: Wallet,
} as const

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Dashboard"
        description="Store performance at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.key}
            stat={stat}
            icon={statIcons[stat.key as keyof typeof statIcons] ?? Receipt}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <OrdersByStatusChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TopProductsChart />
      </div>
    </div>
  )
}
