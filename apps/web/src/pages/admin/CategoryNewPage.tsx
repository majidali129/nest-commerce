import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { CategoryForm } from "#components/admin/CategoryForm"

export function CategoryNewPage() {
  return (
    <div>
      <AdminPageHeader
        title="New category"
        description="Add a category to organize your catalog."
      />
      <CategoryForm />
    </div>
  )
}
