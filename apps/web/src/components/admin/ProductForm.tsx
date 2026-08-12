import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  PublicationStatus,
  type ProductCreateInput,
  type Variant,
} from "@repo/contracts"

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
import { Badge } from "#components/ui/badge"
import { VariantCreateForm } from "#components/admin/VariantCreateForm"
import { useCategories } from "#components/category/hooks/use-categories"
import {
  useCreateProduct,
  useCreateVariant,
} from "#components/product/hooks/use-product-mutations"
import { formatPrice } from "#lib/format"
import { cn } from "#lib/utils"

type Step = 1 | 2

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

export function ProductForm() {
  const navigate = useNavigate()
  const { categories, isLoadingCategories } = useCategories({
    limit: 100,
    sort: "name-asc",
  })
  const { createProduct, isCreatingProduct } = useCreateProduct()

  const [step, setStep] = useState<Step>(1)
  const [productId, setProductId] = useState<number | null>(null)
  const [productName, setProductName] = useState("")
  const [createdVariants, setCreatedVariants] = useState<Variant[]>([])

  const [name, setName] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  const { createVariant, isCreatingVariant } = useCreateVariant(productId ?? 0)

  const hasDefaultVariant = useMemo(
    () => createdVariants.some((v) => v.isDefault),
    [createdVariants],
  )

  const handleCreateProduct = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    if (isCreatingProduct) return

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

    const payload: ProductCreateInput = {
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
      const created = await createProduct(payload)
      setProductId(created.id)
      setProductName(created.name ?? trimmedName)
      setStep(2)
    } catch {
      // toast handled in mutation
    }
  }

  const handleAddVariant = async (
    input: Parameters<typeof createVariant>[0],
  ) => {
    if (!productId) return
    const created = await createVariant(input)
    const normalized = normalizeVariant(created)

    setCreatedVariants((prev) => {
      const next = normalized.isDefault
        ? prev.map((v) => ({ ...v, isDefault: false }))
        : prev
      return [...next, normalized]
    })
  }

  const handleFinish = () => {
    if (createdVariants.length === 0) {
      toast.error("Add at least one variant before finishing")
      return
    }
    if (!hasDefaultVariant) {
      toast.error("Mark at least one variant as default")
      return
    }
    toast.success("Product ready")
    navigate("/admin/products", { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap items-center gap-3 text-sm">
        <li
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1",
            step === 1
              ? "border-primary bg-primary/5 text-foreground"
              : "border-transparent bg-muted text-muted-foreground",
          )}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-background text-xs font-medium">
            {step > 1 ? <Check className="size-3.5" /> : "1"}
          </span>
          Product details
        </li>
        <li className="text-muted-foreground">→</li>
        <li
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1",
            step === 2
              ? "border-primary bg-primary/5 text-foreground"
              : "border-transparent bg-muted text-muted-foreground",
          )}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-background text-xs font-medium">
            2
          </span>
          Variants
        </li>
      </ol>

      {step === 1 && (
        <form onSubmit={handleCreateProduct} className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic information</CardTitle>
              <CardDescription>
                Create the core product first. Variants and images come next.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                    disabled={isCreatingProduct}
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={categoryId || undefined}
                    onValueChange={(value) => setCategoryId(value ?? "")}
                    disabled={isCreatingProduct || isLoadingCategories}
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
                  <FieldLabel htmlFor="shortDescription">
                    Short description
                  </FieldLabel>
                  <Input
                    id="shortDescription"
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="One-line summary"
                    disabled={isCreatingProduct}
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Full product description"
                    disabled={isCreatingProduct}
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
                        disabled={isCreatingProduct}
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
                        disabled={isCreatingProduct}
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
              disabled={isCreatingProduct}
              render={<Link to="/admin/products" />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingProduct}>
              {isCreatingProduct ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create product & continue"
              )}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && productId != null && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add variants</CardTitle>
              <CardDescription>
                Product{" "}
                <span className="font-medium text-foreground">
                  {productName}
                </span>{" "}
                (#{productId}) is ready. Add variants with a signed image upload.
                Mark at least one as default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VariantCreateForm
                productId={productId}
                forceDefault={createdVariants.length === 0}
                isSubmitting={isCreatingVariant}
                onSubmit={handleAddVariant}
              />
            </CardContent>
          </Card>

          {createdVariants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Added variants ({createdVariants.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {createdVariants.map((variant) => (
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
                        {variant.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {variant.attributes?.color} / {variant.attributes?.size}{" "}
                        · {formatPrice(variant.price)} · stock {variant.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
            >
              Save draft & exit
            </Button>
            <Button type="button" onClick={handleFinish}>
              Finish
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
