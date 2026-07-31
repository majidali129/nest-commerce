import { Badge } from "#components/ui/badge"
import { formatPrice } from "#lib/format"
import { cn } from "#lib/utils"

interface PriceDisplayProps {
  price: number
  compareAtPrice?: number
  discountPercent?: number
  currency?: string
  className?: string
}

export function PriceDisplay({
  price,
  compareAtPrice,
  discountPercent,
  currency = "USD",
  className,
}: PriceDisplayProps) {
  const hasDiscount =
    (discountPercent !== undefined && discountPercent > 0) ||
    (compareAtPrice !== undefined && compareAtPrice > price)

  const percent =
    discountPercent !== undefined && discountPercent > 0
      ? Math.round(discountPercent)
      : hasDiscount && compareAtPrice
        ? Math.round((1 - price / compareAtPrice) * 100)
        : 0

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-semibold">{formatPrice(price, currency)}</span>
      {hasDiscount && (
        <>
          {compareAtPrice !== undefined && compareAtPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(compareAtPrice, currency)}
            </span>
          )}
          {percent > 0 && (
            <Badge variant="destructive">-{percent}%</Badge>
          )}
        </>
      )}
    </span>
  )
}
