import { Badge } from "#components/ui/badge"
import { formatOrderStatus } from "#lib/order-utils"

type StatusKind = "order" | "payment" | "fulfillment"

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

const statusVariants: Record<StatusKind, Record<string, BadgeVariant>> = {
  order: {
    paid: "secondary",
    processing: "outline",
    shipped: "default",
    delivered: "secondary",
  },
  payment: {
    paid: "secondary",
    pending: "outline",
    refunded: "destructive",
    failed: "destructive",
  },
  fulfillment: {
    unfulfilled: "outline",
    partial: "secondary",
    fulfilled: "secondary",
    shipped: "default",
    delivered: "secondary",
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
    (status in statusVariants.order && kind === "order"
      ? formatOrderStatus(status as Parameters<typeof formatOrderStatus>[0])
      : status.charAt(0).toUpperCase() + status.slice(1))

  return <Badge variant={variant}>{text}</Badge>
}
