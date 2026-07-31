import { Link } from "react-router"
import { useNavigate } from "react-router"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ConfirmDialog } from "#components/admin/ConfirmDialog"
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "#components/admin/DataTable"
import { Badge } from "#components/ui/badge"
import { Button } from "#components/ui/button"
import { formatPrice } from "#lib/format"
import { categories, getAllProducts } from "#lib/mock-data"
import type { Product, StockStatus } from "#lib/types"

const stockLabels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
}

const stockVariants: Record<
  StockStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  in_stock: "secondary",
  low_stock: "outline",
  out_of_stock: "destructive",
}

const categoryName = (id: string) =>
  categories.find((category) => category.id === id)?.name ?? id

const columns: DataTableColumn<Product>[] = [
  {
    key: "title",
    header: "Product",
    sortValue: (product) => product.title.toLowerCase(),
    cell: (product) => (
      <div className="flex items-center gap-3">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt ?? product.title}
          className="size-10 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-medium">{product.title}</p>
          <p className="text-xs text-muted-foreground">{product.sku}</p>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortValue: (product) => categoryName(product.category_id),
    cell: (product) => categoryName(product.category_id),
  },
  {
    key: "price",
    header: "Price",
    sortValue: (product) => product.price,
    cell: (product) => (
      <div className="flex flex-col gap-0.5">
        <span>{formatPrice(product.price)}</span>
        {product.compare_at_price !== undefined &&
          product.compare_at_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
      </div>
    ),
  },
  {
    key: "discount",
    header: "Discount",
    sortValue: (product) => product.discount_percent ?? 0,
    cell: (product) =>
      product.discount_percent && product.discount_percent > 0 ? (
        <Badge variant="destructive">-{product.discount_percent}%</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "stock",
    header: "Stock",
    sortValue: (product) => product.stock_status,
    cell: (product) => (
      <Badge variant={stockVariants[product.stock_status]}>
        {stockLabels[product.stock_status]}
      </Badge>
    ),
  },
  {
    key: "published",
    header: "Status",
    sortValue: (product) => product.is_published.toString(),
    cell: (product) => (
      <Badge variant={product.is_published ? "secondary" : "outline"}>
        {product.is_published ? "Published" : "Draft"}
      </Badge>
    ),
  },
]

export function ProductsListPage() {
  const navigate = useNavigate()
  const products = getAllProducts()

  const filters: DataTableFilter<Product>[] = [
    {
      key: "category",
      label: "categories",
      options: categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
      match: (product, value) => product.category_id === value,
    },
    {
      key: "stock",
      label: "stock statuses",
      options: Object.entries(stockLabels).map(([value, label]) => ({
        value,
        label,
      })),
      match: (product, value) => product.stock_status === value,
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in your catalog.`}
        action={
          <Button render={<Link to="/admin/products/new" />}>
            <Plus className="size-4" />
            New product
          </Button>
        }
      />
      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search by title or SKU…"
        searchText={(product) => `${product.title} ${product.sku}`}
        filters={filters}
        pageSize={8}
        emptyTitle="No products found"
        rowActions={(product) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${product.title}`}
              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            >
              <Pencil className="size-4" />
            </Button>
            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${product.title}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              }
              title={`Delete ${product.title}?`}
              description="This is a demo — the product will not actually be removed."
              onConfirm={() =>
                toast.success(`${product.title} deleted (demo)`)
              }
            />
          </>
        )}
      />
    </div>
  )
}
