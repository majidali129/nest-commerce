import { Avatar, AvatarFallback } from "#components/ui/avatar"
import { Badge } from "#components/ui/badge"
import { Card, CardContent } from "#components/ui/card"
import { RatingStars } from "#components/review/RatingStars"
import { formatDate } from "#lib/format"
import type { Review } from "#lib/types"

export function ReviewCard({ review }: { review: Review }) {
  const initials = review.author_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card>
      <CardContent className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{review.author_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.created_at)}
            </span>
          </div>
          {review.verified_purchase && (
            <Badge variant="secondary" className="ml-auto">
              Verified purchase
            </Badge>
          )}
        </div>
        <RatingStars rating={review.rating} />
        {review.title && <p className="text-sm font-medium">{review.title}</p>}
        <p className="text-sm text-muted-foreground">{review.body}</p>
      </CardContent>
    </Card>
  )
}
