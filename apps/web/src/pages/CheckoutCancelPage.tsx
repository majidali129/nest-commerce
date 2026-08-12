import { useEffect, useRef } from "react"
import { Link, useSearchParams } from "react-router"
import { CircleX } from "lucide-react"

import { Button } from "#components/ui/button"
import { useCancelCheckout } from "#components/orders/hooks/use-orders"
import { checkoutShippingPath, productsPath } from "../paths"

export function CheckoutCancelPage() {
  const [searchParams] = useSearchParams()
  const orderIdParam = searchParams.get("order_id")
  const orderId = orderIdParam ? Number(orderIdParam) : null
  const { cancelCheckoutAsync, isCancellingCheckout } = useCancelCheckout()
  const attempted = useRef(false)

  useEffect(() => {
    if (!orderId || Number.isNaN(orderId) || attempted.current) return
    attempted.current = true
    void cancelCheckoutAsync(orderId).catch(() => {
      // Webhook expiry remains authoritative if this fails.
    })
  }, [orderId, cancelCheckoutAsync])

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CircleX className="size-7" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Payment cancelled
        </h1>
        <p className="text-muted-foreground">
          {isCancellingCheckout
            ? "Releasing your reserved items…"
            : "Your payment was cancelled. Your cart has been restored so you can try again."}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button render={<Link to={checkoutShippingPath()} />}>
          Back to checkout
        </Button>
        <Button variant="outline" render={<Link to={productsPath()} />}>
          Continue shopping
        </Button>
      </div>
    </div>
  )
}
