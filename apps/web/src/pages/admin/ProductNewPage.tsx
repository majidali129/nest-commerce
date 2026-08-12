import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ProductForm } from "#components/admin/ProductForm"

export function ProductNewPage() {
  return (
    <div>
      <AdminPageHeader
        title="New product"
        description="Step 1: create the product. Step 2: add variants with images."
      />
      <ProductForm />
    </div>
  )
}
