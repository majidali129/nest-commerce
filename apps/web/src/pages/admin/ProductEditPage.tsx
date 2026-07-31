import { Link } from "react-router"
import { PackageSearch } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ProductForm } from "#components/admin/ProductForm"
import { EmptyState } from "#components/catalog/EmptyState"
import { Button } from "#components/ui/button"
import { getAllProducts } from "#lib/mock-data"

export function ProductEditPage() {
  const product = getAllProducts().find((item) => item.id === 'prod-001')

  if (!product) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Product not found"
        description="This product may have been removed."
        action={
          <Button render={<Link to="/admin/products" />}>
            Back to products
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <AdminPageHeader
        title={`Edit ${product.title}`}
        description="Update product details, variants, and images."
      />
      <ProductForm product={product} />
    </div>
  )
}
