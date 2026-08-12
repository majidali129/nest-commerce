import { useEffect, useId, useRef, useState } from "react"
import { Link } from "react-router"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import type { CategoryListItem } from "@repo/contracts"

import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"
import { Textarea } from "#components/ui/textarea"
import {
  useCreateCategory,
  useUpdateCategory,
} from "#components/category/hooks/use-category-mutations"
import { cloudinaryApi } from "#api/services/cloudinary"
import { cn } from "#lib/utils"

interface CategoryFormProps {
  category?: CategoryListItem
}

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"

export function CategoryForm({ category }: CategoryFormProps) {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(category)

  const { createCategory, isCreatingCategory } = useCreateCategory()
  const { updateCategory, isUpdatingCategory } = useUpdateCategory(
    category?.id ?? 0,
  )

  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    category?.imageUrl ?? null,
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const isSubmitting =
    isCreatingCategory || isUpdatingCategory || isUploadingImage

  useEffect(() => {
    if (!selectedFile) return
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller")
      event.target.value = ""
      return
    }

    setSelectedFile(file)
  }

  const clearSelectedImage = () => {
    setSelectedFile(null)
    setPreviewUrl(category?.imageUrl ?? null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      toast.error("Name is required")
      return
    }
    if (!trimmedDescription) {
      toast.error("Description is required")
      return
    }

    const hasImage = Boolean(selectedFile || category?.imageUrl)
    if (!hasImage) {
      toast.error("Please select a category image")
      return
    }

    try {
      let imageUrl = category?.imageUrl ?? null

      if (selectedFile) {
        setIsUploadingImage(true)
        const uploaded = await cloudinaryApi.uploadWithSignature(
          selectedFile,
          "categories",
        )
        imageUrl = uploaded.secureUrl
        setPreviewUrl(uploaded.secureUrl)
        setSelectedFile(null)
      }

      const payload = {
        name: trimmedName,
        description: trimmedDescription,
        imageUrl,
      }

      if (isEdit && category) {
        await updateCategory(payload)
      } else {
        await createCategory(payload)
      }
    } catch (error) {
      if (!(error instanceof Error && "statusCode" in error)) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        )
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Apparel"
                disabled={isSubmitting}
              />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                rows={3}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short description of what belongs in this category"
                disabled={isSubmitting}
              />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor={fileInputId}>Category image</FieldLabel>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div
                  className={cn(
                    "relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted",
                    !previewUrl && "border-dashed",
                  )}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={name || "Category preview"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="size-8 text-muted-foreground" />
                  )}
                  {selectedFile && (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      disabled={isSubmitting}
                      onClick={clearSelectedImage}
                      aria-label="Cancel selected image"
                      className="absolute top-1 right-1 size-7 rounded-full border bg-background/95 shadow-sm hover:bg-background"
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Input
                    ref={fileInputRef}
                    id={fileInputId}
                    name="image"
                    type="file"
                    accept={ACCEPT_IMAGES}
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="cursor-pointer file:mr-3 file:cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required. JPG, PNG, WEBP or GIF up to 5MB. Use the × on the
                    preview to cancel a new selection before saving.
                  </p>
                </div>
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          render={<Link to="/admin/categories" />}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isUploadingImage
                ? "Uploading image…"
                : isEdit
                  ? "Saving…"
                  : "Creating…"}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create category"
          )}
        </Button>
      </div>
    </form>
  )
}
