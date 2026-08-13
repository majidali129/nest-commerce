import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Eye, PackageOpen, Pencil, Plus, Trash2 } from "lucide-react"
import {
  PublicationStatus,
  type ProductListItem,
  type ProductSort,
} from "@repo/contracts"
import { useQuery } from "@tanstack/react-query"

import { AdminDetailDialog } from "#components/admin/AdminDetailDialog"
import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ConfirmDialog } from "#components/admin/ConfirmDialog"
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "#components/admin/DataTable"
import { ProductDetailView } from "#components/admin/ProductDetailView"
import { EmptyState } from "#components/catalog/EmptyState"
import { useCategories } from "#components/category/hooks/use-categories"
import { useDeleteProduct } from "#components/product/hooks/use-product-mutations"
import { useProducts } from "#components/product/hooks/use-products"
import { Badge } from "#components/ui/badge"
import { Button } from "#components/ui/button"
import { Skeleton } from "#components/ui/skeleton"
import { useDebouncedValue } from "#hooks/use-debounced-value"
import { formatPrice } from "#lib/format"
import { productsApi } from "#api/services/products"
import type { ApiError } from "#api/client"
import { queryKeys } from "../../query-keys"

const PAGE_SIZE = 8
const ALL = "__all__"

const stockLabels = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
} as const

function stockFilterFromCount(stock: number): keyof typeof stockLabels {
  if (stock <= 0) return "out_of_stock"
  if (stock <= 5) return "low_stock"
  return "in_stock"
}

function stockBadgeVariant(
  status: keyof typeof stockLabels,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "out_of_stock") return "destructive"
  if (status === "low_stock") return "outline"
  return "secondary"
}

const sortMap: Record<string, { asc: ProductSort; desc: ProductSort }> = {
  name: { asc: "name-asc", desc: "name-desc" },
  price: { asc: "price-asc", desc: "price-desc" },
  stock: { asc: "stock-asc", desc: "stock-desc" },
}

function AdminListSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full max-w-sm" />
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  )
}

