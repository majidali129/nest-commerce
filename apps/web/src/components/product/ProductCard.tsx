import { Link } from "react-router"

import { Badge } from "#components/ui/badge"
import { Card, CardContent } from "#components/ui/card"
import { AddToCartButton } from "#components/product/AddToCartButton"
import { PriceDisplay } from "#components/product/PriceDisplay"
import { StockBadge } from "#components/product/StockBadge"
import { RatingStars } from "#components/review/RatingStars"
import type { Product } from "#lib/types"
import { cn } from "#lib/utils"

interface ProductCardProps {
  product: Product
  variant?: "grid" | "list"
  className?: string
}

function productHasDiscount(product: Product): boolean {
  return (
    (product.discount_percent !== undefined && product.discount_percent > 0) ||
    (product.compare_at_price !== undefined &&
      product.compare_at_price > product.price)
  )
}

export function ProductCard({
  product,
  variant = "grid",
  className,
}: ProductCardProps) {
  const primaryImage =
    product.images.find((image) => image.is_primary) ?? product.images[0]
  const hasDiscount = productHasDiscount(product)
  const saleLabel =
    product.discount_percent && product.discount_percent > 0
      ? `-${Math.round(product.discount_percent)}%`
      : "Sale"

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "flex-row overflow-hidden p-0 transition-shadow hover:shadow-md",
          className
        )}
      >
        <Link
          to={`/products/${product.slug}`}
          className="group relative aspect-square w-32 shrink-0 overflow-hidden bg-muted sm:w-44"
        >
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
          <Link to={`/products/${product.slug}`} className="group block">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <h3 className="font-medium group-hover:underline">
                  {product.title}
                </h3>
              </div>
              {hasDiscount && (
                <Badge variant="destructive">{saleLabel}</Badge>
              )}
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.short_description}
            </p>
            <RatingStars
              rating={product.rating_average}
              count={product.rating_count}
            />
          </Link>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compare_at_price}
                discountPercent={product.discount_percent}
                currency={product.currency}
              />
              <StockBadge status={product.stock_status} />
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
        className
      )}
    >
      <Link to={`/products/${product.slug}`} className="group block flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
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
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="line-clamp-1 text-sm font-medium group-hover:underline">
            {product.title}
          </h3>
          <RatingStars
            rating={product.rating_average}
            count={product.rating_count}
          />
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compare_at_price}
            discountPercent={product.discount_percent}
            currency={product.currency}
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
