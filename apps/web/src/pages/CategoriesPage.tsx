import { useSearchParams } from "react-router"
import { Tags } from "lucide-react"

import { CatalogPagination } from "#components/catalog/CatalogPagination"
import { SearchBar } from "#components/catalog/SearchBar"
import { EmptyState } from "#components/catalog/EmptyState"
import { CategoryCard } from "#components/category/CategoryCard"
import { CategoryGridSkeleton } from "#components/category/CategoryGridSkeleton"
import { useCategories } from "#components/category/hooks/use-categories"
import { useDebouncedValue } from "#hooks/use-debounced-value"

const PAGE_SIZE = 12

export function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") ?? ""
  const debouncedQ = useDebouncedValue(q, 300)
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))

  const {
    categories,
    meta,
    isLoadingCategories,
    isCategoriesError,
    categoriesError,
  } = useCategories({
    q: debouncedQ || undefined,
    page,
    limit: PAGE_SIZE,
    sort: "name-asc",
  })

  return (
    <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-muted-foreground">
            {isLoadingCategories
              ? "Loading collections…"
              : `Browse ${meta.total} collections.`}
          </p>
        </div>
        <SearchBar
          placeholder="Search categories…"
          className="sm:w-72"
          value={q}
          onChange={(value) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev)
              if (value) next.set("q", value)
              else next.delete("q")
              next.set("page", "1")
              return next
            })
          }}
        />
      </div>

      {isLoadingCategories ? (
        <CategoryGridSkeleton count={6} />
      ) : isCategoriesError ? (
        <EmptyState
          icon={Tags}
          title="Couldn’t load categories"
          description={
            categoriesError?.message ?? "Something went wrong. Try again."
          }
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories found"
          description="Try a different search, or check back later."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <CatalogPagination
            className="mt-10"
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(nextPage) => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.set("page", String(nextPage))
                return next
              })
            }}
          />
        </>
      )}
    </div>
  )
}
