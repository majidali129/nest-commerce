import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { PackageOpen, ShoppingBag } from "lucide-react"
import { StockStatusFilter, type Variant } from "@repo/contracts"

import { Button } from "#components/ui/button"
import { Separator } from "#components/ui/separator"
import { Skeleton } from "#components/ui/skeleton"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { EmptyState } from "#components/catalog/EmptyState"
import { useAddToCart } from "#components/cart/hooks/use-cart"
import { ImageGallery } from "#components/product/ImageGallery"
import { PriceDisplay } from "#components/product/PriceDisplay"
import { ProductGrid } from "#components/product/ProductCollection"
import { QuantityStepper } from "#components/product/QuantityStepper"
import { StockBadge } from "#components/product/StockBadge"
import { useProduct } from "#components/product/hooks/use-products"
import { useCategory } from "#components/category/hooks/use-categories"
import { useCurrentUser } from "#hooks/use-current-user"
import {
  compareAtFromDiscount,
  stockStatusFromCount,
} from "#lib/mappers/product"
import { cn } from "#lib/utils"
import { productsPath, signInPath } from "../paths"

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-9xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-48" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full sm:w-48" />
        </div>
      </div>
    </div>
  )
}

function findVariant(
  variants: Variant[],
  color?: string,
  size?: string,
): Variant | undefined {
  return (
    variants.find(
      (v) =>
        (color == null || v.attributes?.color === color) &&
        (size == null || v.attributes?.size === size),
    ) ??
    variants.find((v) => color != null && v.attributes?.color === color) ??
    variants.find((v) => size != null && v.attributes?.size === size)
  )
}

