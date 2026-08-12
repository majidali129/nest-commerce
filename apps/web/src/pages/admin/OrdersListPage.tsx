import { useNavigate } from "react-router"
import { Eye } from "lucide-react"
import type { AdminOrderListItem, OrderStatus } from "@repo/contracts"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "#components/admin/DataTable"
import { StatusBadge } from "#components/admin/StatusBadge"
import { useAdminOrders } from "#components/orders/hooks/use-orders"
import { Button } from "#components/ui/button"
import { Skeleton } from "#components/ui/skeleton"
import { formatDate, formatPrice } from "#lib/format"
import { formatOrderStatus } from "#lib/order-utils"

const columns: DataTableColumn<AdminOrderListItem>[] = [
  {
    key: "orderNumber",
    header: "Order",
    sortValue: (order) => order.orderNumber,
    cell: (order) => (
      <span className="font-medium">{order.orderNumber}</span>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    sortValue: (order) => order.customerName.toLowerCase(),
    cell: (order) => (
      <div>
        <p className="font-medium">{order.customerName}</p>
        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortValue: (order) => order.createdAt,
    cell: (order) => formatDate(order.createdAt),
  },
  {
    key: "items",
    header: "Items",
    sortValue: (order) => order.itemCount,
    cell: (order) => order.itemCount,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (order) => order.status,
    cell: (order) => <StatusBadge kind="order" status={order.status} />,
  },
  {
    key: "total",
    header: "Total",
    sortValue: (order) => order.totalAmount,
    cell: (order) => formatPrice(order.totalAmount),
  },
]

const statusOptions = (
  [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ] as OrderStatus[]
).map((status) => ({ value: status, label: formatOrderStatus(status) }))

export function OrdersListPage() {
  const navigate = useNavigate()
  const { orders, isLoadingOrders, isOrdersError, ordersError } =
    useAdminOrders()

  const filters: DataTableFilter<AdminOrderListItem>[] = [
    {
      key: "status",
      label: "statuses",
      options: statusOptions,
      match: (order, value) => order.status === value,
    },
  ]

  if (isLoadingOrders) {
    return (
      <div>
        <AdminPageHeader
          title="Orders"
          description="Loading orders…"
        />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full max-w-sm" />
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (isOrdersError) {
    return (
      <div>
        <AdminPageHeader title="Orders" description="Could not load orders." />
        <p className="text-sm text-destructive">
          {ordersError?.message ?? "Failed to load orders."}
        </p>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description={`${orders.length} orders to review and fulfill.`}
      />
      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Search by order or customer…"
        searchText={(order) =>
          `${order.orderNumber} ${order.customerName} ${order.customerEmail}`
        }
        filters={filters}
        pageSize={8}
        emptyTitle="No orders found"
        onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
        rowActions={(order) => (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`View ${order.orderNumber}`}
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            <Eye className="size-4" />
          </Button>
        )}
      />
    </div>
  )
}
