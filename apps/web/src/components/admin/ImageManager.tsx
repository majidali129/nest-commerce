import { useState } from "react"
import { ImagePlus, Star, X } from "lucide-react"

import { Badge } from "#components/ui/badge"
import { Button } from "#components/ui/button"
import type { ProductImage } from "#lib/types"
import { cn } from "#lib/utils"

interface ImageManagerProps {
  initialImages?: ProductImage[]
}

let imageCounter = 0

export function ImageManager({ initialImages = [] }: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages)

  const addPlaceholder = () => {
    imageCounter += 1
    setImages((prev) => [
      ...prev,
      {
        id: `img-new-${imageCounter}`,
        url: `https://picsum.photos/seed/new-image-${imageCounter}/800/800`,
        alt: "New product image",
        is_primary: prev.length === 0,
        sort_order: prev.length,
      },
    ])
  }

  const setPrimary = (id: string) => {
    setImages((prev) =>
      prev.map((image) => ({ ...image, is_primary: image.id === id }))
    )
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "group relative overflow-hidden rounded-lg border",
              image.is_primary && "ring-2 ring-primary"
            )}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="aspect-square w-full object-cover"
            />
            {image.is_primary && (
              <Badge className="absolute left-2 top-2">Primary</Badge>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2">
              {!image.is_primary && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setPrimary(image.id)}
                >
                  <Star className="size-3.5" />
                  Set as primary
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Remove image"
                className="size-8"
                onClick={() => removeImage(image.id)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addPlaceholder}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          <ImagePlus className="size-6" />
          <span className="text-xs">Add image</span>
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Image uploads are placeholders in this demo — no files are stored.
      </p>
    </div>
  )
}
