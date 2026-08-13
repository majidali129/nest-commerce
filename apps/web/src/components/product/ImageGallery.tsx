import { cn } from "#lib/utils"

export type GalleryImage = {
  id: string | number
  url: string
  alt: string
}

type ImageGalleryProps = {
  images: GalleryImage[]
  activeId?: string | number
  onSelect?: (image: GalleryImage) => void
}

export function ImageGallery({
  images,
  activeId,
  onSelect,
}: ImageGalleryProps) {
  if (images.length === 0) return null

  const active =
    (activeId != null
      ? images.find((image) => image.id === activeId)
      : undefined) ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
        <img
          key={String(active.id)}
          src={active.url}
          alt={active.alt}
          className="size-full object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const isActive = image.id === active.id
            return (
              <button
                key={String(image.id)}
                type="button"
                aria-label={`Image ${index + 1}: ${image.alt}`}
                aria-pressed={isActive}
                onClick={() => onSelect?.(image)}
                className={cn(
                  "size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                  isActive
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100",
                  onSelect ? "cursor-pointer" : "cursor-default",
                )}
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
