import { ShoppingBag } from "lucide-react"

import { Button } from "#components/ui/button"
import type { Product } from "#lib/types"
import { cn } from "#lib/utils"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  color?: string
  size?: string
  sizeVariant?: "default" | "sm"
  className?: string
}

export function AddToCartButton({
  product,
  sizeVariant = "default",
  className,
}: AddToCartButtonProps) {
  const isOutOfStock = product.stock_status === "out_of_stock"

  return (
    <Button
      type="button"
      size={sizeVariant === "sm" ? "sm" : "lg"}
      className={cn(
        sizeVariant === "default" && "flex-1 sm:flex-none sm:px-10",
        className
      )}
      disabled={isOutOfStock}
    >
      <ShoppingBag data-icon="inline-start" />
      {isOutOfStock ? "Out of stock" : "Add to Cart"}
    </Button>
  )
}
