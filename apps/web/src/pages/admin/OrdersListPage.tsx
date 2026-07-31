import { useNavigate } from "react-router"
import { Eye } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "#components/admin/DataTable"
import { StatusBadge } from "#components/admin/StatusBadge"
import { Button } from "#components/ui/button"
import { formatDate, formatPrice } from "#lib/format"
import { getOrders } from "#lib/mock-data"
import { formatOrderStatus } from "#lib/order-utils"
import type { Order, OrderStatus } from "#lib/types"

const columns: DataTableColumn<Order>[] = [
  {
    key: "id",
    header: "Order",
    sortValue: (order) => order.id,
    cell: (order) => <span className="font-medium">{order.id}</span>,
  },
  {
    key: "customer",
    header: "Customer",
    sortValue: (order) => order.shipping_address.full_name.toLowerCase(),
    cell: (order) => (
      <div>
        <p className="font-medium">{order.shipping_address.full_name}</p>
        <p className="text-xs text-muted-foreground">
          {order.shipping_address.email}
        </p>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortValue: (order) => order.placed_at,
    cell: (order) => formatDate(order.placed_at),
  },
  {
    key: "items",
    header: "Items",
    sortValue: (order) => order.item_count,
    cell: (order) => order.item_count,
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
    sortValue: (order) => order.total,
    cell: (order) => formatPrice(order.total),
  },
]

const statusOptions = (["paid", "processing", "shipped", "delivered"] as OrderStatus[]).map(
  (status) => ({ value: status, label: formatOrderStatus(status) })
)

export function OrdersListPage() {
  const navigate = useNavigate()
  const orders = getOrders()

  const filters: DataTableFilter<Order>[] = [
    {
      key: "status",
      label: "statuses",
      options: statusOptions,
      match: (order, value) => order.status === value,
    },
  ]

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
          `${order.id} ${order.shipping_address.full_name} ${order.shipping_address.email}`
        }
        filters={filters}
        pageSize={8}
        emptyTitle="No orders found"
        rowActions={(order) => (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`View ${order.id}`}
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            <Eye className="size-4" />
          </Button>
        )}
      />
    </div>
  )
}
