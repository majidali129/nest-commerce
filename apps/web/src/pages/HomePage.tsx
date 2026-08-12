import { Link } from "react-router"
import { ArrowRight, PackageOpen, Tags } from "lucide-react"
import { PublicationStatus } from "@repo/contracts"

import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { CategoryCard } from "#components/category/CategoryCard"
import { CategoryCardSkeleton } from "#components/category/CategoryGridSkeleton"
import { ProductGrid } from "#components/product/ProductCollection"
import { ProductGridSkeleton } from "#components/product/ProductGridSkeleton"
import { EmptyState } from "#components/catalog/EmptyState"
import { useCategories } from "#components/category/hooks/use-categories"
import { useProducts } from "#components/product/hooks/use-products"

export function HomePage() {
  const {
    categories: featuredCategories,
    isLoadingCategories,
    isCategoriesError,
    categoriesError,
  } = useCategories({ page: 1, limit: 4, sort: "name-asc" })
  const {
    products: featuredProducts,
    isLoadingProducts,
    isProductsError,
    productsError,
  } = useProducts({
    page: 1,
    limit: 8,
    publicationStatus: PublicationStatus.PUBLISHED,
    sort: "newest",
  })

  return (
    <div>
      <section className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-9xl flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Everyday goods, thoughtfully made.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Vantage curates durable essentials across tech, apparel, and home —
            built to be used daily and kept for years.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link to="/products" />}>
              Shop all products
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/categories" />}>
              Browse categories
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-9xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shop by category
          </h2>
          <Link
            to="/categories"
            className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>

        {isLoadingCategories ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : isCategoriesError ? (
          <EmptyState
            icon={Tags}
            title="Couldn’t load categories"
            description={categoriesError?.message ?? "Please try again later."}
          />
        ) : featuredCategories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Categories will appear here once they’re published."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-9xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured products
          </h2>
          <Link
            to="/products"
            className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>

        {isLoadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : isProductsError ? (
          <EmptyState
            icon={PackageOpen}
            title="Couldn’t load products"
            description={productsError?.message ?? "Please try again later."}
          />
        ) : featuredProducts.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No products yet"
            description="Published products will show up here."
            action={
              <Button variant="outline" render={<Link to="/products" />}>
                Browse shop
              </Button>
            }
          />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto flex max-w-9xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Stay in the loop
          </h2>
          <p className="max-w-md text-muted-foreground">
            New arrivals and member-only offers, once a month. No spam, ever.
          </p>
          <form
            className="flex w-full max-w-sm gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
