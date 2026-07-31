import type { CartItem, Order, OrderLineItem, OrderStatus, ShippingInfo } from "#lib/types"

export function generateOrderId(): string {
  return `VG-${Date.now().toString().slice(-4)}`
}

export function buildOrderFromCart(
  orderId: string,
  items: CartItem[],
  shipping: ShippingInfo,
  discount = 0
): Order {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal - discount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const orderItems: OrderLineItem[] = items.map((item) => ({
    id: `line-${orderId}-${item.id}`,
    product_id: item.product_id,
    title: item.title,
    image_url: item.image_url,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
  }))

  const placedAt = new Date().toISOString()
  const estimateDate = new Date()
  estimateDate.setDate(estimateDate.getDate() + 5)

  return {
    id: orderId,
    placed_at: placedAt,
    status: "paid",
    item_count: itemCount,
    subtotal,
    shipping: 0,
    discount,
    total,
    items: orderItems,
    shipping_address: shipping,
    delivery_estimate: `Arriving ${estimateDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    timeline: [
      { status: "paid", label: "Order placed", date: placedAt, completed: true },
      { status: "processing", label: "Processing", date: "", completed: false },
      { status: "shipped", label: "Shipped", date: "", completed: false },
      { status: "delivered", label: "Delivered", date: "", completed: false },
    ],
  }
}

export function formatOrderStatus(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
  }
  return labels[status]
}
