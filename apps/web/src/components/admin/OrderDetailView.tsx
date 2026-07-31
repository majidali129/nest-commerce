import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "#components/admin/ConfirmDialog"
import { StatusBadge } from "#components/admin/StatusBadge"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { Input } from "#components/ui/input"
import { Separator } from "#components/ui/separator"
import { formatDate } from "#lib/format"
import type { CartItem, Order } from "#lib/types"
import { cn } from "#lib/utils"

interface OrderDetailViewProps {
  order: Order
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const [trackingNumber, setTrackingNumber] = useState("")

  const cartItems: CartItem[] = order.items.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    title: item.title,
    image_url: item.image_url,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
  }))

  const address = order.shipping_address

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
              <span className="text-muted-foreground">Status</span>
              <StatusBadge
                kind="fulfillment"
                status={order.status === "paid" ? "unfulfilled" : order.status}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="Tracking number"
                aria-label="Tracking number"
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={() => toast.success("Tracking number saved (demo)")}
              >
                Save tracking
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col">
              {order.timeline.map((step, index) => (
                <li key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex size-3 rounded-full",
                        step.completed ? "bg-primary" : "bg-muted"
                      )}
                    />
                    {index < order.timeline.length - 1 && (
                      <span className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        !step.completed && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(step.date)}
                      </p>
                    )}
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
            <p className="font-medium">{address.full_name}</p>
            <p className="text-muted-foreground">{address.email}</p>
            <p className="text-muted-foreground">{address.phone}</p>
            <Separator className="my-3" />
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Shipping address
            </p>
            <address className="not-italic text-sm text-muted-foreground">
              <p>
                {address.city}, {address.state} {address.zip_code}
              </p>
              <p>{address.country}</p>
            </address>
          </CardContent>
        </Card>

        <OrderSummary subtotal={order.subtotal} discount={order.discount} />

        <ConfirmDialog
          trigger={
            <Button type="button" variant="outline" className="text-destructive">
              Refund order
            </Button>
          }
          title={`Refund ${order.id}?`}
          description="This is a demo — the refund will not actually be processed and the order will not change."
          confirmLabel="Refund"
          onConfirm={() => toast.success("Refund issued (demo)")}
        />
      </div>
    </div>
  )
}
