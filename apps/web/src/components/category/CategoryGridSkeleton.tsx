import { Skeleton } from "#components/ui/skeleton"
import { cn } from "#lib/utils"

export function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function CategoryGridSkeleton({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}
