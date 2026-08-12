import { Link, useParams } from "react-router"

import { Separator } from "#components/ui/separator"
import { Skeleton } from "#components/ui/skeleton"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { OrderStatusBadge } from "#components/order/OrderStatusBadge"
import { useOrder } from "#components/orders/hooks/use-orders"
import { formatDate } from "#lib/format"
import {
  buildOrderTimeline,
  orderItemToCartLine,
} from "#lib/order-utils"
import { cn } from "#lib/utils"

export function ProfileOrderDetailPage() {
  const { orderId = "" } = useParams()
  const numericId = Number(orderId)
  const { order, isLoadingOrder, isOrderError, orderError } = useOrder(
    Number.isFinite(numericId) && numericId > 0 ? numericId : null,
  )

  if (isLoadingOrder) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isOrderError || !order) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {orderError?.message ?? "Order not found."}
        </p>
        <Link to="/profile/orders" className="text-sm underline">
          Back to orders
        </Link>
      </div>
    )
  }

  const cartItems = order.items.map(orderItemToCartLine)
  const address = order.shippingAddress
  const timeline = buildOrderTimeline(order)

  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumb
        items={[
          { label: "Profile", to: "/profile" },
          { label: "Orders", to: "/profile/orders" },
          { label: order.orderNumber },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 text-lg font-medium">Order timeline</h2>
            <ol className="flex flex-col gap-0">
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
          </section>

          <section>
            <h2 className="mb-4 text-lg font-medium">Items</h2>
            <div className="flex flex-col gap-5">
              {cartItems.map((item) => (
                <CartLineItem key={item.id} item={item} readOnly />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium">Shipping address</h2>
            <address className="not-italic text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {address.recipientName}
              </p>
              <p>{address.email}</p>
              <p>{address.phone}</p>
              <Separator className="my-2" />
              {address.line1 ? <p>{address.line1}</p> : null}
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
            </address>
            <Link
              to="/profile/orders"
              className="mt-4 inline-block text-sm underline-offset-4 hover:underline"
            >
              Back to orders
            </Link>
          </section>
        </div>

        <OrderSummary
          subtotal={order.totalAmount}
          className="h-fit lg:sticky lg:top-20"
        />
      </div>
    </div>
  )
}