export function ProductsListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 300)
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState<string | null>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [detailProductId, setDetailProductId] = useState<number | null>(null)

  const { deleteProduct, isDeletingProduct, deletingProductId } =
    useDeleteProduct()

  const categoryFilter = filterValues.category

  const sort: ProductSort =
    sortKey && sortMap[sortKey] ? sortMap[sortKey][sortDirection] : "newest"

  const {
    products,
    meta,
    isLoadingProducts,
    isProductsError,
    productsError,
  } = useProducts({
    q: debouncedSearch || undefined,
    categoryId:
      categoryFilter && categoryFilter !== ALL
        ? Number(categoryFilter)
        : undefined,
    sort,
    page,
    limit: PAGE_SIZE,
  })

  const {
    categories,
    isLoadingCategories,
    isCategoriesError,
    categoriesError,
  } = useCategories({ page: 1, limit: 100, sort: "name-asc" })

  const detailQuery = useQuery({
    queryKey: queryKeys.shop.products.detail(String(detailProductId ?? "")),
    queryFn: () => productsApi.getById(detailProductId!),
    enabled: detailProductId != null,
  })

  const isLoading = isLoadingProducts || isLoadingCategories
  const isError = isProductsError || isCategoriesError
  const errorMessage =
    productsError?.message ?? categoriesError?.message ?? "Please try again."

  const columns: DataTableColumn<ProductListItem>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Product",
        sortable: true,
        cell: (product) => (
          <div className="flex items-center gap-3">
            <img
              src={
                product.variant?.media?.url ??
                `https://picsum.photos/seed/${product.slug}/80/80`
              }
              alt={product.variant?.media?.altText ?? product.name}
              className="size-10 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.variant?.sku || "—"}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        cell: (product) => product.category.name,
      },
      {
        key: "price",
        header: "Price",
        sortable: true,
        cell: (product) => {
          const price = product.variant?.price ?? 0
          const discount = product.variant?.discountPercentage ?? 0
          const compareAt =
            discount > 0 ? Math.round(price / (1 - discount / 100)) : null

          return (
            <div className="flex flex-col gap-0.5">
              <span>{formatPrice(price)}</span>
              {compareAt != null && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(compareAt)}
                </span>
              )}
            </div>
          )
        },
      },
      {
        key: "discount",
        header: "Discount",
        cell: (product) => {
          const discount = product.variant?.discountPercentage ?? 0
          return discount > 0 ? (
            <Badge variant="destructive">-{discount}%</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      },
      {
        key: "stock",
        header: "Stock",
        sortable: true,
        cell: (product) => {
          const stock = product.variant?.stock ?? 0
          const status = stockFilterFromCount(stock)
          return (
            <Badge variant={stockBadgeVariant(status)}>
              {stockLabels[status]}
              {stock > 0 ? ` (${stock})` : ""}
            </Badge>
          )
        },
      },
      {
        key: "published",
        header: "Status",
        cell: (product) => (
          <Badge
            variant={
              product.publicationStatus === PublicationStatus.PUBLISHED
                ? "secondary"
                : "outline"
            }
          >
            {product.publicationStatus === PublicationStatus.PUBLISHED
              ? "Published"
              : product.publicationStatus === PublicationStatus.DRAFT
                ? "Draft"
                : "Archived"}
          </Badge>
        ),
      },
    ],
    [],
  )

  const filters: DataTableFilter<ProductListItem>[] = useMemo(
    () => [
      {
        key: "category",
        label: "categories",
        options: categories.map((category) => ({
          value: String(category.id),
          label: category.name,
        })),
      },
    ],
    [categories],
  )

  const openDetails = (product: ProductListItem) => {
    setDetailProductId(product.id)
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={
          isLoading
            ? "Loading catalog…"
            : `${meta.total} products in your catalog.`
        }
        action={
          <Button render={<Link to="/admin/products/new" />}>
            <Plus className="size-4" />
            New product
          </Button>
        }
      />

      {isLoading && products.length === 0 ? (
        <AdminListSkeleton />
      ) : isError && products.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="Couldn’t load products"
          description={errorMessage}
        />
      ) : (
        <DataTable
          manual
          data={products}
          columns={columns}
          searchPlaceholder="Search by title or SKU…"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={(key, value) => {
            setFilterValues((prev) => ({ ...prev, [key]: value }))
            setPage(1)
          }}
          page={meta.page}
          pageCount={meta.totalPages}
          onPageChange={setPage}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={(key) => {
            if (!sortMap[key]) return
            if (sortKey === key) {
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            } else {
              setSortKey(key)
              setSortDirection("asc")
            }
            setPage(1)
          }}
          getRowId={(product) => product.id}
          emptyTitle="No products found"
          emptyDescription="Create a product or adjust your filters."
          onRowClick={openDetails}
          rowActions={(product) => {
            const confirmingThis =
              isDeletingProduct && deletingProductId === product.id

            return (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${product.name}`}
                  onClick={() => openDetails(product)}
                >
                  <Eye className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${product.name}`}
                  disabled={isDeletingProduct}
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                >
                  <Pencil className="size-4" />
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      disabled={isDeletingProduct}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  }
                  title={`Delete ${product.name}?`}
                  description="This soft-deletes the product and its variants. The category product count will be updated."
                  confirmLabel="Delete product"
                  cancelLabel="Cancel"
                  isConfirming={confirmingThis}
                  onConfirm={() => deleteProduct(product.id)}
                />
              </>
            )
          }}
        />
      )}

      <AdminDetailDialog
        open={detailProductId != null}
        onOpenChange={(open) => {
          if (!open) setDetailProductId(null)
        }}
        title={detailQuery.data?.name ?? "Product details"}
        description="Full product and variant information."
        size="xl"
        footer={
          detailProductId != null ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const id = detailProductId
                setDetailProductId(null)
                navigate(`/admin/products/${id}/edit`)
              }}
            >
              Edit product
            </Button>
          ) : null
        }
      >
        <ProductDetailView
          product={detailQuery.data ?? null}
          isLoading={detailQuery.isPending || detailQuery.isFetching}
          errorMessage={
            detailQuery.isError
              ? ((detailQuery.error as ApiError | null)?.message ??
                "Failed to load product")
              : null
          }
        />
      </AdminDetailDialog>
    </div>
  )
}