export function ProductDetailPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useCurrentUser()
  const { addToCart, isAddingToCart } = useAddToCart()
  const { productId = "" } = useParams()
  const {
    product,
    isLoadingProduct,
    isProductError,
    productError,
    relatedProducts,
  } = useProduct(productId)
  const { category } = useCategory(
    product ? String(product.category.id) : "",
  )

  const defaultVariantId = useMemo(() => {
    if (!product?.variants.length) return null
    return (
      product.variants.find((v) => v.isDefault)?.id ?? product.variants[0].id
    )
  }, [product])

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  )
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setSelectedVariantId(defaultVariantId)
    setQuantity(1)
  }, [product?.id, defaultVariantId])

  const selectedVariant = useMemo(() => {
    if (!product?.variants.length) return null
    return (
      product.variants.find((v) => v.id === selectedVariantId) ??
      product.variants.find((v) => v.id === defaultVariantId) ??
      product.variants[0] ??
      null
    )
  }, [product, selectedVariantId, defaultVariantId])

  const colors = useMemo(() => {
    if (!product) return []
    return [
      ...new Set(
        product.variants
          .map((v) => v.attributes?.color)
          .filter((c): c is string => Boolean(c)),
      ),
    ]
  }, [product])

  const sizes = useMemo(() => {
    if (!product) return []
    return [
      ...new Set(
        product.variants
          .map((v) => v.attributes?.size)
          .filter((s): s is string => Boolean(s)),
      ),
    ]
  }, [product])

  const availableSizes = useMemo(() => {
    if (!product || !selectedVariant?.attributes?.color) return sizes
    return [
      ...new Set(
        product.variants
          .filter(
            (v) => v.attributes?.color === selectedVariant.attributes?.color,
          )
          .map((v) => v.attributes?.size)
          .filter((s): s is string => Boolean(s)),
      ),
    ]
  }, [product, selectedVariant?.attributes?.color, sizes])

  const galleryImages = useMemo(() => {
    if (!product) return []
    return product.variants
      .filter((v) => v.media?.url)
      .map((v) => ({
        id: v.id,
        url: v.media!.url,
        alt: v.media?.altText ?? product.name,
      }))
  }, [product])

  if (isLoadingProduct) {
    return <ProductDetailSkeleton />
  }

  if (isProductError || !product) {
    return (
      <div className="mx-auto max-w-9xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageOpen}
          title="Product not found"
          description={
            productError?.message ??
            "This product may have been removed or is unavailable."
          }
          action={
            <Button variant="outline" render={<Link to={productsPath()} />}>
              Back to products
            </Button>
          }
        />
      </div>
    )
  }

  const color = selectedVariant?.attributes?.color
  const size = selectedVariant?.attributes?.size
  const price = selectedVariant?.price ?? 0
  const discount = selectedVariant?.discountPercentage ?? 0
  const compareAt = compareAtFromDiscount(price, discount)
  const stockStatus = stockStatusFromCount(selectedVariant?.stock ?? 0)
  const isOutOfStock = stockStatus === StockStatusFilter.OUT_OF_STOCK
  const activeImageId = selectedVariant?.media?.url
    ? selectedVariant.id
    : galleryImages[0]?.id

  const selectColor = (nextColor: string) => {
    const match = findVariant(product.variants, nextColor, size)
    if (match) {
      setSelectedVariantId(match.id)
      setQuantity(1)
    }
  }

  const selectSize = (nextSize: string) => {
    const match = findVariant(product.variants, color, nextSize)
    if (match) {
      setSelectedVariantId(match.id)
      setQuantity(1)
    }
  }

  return (
    <div className="mx-auto max-w-9xl px-4 py-8 sm:px-6 lg:px-8">
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          {
            label: category?.name ?? product.category.name,
            to: `/products?category=${product.category.id}`,
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ImageGallery
          images={
            galleryImages.length > 0
              ? galleryImages
              : [
                  {
                    id: product.id,
                    url: `https://picsum.photos/seed/${encodeURIComponent(product.slug)}/800/800`,
                    alt: product.name,
                  },
                ]
          }
          activeId={activeImageId}
          onSelect={(image) => {
            const variant = product.variants.find((v) => v.id === image.id)
            if (variant) {
              setSelectedVariantId(variant.id)
              setQuantity(1)
            }
          }}
        />

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            {selectedVariant?.sku ? (
              <p className="mt-1 text-xs text-muted-foreground">
                SKU {selectedVariant.sku}
              </p>
            ) : null}
          </div>

          <StockBadge status={stockStatus} />

          <PriceDisplay
            price={price}
            compareAtPrice={compareAt}
            discountPercent={discount > 0 ? discount : undefined}
            className="text-2xl"
          />

          {product.shortDescription ? (
            <p className="text-muted-foreground">{product.shortDescription}</p>
          ) : null}

          <Separator />

          {colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                Color{" "}
                {color ? (
                  <span className="font-normal text-muted-foreground">
                    — {color}
                  </span>
                ) : null}
              </span>
              <div className="flex flex-wrap gap-2">
                {colors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={option === color}
                    onClick={() => selectColor(option)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      option === color
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:border-foreground/40",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                Size{" "}
                {size ? (
                  <span className="font-normal text-muted-foreground">
                    — {size}
                  </span>
                ) : null}
              </span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((option) => {
                  const available = availableSizes.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={!available}
                      aria-pressed={option === size}
                      onClick={() => selectSize(option)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        option === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:border-foreground/40",
                        !available && "cursor-not-allowed opacity-40",
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={Math.max(1, selectedVariant?.stock ?? 99)}
            />
            <Button
              size="lg"
              className="flex-1 sm:flex-none sm:px-10"
              disabled={isOutOfStock || !selectedVariant || isAddingToCart}
              onClick={() => {
                if (!selectedVariant) return
                if (!isAuthenticated) {
                  navigate(
                    `${signInPath()}?next=${encodeURIComponent(window.location.pathname)}`,
                  )
                  return
                }
                addToCart({
                  variantId: selectedVariant.id,
                  quantity,
                })
              }}
            >
              <ShoppingBag data-icon="inline-start" />
              {isOutOfStock
                ? "Out of stock"
                : isAddingToCart
                  ? "Adding…"
                  : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {product.description ? (
        <div className="mt-12">
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <span className="inline-flex items-center justify-center rounded-md bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm">
              Description
            </span>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      ) : null}

      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          You may also like
        </h2>
        {relatedProducts.length > 0 ? (
          <ProductGrid products={relatedProducts} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No related products right now.
          </p>
        )}
      </section>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to={productsPath()} className="underline-offset-4 hover:underline">
          Back to products
        </Link>
      </p>
    </div>
  )
}
