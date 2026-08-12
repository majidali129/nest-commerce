import type {
  OrderItemReturnType,
  OrderListItem,
  OrderReturnType,
  OrderStatus,
} from "@repo/contracts"
import type { CartLineItem } from "@repo/contracts"

export type OrderTimelineStep = {
  status: OrderStatus
  label: string
  date: string
  completed: boolean
}

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order placed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
]

const FLOW_ORDER: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
]

export function formatOrderStatus(status: OrderStatus | string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  }
  return labels[status] ?? status
}

export function buildOrderTimeline(
  order: Pick<OrderReturnType, "status" | "createdAt" | "updatedAt">,
): OrderTimelineStep[] {
  if (order.status === "cancelled" || order.status === "refunded") {
    return [
      {
        status: "pending",
        label: "Order placed",
        date: order.createdAt,
        completed: true,
      },
      {
        status: order.status,
        label: formatOrderStatus(order.status),
        date: order.updatedAt,
        completed: true,
      },
    ]
  }

  const currentIndex = FLOW_ORDER.indexOf(order.status)

  return TIMELINE_STEPS.map((step, index) => {
    const completed = currentIndex >= index
    const isCurrent = step.status === order.status
    return {
      status: step.status,
      label: step.label,
      date: completed
        ? isCurrent
          ? order.updatedAt
          : index === 0
            ? order.createdAt
            : ""
        : "",
      completed,
    }
  })
}

export function orderItemToCartLine(item: OrderItemReturnType): CartLineItem {
  const snap = item.productSnapshot
  return {
    id: item.id,
    variantId: item.variantId,
    productId: item.productId,
    title: snap.name,
    imageUrl: snap.imageUrl ?? null,
    price: item.unitPrice,
    quantity: item.quantity,
    stock: item.quantity,
    sku: snap.sku ?? "",
    color: snap.attributes?.color ?? null,
    size: snap.attributes?.size ?? null,
  }
}

export function orderListSearchText(order: {
  orderNumber: string
  customerName?: string
  customerEmail?: string
}): string {
  return `${order.orderNumber} ${order.customerName ?? ""} ${order.customerEmail ?? ""}`
}

/** Allowed next statuses for admin UI (mirrors API rules). */
export function allowedNextStatuses(current: OrderStatus): OrderStatus[] {
  const map: Record<OrderStatus, OrderStatus[]> = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled", "refunded"],
    shipped: ["delivered", "refunded"],
    delivered: ["refunded"],
    cancelled: [],
    refunded: [],
  }
  return map[current] ?? []
}

export type { OrderListItem }
