import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Eye, PackageOpen, Pencil, Plus, Trash2 } from "lucide-react"
import type { CategoryListItem, CategorySort } from "@repo/contracts"

import { AdminDetailDialog } from "#components/admin/AdminDetailDialog"
import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { CategoryDetailView } from "#components/admin/CategoryDetailView"
import { ConfirmDialog } from "#components/admin/ConfirmDialog"
import {
  DataTable,
  type DataTableColumn,
} from "#components/admin/DataTable"
import { EmptyState } from "#components/catalog/EmptyState"
import { useCategories } from "#components/category/hooks/use-categories"
import { useDeleteCategory } from "#components/category/hooks/use-category-mutations"
import { Button } from "#components/ui/button"
import { Skeleton } from "#components/ui/skeleton"
import { useDebouncedValue } from "#hooks/use-debounced-value"

const PAGE_SIZE = 8

const sortMap: Record<string, { asc: CategorySort; desc: CategorySort }> = {
  name: { asc: "name-asc", desc: "name-desc" },
  productsCount: { asc: "products-asc", desc: "products-desc" },
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

export function CategoriesListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 300)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [detailCategory, setDetailCategory] =
    useState<CategoryListItem | null>(null)

  const { deleteCategory, isDeletingCategory, deletingCategoryId } =
    useDeleteCategory()

  const sort: CategorySort =
    sortKey && sortMap[sortKey] ? sortMap[sortKey][sortDirection] : "newest"

  const {
    categories,
    meta,
    isLoadingCategories,
    isCategoriesError,
    categoriesError,
  } = useCategories({
    q: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
    sort,
  })

  const columns: DataTableColumn<CategoryListItem>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Category",
        sortable: true,
        cell: (category) => (
          <div className="flex items-center gap-3">
            <img
              src={
                category.imageUrl ||
                `https://picsum.photos/seed/cat-${category.slug}/80/80`
              }
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
            {category.description || "—"}
          </span>
        ),
      },
      {
        key: "productsCount",
        header: "Products",
        sortable: true,
        cell: (category) => category.productsCount,
      },
    ],
    [],
  )

  const openDetails = (category: CategoryListItem) => {
    setDetailCategory(category)
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description={
          isLoadingCategories
            ? "Loading categories…"
            : `${meta.total} categories in your catalog.`
        }
        action={
          <Button render={<Link to="/admin/categories/new" />}>
            <Plus className="size-4" />
            New category
          </Button>
        }
      />

      {isLoadingCategories && categories.length === 0 ? (
        <AdminListSkeleton />
      ) : isCategoriesError && categories.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="Couldn’t load categories"
          description={
            categoriesError?.message ?? "Something went wrong. Try again."
          }
        />
      ) : (
        <DataTable
          manual
          data={categories}
          columns={columns}
          searchPlaceholder="Search categories…"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
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
          getRowId={(category) => category.id}
          emptyTitle="No categories found"
          emptyDescription="Create a category to start organizing products."
          onRowClick={openDetails}
          rowActions={(category) => {
            const confirmingThis =
              isDeletingCategory && deletingCategoryId === category.id

            return (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${category.name}`}
                  onClick={() => openDetails(category)}
                >
                  <Eye className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${category.name}`}
                  disabled={isDeletingCategory}
                  onClick={() =>
                    navigate(`/admin/categories/${category.id}/edit`)
                  }
                >
                  <Pencil className="size-4" />
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${category.name}`}
                      disabled={isDeletingCategory}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  }
                  title={`Delete ${category.name}?`}
                  description={
                    category.productsCount > 0
                      ? `This category still has ${category.productsCount} product(s). Move or delete them first, or the API will reject the delete.`
                      : "This permanently soft-deletes the category. You can cancel if this was a mistake."
                  }
                  confirmLabel="Delete category"
                  cancelLabel="Cancel"
                  isConfirming={confirmingThis}
                  onConfirm={() => deleteCategory(category.id)}
                />
              </>
            )
          }}
        />
      )}

      <AdminDetailDialog
        open={detailCategory != null}
        onOpenChange={(open) => {
          if (!open) setDetailCategory(null)
        }}
        title={detailCategory?.name ?? "Category details"}
        description="Category information from your catalog."
        size="lg"
        footer={
          detailCategory ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const id = detailCategory.id
                setDetailCategory(null)
                navigate(`/admin/categories/${id}/edit`)
              }}
            >
              Edit category
            </Button>
          ) : null
        }
      >
        {detailCategory ? (
          <CategoryDetailView category={detailCategory} />
        ) : null}
      </AdminDetailDialog>
    </div>
  )
}
