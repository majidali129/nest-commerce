import { Badge } from "#components/ui/badge"
import { formatOrderStatus } from "#lib/order-utils"

type StatusKind = "order" | "payment" | "fulfillment"

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

const statusVariants: Record<StatusKind, Record<string, BadgeVariant>> = {
  order: {
    pending: "outline",
    processing: "outline",
    shipped: "default",
    delivered: "secondary",
    cancelled: "destructive",
    refunded: "destructive",
  },
  payment: {
    pending: "outline",
    succeeded: "secondary",
    paid: "secondary",
    refunded: "destructive",
    failed: "destructive",
    cancelled: "destructive",
  },
  fulfillment: {
    unfulfilled: "outline",
    partial: "secondary",
    fulfilled: "secondary",
    pending: "outline",
    processing: "outline",
    shipped: "default",
    delivered: "secondary",
    cancelled: "destructive",
    refunded: "destructive",
  },
}

interface StatusBadgeProps {
  kind: StatusKind
  status: string
  label?: string
}

export function StatusBadge({ kind, status, label }: StatusBadgeProps) {
  const variant = statusVariants[kind][status] ?? "outline"
  const text =
    label ??
    (kind === "order"
      ? formatOrderStatus(status)
      : status
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "))

  return <Badge variant={variant}>{text}</Badge>
}
