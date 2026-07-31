import { Badge } from "#components/ui/badge"
import type { StockStatus } from "#lib/types"

const stockDisplay: Record<
  StockStatus,
  { label: string; variant: "secondary" | "outline" | "destructive" }
> = {
  in_stock: { label: "In stock", variant: "secondary" },
  low_stock: { label: "Low stock", variant: "outline" },
  out_of_stock: { label: "Out of stock", variant: "destructive" },
}

export function StockBadge({ status }: { status: StockStatus }) {
  const { label, variant } = stockDisplay[status]
  return <Badge variant={variant}>{label}</Badge>
}
