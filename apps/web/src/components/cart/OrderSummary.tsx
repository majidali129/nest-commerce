import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { Separator } from "#components/ui/separator"
import { formatPrice } from "#lib/format"
import { cn } from "#lib/utils"

interface OrderSummaryProps {
  subtotal: number
  discount?: number
  children?: ReactNode
  className?: string
}

export function OrderSummary({
  subtotal,
  discount = 0,
  children,
  className,
}: OrderSummaryProps) {
  const total = subtotal - discount

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-destructive">-{formatPrice(discount)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </CardContent>
      {children && (
        <CardFooter className="flex flex-col gap-2">{children}</CardFooter>
      )}
    </Card>
  )
}
