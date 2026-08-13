import { Link, useParams } from "react-router"
import { UserRoundX } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { CustomerDetailView } from "#components/admin/CustomerDetailView"
import { EmptyState } from "#components/catalog/EmptyState"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { Button } from "#components/ui/button"
import { getCustomerById } from "#lib/mock-data"

export function CustomerDetailPage() {
  const { customerId = "" } = useParams()
  const customer = getCustomerById(customerId)

  if (!customer) {
    return (
      <EmptyState
        icon={UserRoundX}
        title="Customer not found"
        description="This customer may not exist."
        action={
          <Button render={<Link to="/admin/customers" />}>
            Back to customers
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumb
        items={[
          { label: "Admin", to: "/admin" },
          { label: "Customers", to: "/admin/customers" },
          { label: customer.name },
        ]}
      />
      <AdminPageHeader title={customer.name} />
      <CustomerDetailView customer={customer} />
    </div>
  )
}
