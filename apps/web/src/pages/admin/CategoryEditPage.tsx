import { Link, useParams } from "react-router"
import { PackageSearch } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { CategoryForm } from "#components/admin/CategoryForm"
import { EmptyState } from "#components/catalog/EmptyState"
import { useCategory } from "#components/category/hooks/use-categories"
import { Button } from "#components/ui/button"
import { Skeleton } from "#components/ui/skeleton"

export function CategoryEditPage() {
  const { categoryId = "" } = useParams()
  const { category, isLoadingCategory, isCategoryError, categoryError } =
    useCategory(categoryId)

  if (isLoadingCategory) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isCategoryError || !category) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Category not found"
        description={
          categoryError?.message ?? "This category may have been removed."
        }
        action={
          <Button render={<Link to="/admin/categories" />}>
            Back to categories
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <AdminPageHeader
        title={`Edit ${category.name}`}
        description="Update category details."
      />
      <CategoryForm category={category} />
    </div>
  )
}
