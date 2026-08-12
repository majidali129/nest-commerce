import { Link } from "react-router"
import { Trash2 } from "lucide-react"
import type { CartLineItem as CartLineItemType } from "@repo/contracts"

import { Button } from "#components/ui/button"
import { Checkbox } from "#components/ui/checkbox"
import { QuantityStepper } from "#components/product/QuantityStepper"
import { formatPrice } from "#lib/format"

interface CartLineItemProps {
  item: CartLineItemType
  readOnly?: boolean
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
}

export function CartLineItem({
  item,
  readOnly = false,
  selected,
  onSelectedChange,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const variantLabel = [item.color, item.size].filter(Boolean).join(" · ")
  const selectable = !readOnly && onSelectedChange != null

  return (
    <div className="flex gap-3 sm:gap-4">
      {selectable ? (
        <div className="flex items-start pt-1">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectedChange(checked === true)}
            aria-label={`Select ${item.title}`}
          />
        </div>
      ) : null}
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <img
          src={item.imageUrl ?? undefined}
          alt={item.title}
          className="size-20 rounded-lg border bg-muted object-cover sm:size-24"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/products/${item.productId}`}
              className="text-sm font-medium hover:underline"
            >
              {item.title}
            </Link>
            {variantLabel ? (
              <p className="text-xs text-muted-foreground">{variantLabel}</p>
            ) : null}
          </div>
          {!readOnly && onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${item.title} from cart`}
              onClick={onRemove}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {readOnly ? (
            <span className="text-sm text-muted-foreground">
              Qty {item.quantity}
            </span>
          ) : (
            <QuantityStepper
              value={item.quantity}
              onChange={onQuantityChange}
              min={1}
              max={Math.max(1, item.stock)}
            />
          )}
          <span className="text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
