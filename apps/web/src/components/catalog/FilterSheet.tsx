import { SlidersHorizontal } from "lucide-react"

import { Button } from "#components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#components/ui/sheet"
import { FilterPanel } from "#components/catalog/FilterPanel"

export function FilterSheet() {
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
          <FilterPanel />
        </div>
      </SheetContent>
    </Sheet>
  )
}
