import type { ProductImage } from "#lib/types"
import { cn } from "#lib/utils"

export function ImageGallery({ images }: { images: ProductImage[] }) {
  const active = images[0]

  if (!active) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
        <img
          src={active.url}
          alt={active.alt}
          className="size-full object-cover"
        />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <div
            key={image.id}
            aria-label={`Image ${index + 1}: ${image.alt}`}
            className={cn(
              "size-20 shrink-0 overflow-hidden rounded-lg border-2",
              index === 0
                ? "border-primary"
                : "border-transparent opacity-60"
            )}
          >
            <img
              src={image.url}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
