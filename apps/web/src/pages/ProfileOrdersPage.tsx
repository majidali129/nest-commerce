import { OrderCard } from "#components/order/OrderCard"
import { useOrders } from "#components/orders/hooks/use-orders"
import { Skeleton } from "#components/ui/skeleton"

export function ProfileOrdersPage() {
  const { orders, isLoadingOrders, isOrdersError, ordersError } = useOrders()

  if (isLoadingOrders) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (isOrdersError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-destructive">
          {ordersError?.message ?? "Failed to load orders."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} on your
          account.
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
