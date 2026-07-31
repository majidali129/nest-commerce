import { Link, useNavigate } from "react-router"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { ConfirmDialog } from "#components/admin/ConfirmDialog"
import {
  DataTable,
  type DataTableColumn,
} from "#components/admin/DataTable"
import { Button } from "#components/ui/button"
import { categories } from "#lib/mock-data"
import type { Category } from "#lib/types"

const columns: DataTableColumn<Category>[] = [
  {
    key: "name",
    header: "Category",
    sortValue: (category) => category.name.toLowerCase(),
    cell: (category) => (
      <div className="flex items-center gap-3">
        <img
          src={category.image_url}
          alt={category.name}
          className="size-10 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    cell: (category) => (
      <span className="line-clamp-1 max-w-md text-muted-foreground">
        {category.description ?? "—"}
      </span>
    ),
  },
  {
    key: "product_count",
    header: "Products",
    sortValue: (category) => category.product_count,
    cell: (category) => category.product_count,
  },
]

export function CategoriesListPage() {
  const navigate = useNavigate()

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} categories in your catalog.`}
        action={
          <Button render={<Link to="/admin/categories/new" />}>
            <Plus className="size-4" />
            New category
          </Button>
        }
      />
      <DataTable
        data={categories}
        columns={columns}
        searchPlaceholder="Search categories…"
        searchText={(category) => `${category.name} ${category.slug}`}
        pageSize={8}
        emptyTitle="No categories found"
        rowActions={(category) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${category.name}`}
              onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
            >
              <Pencil className="size-4" />
            </Button>
            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              }
              title={`Delete ${category.name}?`}
              description="This is a demo — the category will not actually be removed."
              onConfirm={() =>
                toast.success(`${category.name} deleted (demo)`)
              }
            />
          </>
        )}
      />
    </div>
  )
}
