import { Link } from "react-router"
import { Package } from "lucide-react"
import type { OrderListItem } from "@repo/contracts"

import { Card, CardContent } from "#components/ui/card"
import { OrderStatusBadge } from "#components/order/OrderStatusBadge"
import { formatDate, formatPrice } from "#lib/format"

export function OrderCard({ order }: { order: OrderListItem }) {
  const previewImage = order.previewImageUrl

  return (
    <Link to={`/profile/orders/${order.id}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="flex gap-4 p-4">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-20">
            {previewImage ? (
              <img
                src={previewImage}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Package className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
            </p>
            <p className="text-sm font-medium">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
