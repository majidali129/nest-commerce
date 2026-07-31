import { Link } from "react-router"
import { PackageSearch } from "lucide-react"

import { OrderDetailView } from "#components/admin/OrderDetailView"
import { StatusBadge } from "#components/admin/StatusBadge"
import { EmptyState } from "#components/catalog/EmptyState"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { Button } from "#components/ui/button"
import { getOrderById } from "#lib/mock-data"
import { formatDate } from "#lib/format"

export function OrderDetailPage() {
  const order = getOrderById('ord-001')

  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description="This order may not exist."
        action={
          <Button render={<Link to="/admin/orders" />}>Back to orders</Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumb
        items={[
          { label: "Admin", to: "/admin" },
          { label: "Orders", to: "/admin/orders" },
          { label: order.id },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.placed_at)}
          </p>
        </div>
        <StatusBadge kind="order" status={order.status} />
      </div>
      <OrderDetailView order={order} />
    </div>
  )
}
