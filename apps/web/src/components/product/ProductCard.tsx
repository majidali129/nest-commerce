import { Link } from "react-router"
import type { ProductListItem } from "@repo/contracts"

import { Badge } from "#components/ui/badge"
import { Card, CardContent } from "#components/ui/card"
import { AddToCartButton } from "#components/product/AddToCartButton"
import { PriceDisplay } from "#components/product/PriceDisplay"
import { StockBadge } from "#components/product/StockBadge"
import {
  compareAtFromDiscount,
  stockStatusFromCount,
} from "#lib/mappers/product"
import { cn } from "#lib/utils"

interface ProductCardProps {
  product: ProductListItem
  variant?: "grid" | "list"
  className?: string
}

export function ProductCard({
  product,
  variant = "grid",
  className,
}: ProductCardProps) {
  const v = product.variant
  const price = v?.price ?? 0
  const discount = v?.discountPercentage ?? 0
  const compareAt = compareAtFromDiscount(price, discount)
  const stock = v?.stock ?? 0
  const stockStatus = stockStatusFromCount(stock)
  const imageUrl =
    v?.media?.url ??
    `https://picsum.photos/seed/${encodeURIComponent(product.slug)}/800/800`
  const imageAlt = v?.media?.altText ?? product.name
  const hasDiscount = discount > 0
  const saleLabel = hasDiscount ? `-${Math.round(discount)}%` : "Sale"
  const href = `/products/${product.id}`

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "flex-row overflow-hidden p-0 transition-shadow hover:shadow-md",
          className,
        )}
      >
        <Link
          to={href}
          className="group relative aspect-square w-32 shrink-0 overflow-hidden bg-muted sm:w-44"
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
          <Link to={href} className="group block">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">
                  {product.category.name}
                </p>
                <h3 className="font-medium group-hover:underline">
                  {product.name}
                </h3>
              </div>
              {hasDiscount && <Badge variant="destructive">{saleLabel}</Badge>}
            </div>
          </Link>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <PriceDisplay
                price={price}
                compareAtPrice={compareAt}
                discountPercent={discount > 0 ? discount : undefined}
              />
              <StockBadge status={stockStatus} />
            </div>
            <AddToCartButton product={product} sizeVariant="sm" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <Link to={href} className="group block flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {saleLabel}
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-col gap-1.5 p-4">
          <p className="text-xs text-muted-foreground">
            {product.category.name}
          </p>
          <h3 className="line-clamp-1 text-sm font-medium group-hover:underline">
            {product.name}
          </h3>
          <PriceDisplay
            price={price}
            compareAtPrice={compareAt}
            discountPercent={discount > 0 ? discount : undefined}
            className="pt-0.5"
          />
        </CardContent>
      </Link>
      <div className="px-4 pb-4">
        <AddToCartButton product={product} sizeVariant="sm" className="w-full" />
      </div>
    </Card>
  )
}
