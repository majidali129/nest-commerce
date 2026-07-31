import { ReviewCard } from "#components/review/ReviewCard"
import { RatingStars } from "#components/review/RatingStars"
import type { Review } from "#lib/types"

interface ReviewsListProps {
  reviews: Review[]
  ratingAverage: number
  ratingCount: number
}

export function ReviewsList({
  reviews,
  ratingAverage,
  ratingCount,
}: ReviewsListProps) {
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }))
  const maxCount = Math.max(1, ...distribution.map((d) => d.count))

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-semibold tracking-tight">
            {ratingAverage.toFixed(1)}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">/ 5</span>
        </div>
        <RatingStars rating={ratingAverage} />
        <p className="text-sm text-muted-foreground">
          Based on {ratingCount} reviews
        </p>
        <div className="flex flex-col gap-1.5 pt-2">
          {distribution.map((row) => (
            <div key={row.stars} className="flex items-center gap-2 text-sm">
              <span className="w-3 shrink-0 text-muted-foreground">
                {row.stars}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(row.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-4 shrink-0 text-right text-muted-foreground tabular-nums">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex max-h-120 flex-col gap-4 overflow-y-auto pr-1">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
