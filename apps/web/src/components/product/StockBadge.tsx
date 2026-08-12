import { StockStatusFilter } from "@repo/contracts"

import { Badge } from "#components/ui/badge"

const stockDisplay: Record<
  StockStatusFilter,
  { label: string; variant: "secondary" | "outline" | "destructive" }
> = {
  [StockStatusFilter.IN_STOCK]: { label: "In stock", variant: "secondary" },
  [StockStatusFilter.LOW_STOCK]: { label: "Low stock", variant: "outline" },
  [StockStatusFilter.OUT_OF_STOCK]: {
    label: "Out of stock",
    variant: "destructive",
  },
}

export function StockBadge({ status }: { status: StockStatusFilter }) {
  const { label, variant } = stockDisplay[status]
  return <Badge variant={variant}>{label}</Badge>
}
