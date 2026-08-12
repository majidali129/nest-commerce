import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  PublicationStatus,
  type ProductDetailsReturnType,
  type ProductUpdateInput,
  type Variant,
  type VariantCreateInput,
} from "@repo/contracts"

import { VariantCreateForm } from "#components/admin/VariantCreateForm"
import { useCategories } from "#components/category/hooks/use-categories"
import {
  useCreateVariant,
  useUpdateProduct,
  useUpdateVariant,
} from "#components/product/hooks/use-product-mutations"
import { Badge } from "#components/ui/badge"
import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { formatPrice } from "#lib/format"

type ProductEditFormProps = {
  product: ProductDetailsReturnType
}

function normalizeVariant(raw: Variant | Record<string, unknown>): Variant {
  const v = raw as Variant & {
    stockOnHand?: number
    reservedStock?: number
  }
  return {
    id: v.id,
    productId: v.productId,
    price: v.price,
    discountPercentage: v.discountPercentage ?? 0,
    status: v.status,
    sku: v.sku,
    stock:
      typeof v.stock === "number"
        ? v.stock
        : (v.stockOnHand ?? 0) - (v.reservedStock ?? 0),
    media: v.media ?? null,
    isDefault: Boolean(v.isDefault),
    attributes: v.attributes ?? null,
  }
}

export function ProductEditForm({ product }: ProductEditFormProps) {
  const navigate = useNavigate()
  const { categories, isLoadingCategories } = useCategories({
    limit: 100,
    sort: "name-asc",
  })
  const { updateProduct, isUpdatingProduct } = useUpdateProduct(product.id)
  const { createVariant, isCreatingVariant } = useCreateVariant(product.id)
  const { updateVariant, isUpdatingVariant } = useUpdateVariant(product.id)

  const [name, setName] = useState(product.name)
  const [shortDescription, setShortDescription] = useState(
    product.shortDescription,
  )
  const [description, setDescription] = useState(product.description)
  const [categoryId, setCategoryId] = useState(String(product.category.id))
  const [isPublished, setIsPublished] = useState(
    product.publicationStatus === PublicationStatus.PUBLISHED,
  )
  const [isFeatured, setIsFeatured] = useState(Boolean(product.isFeatured))
  const [variants, setVariants] = useState<Variant[]>(() =>
    (product.variants ?? []).map((v) => normalizeVariant(v)),
  )

  useEffect(() => {
    setName(product.name)
    setShortDescription(product.shortDescription)
    setDescription(product.description)
    setCategoryId(String(product.category.id))
    setIsPublished(product.publicationStatus === PublicationStatus.PUBLISHED)
    setIsFeatured(Boolean(product.isFeatured))
    setVariants((product.variants ?? []).map((v) => normalizeVariant(v)))
  }, [product])

  const hasDefaultVariant = useMemo(
    () => variants.some((v) => v.isDefault),
    [variants],
  )

  const busy = isUpdatingProduct || isCreatingVariant || isUpdatingVariant

  const handleSaveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return

    const trimmedName = name.trim()
    const trimmedShort = shortDescription.trim()
    const trimmedDescription = description.trim()
    const parsedCategoryId = Number(categoryId)

    if (!trimmedName) {
      toast.error("Name is required")
      return
    }
    if (!trimmedShort) {
      toast.error("Short description is required")
      return
    }
    if (!trimmedDescription) {
      toast.error("Description is required")
      return
    }
    if (!Number.isFinite(parsedCategoryId) || parsedCategoryId <= 0) {
      toast.error("Please select a category")
      return
    }

    const payload: ProductUpdateInput = {
      name: trimmedName,
      shortDescription: trimmedShort,
      description: trimmedDescription,
      categoryId: parsedCategoryId,
      publicationStatus: isPublished
        ? PublicationStatus.PUBLISHED
        : PublicationStatus.DRAFT,
      isFeatured,
    }

    try {
      await updateProduct(payload)
      navigate("/admin/products", { replace: true })
    } catch {
      // toast handled in mutation
    }
  }

  const handleAddVariant = async (input: VariantCreateInput) => {
    const created = await createVariant(input)
    const normalized = normalizeVariant(created)
    setVariants((prev) => {
      const next = normalized.isDefault
        ? prev.map((v) => ({ ...v, isDefault: false }))
        : prev
      return [...next, normalized]
    })
  }

  const handleMakeDefault = async (variantId: number) => {
    try {
      await updateVariant({ id: variantId, input: { isDefault: true } })
      setVariants((prev) =>
        prev.map((v) => ({ ...v, isDefault: v.id === variantId })),
      )
    } catch {
      // toast handled in mutation
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSaveProduct} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
            <CardDescription>
              Update core product fields. Variants are managed below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="edit-name">Name</FieldLabel>
                <Input
                  id="edit-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={categoryId || undefined}
                  onValueChange={(value) => setCategoryId(value ?? "")}
                  disabled={busy || isLoadingCategories}
                >
                  <SelectTrigger className="w-full" aria-label="Category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="edit-short">Short description</FieldLabel>
                <Input
                  id="edit-short"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  disabled={busy}
                />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                <Textarea
                  id="edit-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={busy}
                />
              </Field>
              <Field className="sm:col-span-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                  <label className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 sm:min-w-56">
                    <div>
                      <p className="text-sm font-medium">Published</p>
                      <p className="text-xs text-muted-foreground">
                        Maps to publicationStatus
                      </p>
                    </div>
                    <Switch
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                      disabled={busy}
                      aria-label="Published"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 sm:min-w-56">
                    <div>
                      <p className="text-sm font-medium">Featured</p>
                      <p className="text-xs text-muted-foreground">
                        Maps to isFeatured
                      </p>
                    </div>
                    <Switch
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                      disabled={busy}
                      aria-label="Featured"
                    />
                  </label>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            render={<Link to="/admin/products" />}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {isUpdatingProduct ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save product"
            )}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Variants ({variants.length})</CardTitle>
          <CardDescription>
            Existing variants for this product. Mark one as default
            {hasDefaultVariant ? "" : " — none is set yet"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {variants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No variants yet. Add one below.
            </p>
          ) : (
            variants.map((variant) => (
              <div
                key={variant.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
              >
                <div className="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {variant.media?.url ? (
                    <img
                      src={variant.media.url}
                      alt={variant.sku}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{variant.sku}</p>
                    {variant.isDefault ? (
                      <Badge variant="secondary">Default</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {variant.attributes?.color ?? "—"} /{" "}
                    {variant.attributes?.size ?? "—"} ·{" "}
                    {formatPrice(variant.price)} · stock {variant.stock}
                  </p>
                </div>
                {!variant.isDefault ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => handleMakeDefault(variant.id)}
                  >
                    Make default
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add variant</CardTitle>
          <CardDescription>
            Upload a signed Cloudinary image and attach a new variant to this
            product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VariantCreateForm
            productId={product.id}
            forceDefault={variants.length === 0}
            isSubmitting={isCreatingVariant}
            onSubmit={handleAddVariant}
          />
        </CardContent>
      </Card>
    </div>
  )
}
