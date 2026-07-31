import { SearchBar } from "#components/catalog/SearchBar"
import { CategoryCard } from "#components/category/CategoryCard"
import { categories } from "#lib/mock-data"

export function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-muted-foreground">
            Browse {categories.length} collections.
          </p>
        </div>
        <SearchBar placeholder="Search categories…" className="sm:w-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
