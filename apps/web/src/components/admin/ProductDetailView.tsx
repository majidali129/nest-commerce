import {
  PublicationStatus,
  type ProductDetailsReturnType,
  type Variant,
} from "@repo/contracts"

import { Badge } from "#components/ui/badge"
import { Skeleton } from "#components/ui/skeleton"
import { formatPrice } from "#lib/format"

type ProductDetailViewProps = {
  product: ProductDetailsReturnType | null
  isLoading?: boolean
  errorMessage?: string | null
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

export function ProductDetailView({
  product,
  isLoading,
  errorMessage,
}: ProductDetailViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (errorMessage || !product) {
    return (
      <p className="text-sm text-destructive">
        {errorMessage ?? "Product details unavailable."}
      </p>
    )
  }

  const variants = (product.variants ?? []).map((v) => normalizeVariant(v))
  const primary =
    variants.find((v) => v.isDefault) ?? variants[0] ?? null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="size-36 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-40">
          {primary?.media?.url ? (
            <img
              src={primary.media.url}
              alt={primary.media.altText ?? product.name}
              className="size-full object-cover"
            />
          ) : (
            <img
              src={`https://picsum.photos/seed/${product.slug}/320/320`}
              alt={product.name}
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                product.publicationStatus === PublicationStatus.PUBLISHED
                  ? "secondary"
                  : "outline"
              }
            >
              {product.publicationStatus}
            </Badge>
            {product.isFeatured ? (
              <Badge variant="outline">Featured</Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">/{product.slug}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{product.category?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Variants</dt>
              <dd className="font-medium">{variants.length}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Short description</dt>
              <dd>{product.shortDescription || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-medium">Description</h3>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {product.description || "—"}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Variants</h3>
        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No variants yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {variants.map((variant) => (
              <li
                key={variant.id}
                className="flex items-center gap-3 rounded-lg border p-2.5"
              >
                <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
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
                    <span className="font-medium">{variant.sku}</span>
                    {variant.isDefault ? (
                      <Badge variant="secondary">Default</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {variant.attributes?.color ?? "—"} /{" "}
                    {variant.attributes?.size ?? "—"} ·{" "}
                    {formatPrice(variant.price)}
                    {variant.discountPercentage > 0
                      ? ` (−${variant.discountPercentage}%)`
                      : ""}{" "}
                    · stock {variant.stock}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
