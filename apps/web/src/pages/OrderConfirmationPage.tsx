import { Link, useParams } from "react-router"
import { CircleCheck } from "lucide-react"

import { Button } from "#components/ui/button"
import { Separator } from "#components/ui/separator"
import { Skeleton } from "#components/ui/skeleton"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { useOrder } from "#components/orders/hooks/use-orders"
import { orderItemToCartLine } from "#lib/order-utils"
import { productsPath, profilePath } from "../paths"

export function OrderConfirmationPage() {
  const { orderId = "" } = useParams()
  const numericId = Number(orderId)
  const { order, isLoadingOrder, isOrderError, orderError } = useOrder(
    Number.isFinite(numericId) && numericId > 0 ? numericId : null,
  )

  if (isLoadingOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="mx-auto h-14 w-14 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-8 w-64" />
        <Skeleton className="mx-auto mt-6 h-48 w-full" />
      </div>
    )
  }

  if (isOrderError || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          {orderError?.message ?? "Order not found."}
        </p>
        <Button className="mt-4" render={<Link to={profilePath()} />}>
          Go to profile
        </Button>
      </div>
    )
  }

  const cartItems = order.items.map(orderItemToCartLine)
  const address = order.shippingAddress

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleCheck className="size-7" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Order confirmed
        </h1>
        <p className="text-muted-foreground">
          Thanks — your order{" "}
          <span className="font-medium text-foreground">
            {order.orderNumber}
          </span>{" "}
          is {order.status}.
        </p>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {cartItems.map((item) => (
              <CartLineItem key={item.id} item={item} readOnly />
            ))}
          </div>
          <address className="not-italic text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {address.recipientName}
            </p>
            <p>{address.email}</p>
            <Separator className="my-2" />
            {address.line1 ? <p>{address.line1}</p> : null}
            <p>
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p>{address.country}</p>
          </address>
        </div>
        <OrderSummary subtotal={order.totalAmount} />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button render={<Link to="/profile/orders" />}>View orders</Button>
        <Button variant="outline" render={<Link to={productsPath()} />}>
          Continue shopping
        </Button>
      </div>
    </div>
  )
}
