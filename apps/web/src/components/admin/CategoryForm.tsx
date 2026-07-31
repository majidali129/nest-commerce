import { toast } from "sonner"

import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"
import { Textarea } from "#components/ui/textarea"
import type { Category } from "#lib/types"

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success(
      category ? "Category updated (demo)" : "Category created (demo)"
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                required
                defaultValue={category?.name}
                placeholder="Category name"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={category?.slug}
                placeholder="category-slug"
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={category?.description}
                placeholder="What belongs in this category"
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="image_url">Image URL</FieldLabel>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                defaultValue={category?.image_url}
                placeholder="https://…"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {category ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  )
}
