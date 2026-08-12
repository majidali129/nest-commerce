import { Skeleton } from "#components/ui/skeleton"
import { cn } from "#lib/utils"

export function ProductCardSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-1 h-5 w-20" />
        <Skeleton className="mt-2 h-8 w-full" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
