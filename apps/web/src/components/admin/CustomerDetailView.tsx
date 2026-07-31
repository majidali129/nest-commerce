import { Link } from "react-router"

import { StatusBadge } from "#components/admin/StatusBadge"
import { Avatar, AvatarFallback } from "#components/ui/avatar"
import { Badge } from "#components/ui/badge"
import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table"
import { formatDate, formatPrice } from "#lib/format"
import { getOrders } from "#lib/mock-data"
import type { Customer } from "#lib/types"

interface CustomerDetailViewProps {
  customer: Customer
}

export function CustomerDetailView({ customer }: CustomerDetailViewProps) {
  const initials = customer.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const customerOrders = getOrders().filter(
    (order) => order.shipping_address.email === customer.email
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            {customer.phone && (
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            )}
          </div>
          <div className="ml-auto flex gap-6 text-sm">
            <div className="text-right">
              <p className="text-muted-foreground">Orders</p>
              <p className="text-lg font-semibold">{customer.order_count}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total spent</p>
              <p className="text-lg font-semibold">
                {formatPrice(customer.total_spent)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Saved addresses</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {customer.addresses.map((address) => (
              <div key={address.id} className="rounded-lg border p-3 text-sm">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{address.label}</span>
                  <Badge variant="outline">{address.country}</Badge>
                </div>
                <address className="not-italic text-muted-foreground">
                  <p>{address.full_name}</p>
                  <p>
                    {address.city}
                    {address.state ? `, ${address.state}` : ""}{" "}
                    {address.zip_code}
                  </p>
                </address>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order history</CardTitle>
          </CardHeader>
          <CardContent>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No orders found for this customer in the demo data.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{formatDate(order.placed_at)}</TableCell>
                      <TableCell>
                        <StatusBadge kind="order" status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={<Link to={`/admin/orders/${order.id}`} />}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
