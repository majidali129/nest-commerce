import { Link } from "react-router"
import type { CategoryListItem } from "@repo/contracts"

import { Card, CardContent } from "#components/ui/card"
import { categoryImagePlaceholder } from "#lib/mappers/catalog"
import { cn } from "#lib/utils"

interface CategoryCardProps {
  category: CategoryListItem
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const imageUrl =
    category.imageUrl ??
    categoryImagePlaceholder(category.slug || String(category.id))

  return (
    <Link
      to={`/products?category=${category.id}`}
      className={cn("group block", className)}
    >
      <Card className="h-full gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
        <div className="aspect-4/3 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={category.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.productsCount}{" "}
            {category.productsCount === 1 ? "product" : "products"}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
