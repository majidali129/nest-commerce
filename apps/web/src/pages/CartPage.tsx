import { Link } from "react-router"

import { Button } from "#components/ui/button"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import type { CartItem } from "#lib/types"

const cartItems: CartItem[] = [
  {
    id: "cart-1",
    product_id: "prod-001",
    title: "Aura Wireless Headphones",
    image_url: "https://picsum.photos/seed/aura-wireless-headphones-1/800/800",
    price: 129.99,
    quantity: 1,
    color: "Black",
  },
  {
    id: "cart-2",
    product_id: "prod-006",
    title: "Everyday Crew Tee",
    image_url: "https://picsum.photos/seed/everyday-crew-tee-1/800/800",
    price: 24.99,
    quantity: 2,
    color: "White",
    size: "M",
  },
]

const subtotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
)
const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

export function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      <p className="mt-1 text-muted-foreground">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {cartItems.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>

        <OrderSummary subtotal={subtotal} className="h-fit lg:sticky lg:top-20">
          <Button
            size="lg"
            className="w-full"
            render={<Link to="/checkout/shipping" />}
          >
            Checkout
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            render={<Link to="/products" />}
          >
            Continue Shopping
          </Button>
        </OrderSummary>
      </div>
    </div>
  )
}
