import { Link } from "react-router"
import { Trash2 } from "lucide-react"

import { Button } from "#components/ui/button"
import { QuantityStepper } from "#components/product/QuantityStepper"
import { formatPrice } from "#lib/format"
import type { CartItem } from "#lib/types"

interface CartLineItemProps {
  item: CartItem
  readOnly?: boolean
}

export function CartLineItem({ item, readOnly = false }: CartLineItemProps) {
  const variantLabel = [item.color, item.size].filter(Boolean).join(" · ")

  return (
    <div className="flex gap-4">
      <Link to={`/products/${item.product_id}`} className="shrink-0">
        <img
          src={item.image_url}
          alt={item.title}
          className="size-20 rounded-lg border object-cover sm:size-24"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/products/${item.product_id}`}
              className="text-sm font-medium hover:underline"
            >
              {item.title}
            </Link>
            {variantLabel && (
              <p className="text-xs text-muted-foreground">{variantLabel}</p>
            )}
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${item.title} from cart`}
            >
              <Trash2 />
            </Button>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {readOnly ? (
            <span className="text-sm text-muted-foreground">
              Qty {item.quantity}
            </span>
          ) : (
            <QuantityStepper value={item.quantity} />
          )}
          <span className="text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
