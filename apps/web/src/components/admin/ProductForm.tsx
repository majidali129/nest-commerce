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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"
import { Switch } from "#components/ui/switch"
import { Textarea } from "#components/ui/textarea"
import { ImageManager } from "#components/admin/ImageManager"
import { VariantsEditor } from "#components/admin/VariantsEditor"
import { categories } from "#lib/mock-data"
import type { Product } from "#lib/types"

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success(product ? "Product updated (demo)" : "Product created (demo)")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                required
                defaultValue={product?.title}
                placeholder="Product title"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={product?.slug}
                placeholder="product-slug"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="brand">Brand</FieldLabel>
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand}
                placeholder="Brand name"
              />
            </Field>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select name="category_id" defaultValue={product?.category_id}>
                <SelectTrigger className="w-full" aria-label="Category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="short_description">
                Short description
              </FieldLabel>
              <Input
                id="short_description"
                name="short_description"
                defaultValue={product?.short_description}
                placeholder="One-line summary"
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product?.description}
                placeholder="Full product description"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="price">Price</FieldLabel>
              <Input
                id="price"
                name="price"
                type="number"
                required
                min={0}
                step="0.01"
                defaultValue={product?.price}
                placeholder="0.00"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="compare_at_price">Compare at price</FieldLabel>
              <Input
                id="compare_at_price"
                name="compare_at_price"
                type="number"
                min={0}
                step="0.01"
                defaultValue={product?.compare_at_price}
                placeholder="0.00"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="discount_percent">Discount %</FieldLabel>
              <Input
                id="discount_percent"
                name="discount_percent"
                type="number"
                min={0}
                max={100}
                step={1}
                defaultValue={product?.discount_percent}
                placeholder="e.g. 25"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sku">SKU</FieldLabel>
              <Input
                id="sku"
                name="sku"
                required
                defaultValue={product?.sku}
                placeholder="SKU-CODE"
              />
            </Field>
            <Field>
              <FieldLabel>Stock status</FieldLabel>
              <Select name="stock_status" defaultValue={product?.stock_status ?? "in_stock"}>
                <SelectTrigger className="w-full" aria-label="Stock status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="in_stock">In stock</SelectItem>
                    <SelectItem value="low_stock">Low stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of stock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                name="is_published"
                defaultChecked={product?.is_published ?? true}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                name="is_featured"
                defaultChecked={product?.is_featured ?? false}
              />
              Featured
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <VariantsEditor initialVariants={product?.variants} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageManager initialImages={product?.images} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  )
}
