import { Link, useParams } from "react-router"
import { PackageSearch } from "lucide-react"

import { OrderDetailView } from "#components/admin/OrderDetailView"
import { StatusBadge } from "#components/admin/StatusBadge"
import { EmptyState } from "#components/catalog/EmptyState"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { useAdminOrder } from "#components/orders/hooks/use-orders"
import { Button } from "#components/ui/button"
import { Skeleton } from "#components/ui/skeleton"
import { formatDate } from "#lib/format"

export function OrderDetailPage() {
  const { orderId = "" } = useParams()
  const numericId = Number(orderId)
  const { order, isLoadingOrder, isOrderError, orderError } = useAdminOrder(
    Number.isFinite(numericId) && numericId > 0 ? numericId : null,
  )

  if (isLoadingOrder) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (isOrderError || !order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description={orderError?.message ?? "This order may not exist."}
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
          { label: order.orderNumber },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge kind="order" status={order.status} />
      </div>
      <OrderDetailView order={order} />
    </div>
  )
}
