import { Badge } from "#components/ui/badge"
import { formatOrderStatus } from "#lib/order-utils"
import type { OrderStatus } from "#lib/types"

const statusVariants: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "secondary",
  processing: "outline",
  shipped: "default",
  delivered: "secondary",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={statusVariants[status]}>{formatOrderStatus(status)}</Badge>
  )
}
