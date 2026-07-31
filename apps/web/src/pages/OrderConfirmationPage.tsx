import { Link } from "react-router"
import { CircleCheck } from "lucide-react"

import { Button } from "#components/ui/button"
import { Separator } from "#components/ui/separator"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { getOrderById } from "#lib/mock-data"
import type { CartItem } from "#lib/types"

const order = getOrderById("VG-1041")!

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

export function OrderConfirmationPage() {
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
          Thank you, {address.full_name}! Your order{" "}
          <span className="font-medium text-foreground">{order.id}</span> is
          confirmed.
        </p>
        <p className="text-sm text-muted-foreground">
          Estimated delivery: {order.delivery_estimate}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <section>
          <h2 className="mb-3 text-lg font-medium">Items</h2>
          <div className="flex flex-col gap-5">
            {cartItems.map((item) => (
              <CartLineItem key={item.id} item={item} readOnly />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Shipping to</h2>
          <address className="not-italic text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{address.full_name}</p>
            <p>
              {address.city}, {address.state} {address.zip_code}
            </p>
            <p>{address.country}</p>
          </address>
        </section>

        <Separator />

        <OrderSummary subtotal={order.subtotal} discount={order.discount} />

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button render={<Link to={`/profile/orders/${order.id}`} />}>
            View in your orders
          </Button>
          <Button variant="outline" render={<Link to="/products" />}>
            Continue shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
