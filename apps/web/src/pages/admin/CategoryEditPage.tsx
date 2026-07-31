import { Link } from "react-router"
import { PackageSearch } from "lucide-react"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { CategoryForm } from "#components/admin/CategoryForm"
import { EmptyState } from "#components/catalog/EmptyState"
import { Button } from "#components/ui/button"
import { getCategoryById } from "#lib/mock-data"

export function CategoryEditPage() {
  const category = getCategoryById('cat-electronics')

  if (!category) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Category not found"
        description="This category may have been removed."
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
