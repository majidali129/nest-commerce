import { Link, useParams } from "react-router"
import { PackageSearch } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { ProductDetailsReturnType } from "@repo/contracts"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ProductEditForm } from "#components/admin/ProductEditForm"
import { EmptyState } from "#components/catalog/EmptyState"
import { Button } from "#components/ui/button"
import { Skeleton } from "#components/ui/skeleton"
import { productsApi } from "#api/services/products"
import type { ApiError } from "#api/client"
import { normalizeProductDetails } from "#lib/mappers/product"
import { queryKeys } from "../../query-keys"

export function ProductEditPage() {
  const { productId = "" } = useParams()
  const numericId = Number(productId)
  const canFetch = Number.isFinite(numericId) && numericId > 0

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useQuery<ProductDetailsReturnType, ApiError>({
    queryKey: queryKeys.shop.products.detail(String(productId)),
    queryFn: async () => {
      const raw = await productsApi.getById(numericId)
      return normalizeProductDetails(raw)
    },
    enabled: canFetch,
  })

  if (!canFetch) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Invalid product"
        description="This product id is not valid."
        action={
          <Button render={<Link to="/admin/products" />}>
            Back to products
          </Button>
        }
      />
    )
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Product not found"
        description={
          error?.message ?? "This product may have been removed."
        }
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
        title={`Edit ${product.name}`}
        description="Update product details and manage variants."
      />
      <ProductEditForm product={product} />
    </div>
  )
}
