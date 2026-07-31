import { useState } from "react"
import { Plus, X } from "lucide-react"

import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"
import type { ProductVariant, StockStatus } from "#lib/types"

const stockOptions: { value: StockStatus; label: string }[] = [
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
]

interface VariantsEditorProps {
  initialVariants?: ProductVariant[]
}

let variantCounter = 0

export function VariantsEditor({ initialVariants = [] }: VariantsEditorProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialVariants.length > 0
      ? initialVariants
      : [{ id: "var-new-0", sku: "", stock_status: "in_stock" }]
  )

  const addVariant = () => {
    variantCounter += 1
    setVariants((prev) => [
      ...prev,
      {
        id: `var-new-${variantCounter}`,
        sku: "",
        stock_status: "in_stock",
      },
    ])
  }

  const removeVariant = (id: string) => {
    setVariants((prev) =>
      prev.length > 1 ? prev.filter((variant) => variant.id !== id) : prev
    )
  }

  const updateVariant = (id: string, patch: Partial<ProductVariant>) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, ...patch } : variant
      )
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden grid-cols-[1fr_1fr_1.2fr_1fr_0.8fr_2rem] gap-2 text-xs font-medium text-muted-foreground lg:grid">
        <span>Color</span>
        <span>Size</span>
        <span>SKU</span>
        <span>Stock</span>
        <span>Price override</span>
        <span />
      </div>
      {variants.map((variant) => (
        <div
          key={variant.id}
          className="grid grid-cols-2 gap-2 rounded-lg border p-3 lg:grid-cols-[1fr_1fr_1.2fr_1fr_0.8fr_2rem] lg:border-0 lg:p-0"
        >
          <Input
            value={variant.color ?? ""}
            onChange={(event) =>
              updateVariant(variant.id, { color: event.target.value })
            }
            placeholder="Color"
            aria-label="Variant color"
          />
          <Input
            value={variant.size ?? ""}
            onChange={(event) =>
              updateVariant(variant.id, { size: event.target.value })
            }
            placeholder="Size"
            aria-label="Variant size"
          />
          <Input
            required
            value={variant.sku}
            onChange={(event) =>
              updateVariant(variant.id, { sku: event.target.value })
            }
            placeholder="SKU"
            aria-label="Variant SKU"
          />
          <Select
            value={variant.stock_status}
            onValueChange={(value) =>
              updateVariant(variant.id, {
                stock_status: (value ?? "in_stock") as StockStatus,
              })
            }
          >
            <SelectTrigger aria-label="Variant stock status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {stockOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={variant.price ?? ""}
            onChange={(event) =>
              updateVariant(variant.id, {
                price:
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
              })
            }
            placeholder="—"
            aria-label="Variant price override"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove variant"
            onClick={() => removeVariant(variant.id)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
        >
          <Plus className="size-4" />
          Add variant
        </Button>
      </div>
    </div>
  )
}
