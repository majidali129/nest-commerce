import type { ProductSort } from "@repo/contracts"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
]

interface SortSelectProps {
  value?: ProductSort
  onValueChange?: (value: ProductSort) => void
}

export function SortSelect({
  value = "featured",
  onValueChange,
}: SortSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange?.(next as ProductSort)
      }}
    >
      <SelectTrigger className="w-44" aria-label="Sort products">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
