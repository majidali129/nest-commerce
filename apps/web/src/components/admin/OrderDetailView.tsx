import { useEffect, useState } from "react"
import type { OrderReturnType, OrderStatus } from "@repo/contracts"

import { StatusBadge } from "#components/admin/StatusBadge"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { useUpdateOrderStatus } from "#components/orders/hooks/use-orders"
import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"
import { Separator } from "#components/ui/separator"
import { formatDate } from "#lib/format"
import {
  allowedNextStatuses,
  buildOrderTimeline,
  formatOrderStatus,
  orderItemToCartLine,
} from "#lib/order-utils"
import { cn } from "#lib/utils"

interface OrderDetailViewProps {
  order: OrderReturnType
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const nextStatuses = allowedNextStatuses(order.status)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">(
    nextStatuses[0] ?? "",
  )
  const { updateOrderStatusAsync, isUpdatingOrderStatus } =
    useUpdateOrderStatus()

  useEffect(() => {
    setSelectedStatus(allowedNextStatuses(order.status)[0] ?? "")
  }, [order.status])

  const cartItems = order.items.map(orderItemToCartLine)
  const address = order.shippingAddress
  const timeline = buildOrderTimeline(order)

  async function handleUpdateStatus() {
    if (!selectedStatus) return
    await updateOrderStatusAsync({
      orderId: order.id,
      input: { status: selectedStatus },
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {cartItems.map((item) => (
              <CartLineItem key={item.id} item={item} readOnly />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fulfillment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current status</span>
              <StatusBadge kind="order" status={order.status} />
            </div>

            {nextStatuses.length > 0 ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={selectedStatus || undefined}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      setSelectedStatus(value as OrderStatus)
                    }
                  }}
                >
                  <SelectTrigger className="w-full" aria-label="New status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {nextStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatOrderStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  className="shrink-0"
                  disabled={!selectedStatus || isUpdatingOrderStatus}
                  onClick={() => {
                    void handleUpdateStatus()
                  }}
                >
                  {isUpdatingOrderStatus ? "Updating…" : "Update status"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No further status changes are available for this order.
              </p>
            )}

            {order.payment ? (
              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">Payment</span>
                <StatusBadge kind="payment" status={order.payment.status} />
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col">
              {timeline.map((step, index) => (
                <li key={`${step.status}-${index}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex size-3 rounded-full",
                        step.completed ? "bg-primary" : "bg-muted",
                      )}
                    />
                    {index < timeline.length - 1 && (
                      <span className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        !step.completed && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </p>
                    {step.date ? (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(step.date)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p className="font-medium">{address.recipientName}</p>
            <p className="text-muted-foreground">{address.email}</p>
            <p className="text-muted-foreground">{address.phone}</p>
            <Separator className="my-3" />
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Shipping address
            </p>
            <address className="not-italic text-sm text-muted-foreground">
              {address.line1 ? <p>{address.line1}</p> : null}
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
            </address>
          </CardContent>
        </Card>

        <OrderSummary subtotal={order.totalAmount} />
      </div>
    </div>
  )
}
