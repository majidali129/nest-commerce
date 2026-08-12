import { ShoppingBag } from "lucide-react"
import { useNavigate } from "react-router"
import type { ProductListItem } from "@repo/contracts"

import { Button } from "#components/ui/button"
import { useAddToCart } from "#components/cart/hooks/use-cart"
import { useCurrentUser } from "#hooks/use-current-user"
import { stockStatusFromCount } from "#lib/mappers/product"
import { cn } from "#lib/utils"
import { signInPath } from "../../paths"

interface AddToCartButtonProps {
  product: ProductListItem
  quantity?: number
  sizeVariant?: "default" | "sm"
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  sizeVariant = "default",
  className,
}: AddToCartButtonProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useCurrentUser()
  const { addToCart, isAddingToCart } = useAddToCart()

  const stock = product.variant?.stock ?? 0
  const isOutOfStock =
    stockStatusFromCount(stock) === "out_of_stock" || !product.variant

  function handleClick() {
    if (!product.variant) return
    if (!isAuthenticated) {
      navigate(
        `${signInPath()}?next=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }
    addToCart({ variantId: product.variant.id, quantity })
  }

  return (
    <Button
      type="button"
      size={sizeVariant === "sm" ? "sm" : "lg"}
      className={cn(
        sizeVariant === "default" && "flex-1 sm:flex-none sm:px-10",
        className,
      )}
      disabled={isOutOfStock || isAddingToCart}
      onClick={handleClick}
    >
      <ShoppingBag data-icon="inline-start" />
      {isOutOfStock ? "Out of stock" : isAddingToCart ? "Adding…" : "Add to Cart"}
    </Button>
  )
}
