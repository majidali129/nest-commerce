import { Checkbox } from "#components/ui/checkbox"
import { Label } from "#components/ui/label"
import { Separator } from "#components/ui/separator"
import { Slider } from "#components/ui/slider"
import { formatPrice } from "#lib/format"
import { categories, products } from "#lib/mock-data"
import { cn } from "#lib/utils"

const PRICE_MIN = 0
const PRICE_MAX = 200

const brands = [...new Set(products.map((p) => p.brand))].sort()
const sizes = [...new Set(products.flatMap((p) => p.sizes))]
const colors = [...new Set(products.flatMap((p) => p.colors))].sort()

interface FilterPanelProps {
  className?: string
}

export function FilterPanel({ className }: FilterPanelProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-medium">Category</h3>
        {categories.map((category) => (
          <Label
            key={category.id}
            className="flex items-center gap-2 text-sm font-normal"
          >
            <Checkbox />
            {category.name}
          </Label>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Price</h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatPrice(PRICE_MIN)} – {formatPrice(PRICE_MAX)}
          </span>
        </div>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5}
          defaultValue={[PRICE_MIN, PRICE_MAX]}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-medium">Brand</h3>
        {brands.map((brand) => (
          <Label
            key={brand}
            className="flex items-center gap-2 text-sm font-normal"
          >
            <Checkbox />
            {brand}
          </Label>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-medium">Size</h3>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className="rounded-lg border px-2.5 py-1 text-xs text-muted-foreground"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-medium">Color</h3>
        {colors.map((color) => (
          <Label
            key={color}
            className="flex items-center gap-2 text-sm font-normal"
          >
            <Checkbox />
            {color}
          </Label>
        ))}
      </div>
    </div>
  )
}
