import { Star } from "lucide-react"

import { cn } from "#lib/utils"

interface RatingStarsProps {
  rating: number
  count?: number
  className?: string
}

export function RatingStars({ rating, count, className }: RatingStarsProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex">
        <span className="flex gap-0.5 text-muted-foreground/40">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-4" />
          ))}
        </span>
        <span
          className="absolute inset-0 flex gap-0.5 overflow-hidden text-primary"
          style={{ width: `${Math.min(100, Math.max(0, (rating / 5) * 100))}%` }}
          aria-hidden
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-4 shrink-0 fill-current" />
          ))}
        </span>
        <span className="sr-only">{rating} out of 5 stars</span>
      </span>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </span>
  )
}
