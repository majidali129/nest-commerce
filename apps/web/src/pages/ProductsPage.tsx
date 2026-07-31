import { CatalogPagination } from "#components/catalog/CatalogPagination"
import { FilterPanel } from "#components/catalog/FilterPanel"
import { FilterSheet } from "#components/catalog/FilterSheet"
import { SearchBar } from "#components/catalog/SearchBar"
import { SortSelect } from "#components/catalog/SortSelect"
import { ViewToggle } from "#components/catalog/ViewToggle"
import { ProductGrid } from "#components/product/ProductCollection"
import { getPublishedProducts } from "#lib/mock-data"

const products = getPublishedProducts()

export function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shop All</h1>
        <p className="mt-1 text-muted-foreground">
          Everything in the store, in one place.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar className="w-full sm:w-64" />
        <div className="ml-auto flex items-center gap-2">
          <span className="lg:hidden">
            <FilterSheet />
          </span>
          <SortSelect />
          <ViewToggle />
        </div>
      </div>

      <div className="mt-8 flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterPanel />
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-muted-foreground">
            {products.length} products
          </p>

          <ProductGrid products={products} />

          <CatalogPagination className="mt-10" />
        </div>
      </div>
    </div>
  )
}
