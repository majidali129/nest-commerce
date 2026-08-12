import type { OrderStatus } from "@repo/contracts"

import { Badge } from "#components/ui/badge"
import { formatOrderStatus } from "#lib/order-utils"

const statusVariants: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  processing: "outline",
  shipped: "default",
  delivered: "secondary",
  cancelled: "destructive",
  refunded: "destructive",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={statusVariants[status] ?? "outline"}>
      {formatOrderStatus(status)}
    </Badge>
  )
}
