import { Link } from "react-router"

import { Separator } from "#components/ui/separator"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { OrderStatusBadge } from "#components/order/OrderStatusBadge"
import { formatDate } from "#lib/format"
import { getOrderById } from "#lib/mock-data"
import type { CartItem } from "#lib/types"
import { cn } from "#lib/utils"

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

export function ProfileOrderDetailPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumb
        items={[
          { label: "Profile", to: "/profile" },
          { label: "Orders", to: "/profile/orders" },
          { label: order.id },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.placed_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 text-lg font-medium">Order timeline</h2>
            <ol className="flex flex-col gap-0">
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
              <p className="font-medium text-foreground">{address.full_name}</p>
              <p>{address.email}</p>
              <p>{address.phone}</p>
              <Separator className="my-2" />
              <p>
                {address.city}, {address.state} {address.zip_code}
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
          subtotal={order.subtotal}
          discount={order.discount}
          className="h-fit lg:sticky lg:top-20"
        />
      </div>
    </div>
  )
}
