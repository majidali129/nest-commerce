import { SlidersHorizontal } from "lucide-react"
import type { CategoryListItem } from "@repo/contracts"

import { Button } from "#components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#components/ui/sheet"
import { FilterPanel } from "#components/catalog/FilterPanel"

interface FilterSheetProps {
  categories: CategoryListItem[]
  categoryId: number | null
  onCategoryChange: (categoryId: number | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
}

export function FilterSheet({
  categories,
  categoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <SlidersHorizontal data-icon="inline-start" />
        Filters
      </SheetTrigger>
      <SheetContent side="left" className="w-80 gap-0">
        <SheetHeader className="border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <FilterPanel
            categories={categories}
            categoryId={categoryId}
            onCategoryChange={onCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
