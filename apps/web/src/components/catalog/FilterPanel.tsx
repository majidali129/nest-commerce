import type { CategoryListItem } from "@repo/contracts"

import { Checkbox } from "#components/ui/checkbox"
import { Label } from "#components/ui/label"
import { Separator } from "#components/ui/separator"
import { Slider } from "#components/ui/slider"
import { formatPrice } from "#lib/format"
import { cn } from "#lib/utils"

export const SHOP_PRICE_MIN = 0
export const SHOP_PRICE_MAX = 15000

interface FilterPanelProps {
  className?: string
  categories: CategoryListItem[]
  categoryId: number | null
  onCategoryChange: (categoryId: number | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
}

export function FilterPanel({
  className,
  categories,
  categoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterPanelProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-medium">Category</h3>
        {categories.map((category) => {
          const checked = categoryId === category.id
          return (
            <Label
              key={category.id}
              className="flex items-center gap-2 text-sm font-normal"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(next) => {
                  onCategoryChange(next ? category.id : null)
                }}
              />
              {category.name}
            </Label>
          )
        })}
      </div>

      <Separator />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Price</h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          min={SHOP_PRICE_MIN}
          max={SHOP_PRICE_MAX}
          step={100}
          value={priceRange}
          onValueChange={(next) => {
            if (Array.isArray(next) && next.length >= 2) {
              onPriceRangeChange([Number(next[0]), Number(next[1])])
            }
          }}
        />
      </div>
    </div>
  )
}
