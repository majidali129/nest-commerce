import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ProductForm } from "#components/admin/ProductForm"

export function ProductNewPage() {
  return (
    <div>
      <AdminPageHeader
        title="New product"
        description="Add a product to your catalog."
      />
      <ProductForm />
    </div>
  )
}
