import { OrderCard } from "#components/order/OrderCard"
import { getOrders } from "#lib/mock-data"

const orders = getOrders()

export function ProfileOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          {orders.length} orders on your account.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
