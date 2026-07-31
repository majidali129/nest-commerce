import { Link } from "react-router"

import { Card, CardContent } from "#components/ui/card"
import type { Category } from "#lib/types"
import { cn } from "#lib/utils"

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className={cn("group block", className)}
    >
      <Card className="h-full gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
        <div className="aspect-4/3 overflow-hidden bg-muted">
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.product_count}{" "}
            {category.product_count === 1 ? "product" : "products"}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
