import type { CategoryListItem } from "@repo/contracts"

import { Badge } from "#components/ui/badge"

type CategoryDetailViewProps = {
  category: CategoryListItem
}

export function CategoryDetailView({ category }: CategoryDetailViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="size-36 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-40">
          <img
            src={
              category.imageUrl ||
              `https://picsum.photos/seed/cat-${category.slug}/320/320`
            }
            alt={category.name}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category.productsCount} products</Badge>
          </div>
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Slug</dt>
              <dd className="font-medium">/{category.slug}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Updated</dt>
              <dd>
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-medium">Description</h3>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {category.description || "—"}
        </p>
      </div>
    </div>
  )
}
