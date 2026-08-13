import type { ProductListItem } from "@repo/contracts"

import { ProductCard } from "#components/product/ProductCard"
import { cn } from "#lib/utils"

interface ProductCollectionProps {
  products: ProductListItem[]
  className?: string
}

export function ProductGrid({ products, className }: ProductCollectionProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </div>
  )
}

export function ProductList({ products, className }: ProductCollectionProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="list" />
      ))}
    </div>
  )
}
