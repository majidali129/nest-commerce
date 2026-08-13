import { useEffect } from "react"
import { Link, useSearchParams } from "react-router"
import { CircleCheck, Loader2 } from "lucide-react"

import { Button } from "#components/ui/button"
import { useOrderBySession } from "#components/orders/hooks/use-orders"
import { productsPath, profilePath } from "../paths"

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { order, isLoadingOrder, orderError } = useOrderBySession(sessionId)

  useEffect(() => {
    // Soft hint while webhook catches up
  }, [order?.status])

  const isFinalizing = order?.status === "pending" || (isLoadingOrder && !order)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          {isFinalizing ? (
            <Loader2 className="size-7 animate-spin" />
          ) : (
            <CircleCheck className="size-7" />
          )}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isFinalizing ? "Confirming your payment…" : "Payment successful"}
        </h1>
        <p className="text-muted-foreground">
          {orderError
            ? "Payment succeeded, but we could not load your order yet. Check your profile shortly."
            : isFinalizing
              ? "Hang tight — we are finalizing your order."
              : "Thank you — your payment went through."}
        </p>
        {order ? (
          <p className="text-sm text-muted-foreground">
            Order{" "}
            <span className="font-medium text-foreground">
              {order.orderNumber}
            </span>{" "}
            · {order.status}
          </p>
        ) : sessionId ? (
          <p className="text-xs text-muted-foreground">Session {sessionId}</p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button render={<Link to={profilePath()} />}>Go to profile</Button>
        <Button variant="outline" render={<Link to={productsPath()} />}>
          Continue shopping
        </Button>
      </div>
    </div>
  )
}
