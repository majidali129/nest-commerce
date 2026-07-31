import { Link } from "react-router"
import { ShoppingBag } from "lucide-react"

import { Button } from "#components/ui/button"
import { Separator } from "#components/ui/separator"
import { PageBreadcrumb } from "#components/catalog/PageBreadcrumb"
import { ImageGallery } from "#components/product/ImageGallery"
import { PriceDisplay } from "#components/product/PriceDisplay"
import { ProductGrid } from "#components/product/ProductCollection"
import { QuantityStepper } from "#components/product/QuantityStepper"
import { StockBadge } from "#components/product/StockBadge"
import { RatingStars } from "#components/review/RatingStars"
import { ReviewsList } from "#components/review/ReviewsList"
import {
  getCategoryById,
  getProductByIdOrSlug,
  getRelatedProducts,
  getReviewsForProduct,
} from "#lib/mock-data"
import { cn } from "#lib/utils"

const product = getProductByIdOrSlug("aura-wireless-headphones")!
const category = getCategoryById(product.category_id)
const color = product.colors[0]
const size = product.sizes[0]
const productReviews = getReviewsForProduct(product.id)
const relatedProducts = getRelatedProducts(product)

export function ProductDetailPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          {
            label: category?.name ?? "Products",
            to: category ? `/products?category=${category.id}` : "/products",
          },
          { label: product.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} />

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RatingStars
              rating={product.rating_average}
              count={product.rating_count}
            />
            <StockBadge status={product.stock_status} />
          </div>

          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compare_at_price}
            discountPercent={product.discount_percent}
            currency={product.currency}
            className="text-2xl"
          />

          <p className="text-muted-foreground">{product.short_description}</p>

          <Separator />

          {product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                Color{" "}
                <span className="font-normal text-muted-foreground">
                  — {color}
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={option === color}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      option === color
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={option === size}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm",
                      option === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <QuantityStepper value={1} />
            <Button size="lg" className="flex-1 sm:flex-none sm:px-10">
              <ShoppingBag data-icon="inline-start" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <span className="inline-flex items-center justify-center rounded-md bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm">
            Description
          </span>
          <span className="inline-flex items-center justify-center px-3 py-1 text-sm">
            Specs
          </span>
          <span className="inline-flex items-center justify-center px-3 py-1 text-sm">
            Shipping
          </span>
        </div>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">Reviews</h2>
        <ReviewsList
          reviews={productReviews}
          ratingAverage={product.rating_average}
          ratingCount={product.rating_count}
        />
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          You may also like
        </h2>
        <ProductGrid products={relatedProducts} />
      </section>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to="/products" className="underline-offset-4 hover:underline">
          Back to products
        </Link>
      </p>
    </div>
  )
}
