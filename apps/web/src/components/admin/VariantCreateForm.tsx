import { useEffect, useId, useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { VariantStatus, type VariantCreateInput } from "@repo/contracts"

import { Button } from "#components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"
import { Switch } from "#components/ui/switch"
import { cloudinaryApi } from "#api/services/cloudinary"
import { cn } from "#lib/utils"

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"

type VariantCreateFormProps = {
  productId: number
  /** When true, first variant — default toggle forced on */
  forceDefault: boolean
  isSubmitting: boolean
  onSubmit: (input: VariantCreateInput) => Promise<void>
}

export function VariantCreateForm({
  productId,
  forceDefault,
  isSubmitting,
  onSubmit,
}: VariantCreateFormProps) {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [sku, setSku] = useState("")
  const [price, setPrice] = useState("")
  const [stockOnHand, setStockOnHand] = useState("0")
  const [discountPercentage, setDiscountPercentage] = useState("0")
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [status, setStatus] = useState<string>(VariantStatus.ACTIVE)
  const [isDefault, setIsDefault] = useState(forceDefault)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const busy = isSubmitting || isUploadingImage

  useEffect(() => {
    setIsDefault(forceDefault)
  }, [forceDefault])

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
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const resetForm = () => {
    setSku("")
    setPrice("")
    setStockOnHand("0")
    setDiscountPercentage("0")
    setColor("")
    setSize("")
    setStatus(VariantStatus.ACTIVE)
    setIsDefault(false)
    clearSelectedImage()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return

    const trimmedSku = sku.trim()
    const priceValue = Number(price)
    const stockValue = Number(stockOnHand)
    const discountValue = Number(discountPercentage)
    const trimmedColor = color.trim()
    const trimmedSize = size.trim()

    if (!trimmedSku) {
      toast.error("SKU is required")
      return
    }
    if (!Number.isFinite(priceValue) || priceValue < 0 || !Number.isInteger(priceValue)) {
      toast.error("Price must be a whole number (e.g. 4999)")
      return
    }
    if (!Number.isFinite(stockValue) || stockValue < 0 || !Number.isInteger(stockValue)) {
      toast.error("Stock must be a whole number ≥ 0")
      return
    }
    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      discountValue > 100 ||
      !Number.isInteger(discountValue)
    ) {
      toast.error("Discount must be an integer from 0–100")
      return
    }
    if (!trimmedColor || !trimmedSize) {
      toast.error("Color and size are required")
      return
    }
    if (!selectedFile) {
      toast.error("Please select a variant image")
      return
    }

    try {
      setIsUploadingImage(true)
      const uploaded = await cloudinaryApi.uploadWithSignature(
        selectedFile,
        "variants",
      )

      const input: VariantCreateInput = {
        productId,
        sku: trimmedSku,
        price: priceValue,
        stockOnHand: stockValue,
        discountPercentage: discountValue,
        status: status as VariantCreateInput["status"],
        isDefault: forceDefault || isDefault,
        attributes: {
          color: trimmedColor,
          size: trimmedSize,
        },
        media: {
          url: uploaded.secureUrl,
          publicId: uploaded.publicId,
          altText: `${trimmedColor} / ${trimmedSize}`,
        },
      }

      await onSubmit(input)
      resetForm()
    } catch (error) {
      if (!(error instanceof Error && "statusCode" in error)) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add variant",
        )
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="variant-sku">SKU</FieldLabel>
          <Input
            id="variant-sku"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU-COLOR-SIZE"
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-price">Price</FieldLabel>
          <Input
            id="variant-price"
            type="number"
            required
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="4999"
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-stock">Stock on hand</FieldLabel>
          <Input
            id="variant-stock"
            type="number"
            min={0}
            step={1}
            value={stockOnHand}
            onChange={(e) => setStockOnHand(e.target.value)}
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-discount">Discount %</FieldLabel>
          <Input
            id="variant-discount"
            type="number"
            min={0}
            max={100}
            step={1}
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-color">Color</FieldLabel>
          <Input
            id="variant-color"
            required
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Black"
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="variant-size">Size</FieldLabel>
          <Input
            id="variant-size"
            required
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="M"
            disabled={busy}
          />
        </Field>
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value ?? VariantStatus.ACTIVE)}
            disabled={busy}
          >
            <SelectTrigger className="w-full" aria-label="Variant status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={VariantStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={VariantStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={VariantStatus.ARCHIVED}>Archived</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field className="sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Default variant</p>
              <p className="text-xs text-muted-foreground">
                {forceDefault
                  ? "The first variant is always the default."
                  : "At least one variant must be marked default. Turning this on replaces the current default."}
              </p>
            </div>
            <Switch
              checked={forceDefault || isDefault}
              onCheckedChange={setIsDefault}
              disabled={busy || forceDefault}
              aria-label="Mark as default variant"
            />
          </div>
        </Field>
        <Field className="sm:col-span-2 lg:col-span-3">
          <FieldLabel htmlFor={fileInputId}>Variant image</FieldLabel>
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
                  alt="Variant preview"
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
                  disabled={busy}
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
                type="file"
                accept={ACCEPT_IMAGES}
                onChange={handleFileChange}
                disabled={busy}
                className="cursor-pointer file:mr-3 file:cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Required. JPG, PNG, WEBP or GIF up to 5MB. Uploaded via signed
                Cloudinary request (folder: variants).
              </p>
            </div>
          </div>
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isUploadingImage ? "Uploading image…" : "Saving variant…"}
            </>
          ) : (
            "Add variant"
          )}
        </Button>
      </div>
    </form>
  )
}
