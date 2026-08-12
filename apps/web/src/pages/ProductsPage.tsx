import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { PackageOpen } from "lucide-react"
import {
  PublicationStatus,
  type ProductSort,
  type ProductsQuery,
} from "@repo/contracts"

import { CatalogPagination } from "#components/catalog/CatalogPagination"
import { EmptyState } from "#components/catalog/EmptyState"
import {
  FilterPanel,
  SHOP_PRICE_MAX,
  SHOP_PRICE_MIN,
} from "#components/catalog/FilterPanel"
import { FilterSheet } from "#components/catalog/FilterSheet"
import { SearchBar } from "#components/catalog/SearchBar"
import { SortSelect } from "#components/catalog/SortSelect"
import { ViewToggle } from "#components/catalog/ViewToggle"
import {
  ProductGrid,
  ProductList,
} from "#components/product/ProductCollection"
import { ProductGridSkeleton } from "#components/product/ProductGridSkeleton"
import { useCategories } from "#components/category/hooks/use-categories"
import { useProducts } from "#components/product/hooks/use-products"
import { useDebouncedValue } from "#hooks/use-debounced-value"
import type { ViewMode } from "#lib/types"

const PAGE_SIZE = 8

function parseSort(value: string | null): ProductSort {
  const allowed: ProductSort[] = [
    "featured",
    "newest",
    "price-asc",
    "price-desc",
    "name-asc",
    "name-desc",
  ]
  return allowed.includes(value as ProductSort)
    ? (value as ProductSort)
    : "featured"
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get("q") ?? ""
  const debouncedQ = useDebouncedValue(q, 300)
  const categoryId = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : null
  const minPrice = Number(searchParams.get("minPrice") ?? SHOP_PRICE_MIN)
  const maxPrice = Number(searchParams.get("maxPrice") ?? SHOP_PRICE_MAX)
  const sort = parseSort(searchParams.get("sort"))
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const view: ViewMode =
    searchParams.get("view") === "list" ? "list" : "grid"

  const updateParams = (patch: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") next.delete(key)
        else next.set(key, value)
      }
      return next
    })
  }

  const productsQuery: ProductsQuery = useMemo(
    () => ({
      q: debouncedQ || undefined,
      categoryId:
        categoryId && Number.isFinite(categoryId) ? categoryId : undefined,
      minPrice:
        minPrice > SHOP_PRICE_MIN ? minPrice : undefined,
      maxPrice:
        maxPrice < SHOP_PRICE_MAX ? maxPrice : undefined,
      publicationStatus: PublicationStatus.PUBLISHED,
      sort,
      page,
      limit: PAGE_SIZE,
    }),
    [debouncedQ, categoryId, minPrice, maxPrice, sort, page],
  )

  const {
    products,
    meta,
    isLoadingProducts,
    isProductsError,
    productsError,
  } = useProducts(productsQuery)

  const { categories } = useCategories({
    limit: 100,
    sort: "name-asc",
    page: 1,
  })

  const filterProps = {
    categories,
    categoryId:
      categoryId && Number.isFinite(categoryId) ? categoryId : null,
    onCategoryChange: (next: number | null) =>
      updateParams({
        category: next != null ? String(next) : null,
        page: "1",
      }),
    priceRange: [minPrice, maxPrice] as [number, number],
    onPriceRangeChange: (range: [number, number]) =>
      updateParams({
        minPrice:
          range[0] > SHOP_PRICE_MIN ? String(range[0]) : null,
        maxPrice:
          range[1] < SHOP_PRICE_MAX ? String(range[1]) : null,
        page: "1",
      }),
  }

  return (
    <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shop All</h1>
        <p className="mt-1 text-muted-foreground">
          Everything in the store, in one place.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          className="w-full sm:w-64"
          value={q}
          onChange={(value) => updateParams({ q: value || null, page: "1" })}
        />
        <div className="ml-auto flex items-center gap-2">
          <span className="lg:hidden">
            <FilterSheet {...filterProps} />
          </span>
          <SortSelect
            value={sort}
            onValueChange={(value) =>
              updateParams({ sort: value, page: "1" })
            }
          />
          <ViewToggle
            value={view}
            onValueChange={(value) => updateParams({ view: value })}
          />
        </div>
      </div>

      <div className="mt-8 flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterPanel {...filterProps} />
        </aside>

        <div className="min-w-0 flex-1">
          {isLoadingProducts ? (
            <>
              <div className="mb-4">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              </div>
              <ProductGridSkeleton count={8} />
            </>
          ) : isProductsError ? (
            <EmptyState
              icon={PackageOpen}
              title="Couldn’t load products"
              description={
                productsError?.message ?? "Something went wrong. Try again."
              }
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="No products found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="">
              {view === "list" ? (
                <ProductList products={products} />
              ) : (
                <ProductGrid products={products} />
              )}
              <CatalogPagination
                className="mt-10"
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(nextPage) =>
                  updateParams({ page: String(nextPage) })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
