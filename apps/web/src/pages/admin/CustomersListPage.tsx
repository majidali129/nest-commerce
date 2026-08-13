import { useNavigate } from "react-router"
import { Eye } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import {
  DataTable,
  type DataTableColumn,
} from "#components/admin/DataTable"
import { Avatar, AvatarFallback } from "#components/ui/avatar"
import { Button } from "#components/ui/button"
import { formatDate, formatPrice } from "#lib/format"
import { getCustomers } from "#lib/mock-data"
import type { Customer } from "#lib/types"

const columns: DataTableColumn<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    sortValue: (customer) => customer.name.toLowerCase(),
    cell: (customer) => {
      const initials = customer.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{customer.name}</p>
            <p className="text-xs text-muted-foreground">{customer.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    key: "country",
    header: "Country",
    sortValue: (customer) => customer.addresses[0]?.country ?? "",
    cell: (customer) => customer.addresses[0]?.country ?? "—",
  },
  {
    key: "joined",
    header: "Joined",
    sortValue: (customer) => customer.created_at,
    cell: (customer) => formatDate(customer.created_at),
  },
  {
    key: "orders",
    header: "Orders",
    sortValue: (customer) => customer.order_count,
    cell: (customer) => customer.order_count,
  },
  {
    key: "total_spent",
    header: "Total spent",
    sortValue: (customer) => customer.total_spent,
    cell: (customer) => formatPrice(customer.total_spent),
  },
]

export function CustomersListPage() {
  const navigate = useNavigate()
  const customers = getCustomers()

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description={`${customers.length} registered customers.`}
      />
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search by name or email…"
        searchText={(customer) => `${customer.name} ${customer.email}`}
        pageSize={8}
        emptyTitle="No customers found"
        onRowClick={(customer) => navigate(`/admin/customers/${customer.id}`)}
        rowActions={(customer) => (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`View ${customer.name}`}
            onClick={() => navigate(`/admin/customers/${customer.id}`)}
          >
            <Eye className="size-4" />
          </Button>
        )}
      />
    </div>
  )
}
