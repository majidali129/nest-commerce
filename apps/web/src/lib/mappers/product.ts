import {
  PublicationStatus,
  StockStatusFilter,
  type ProductDetailsReturnType,
  type Variant,
  type VariantStatus,
} from "@repo/contracts"

/** Normalize Nest entity / details payload → `ProductDetailsReturnType`. */
export function normalizeProductDetails(
  raw: ProductDetailsReturnType | Record<string, unknown>,
): ProductDetailsReturnType {
  const entity = raw as {
    id: number
    name: string
    slug: string
    shortDescription?: string
    description?: string
    publicationStatus?: PublicationStatus
    isFeatured?: boolean
    category?: { id: number; name: string }
    categoryId?: number
    variants?: Array<Variant | Record<string, unknown>>
    createdAt: string
    updatedAt: string
  }

  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    shortDescription: entity.shortDescription ?? "",
    description: entity.description ?? "",
    category: entity.category ?? {
      id: entity.categoryId ?? 0,
      name: "Uncategorized",
    },
    publicationStatus: entity.publicationStatus ?? PublicationStatus.DRAFT,
    isFeatured: Boolean(entity.isFeatured),
    variants: (entity.variants ?? []).map((v) => normalizeVariant(v, entity.id)),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

export function normalizeVariant(
  raw: Variant | Record<string, unknown>,
  fallbackProductId = 0,
): Variant {
  const v = raw as Variant & {
    stockOnHand?: number
    reservedStock?: number
  }

  return {
    id: Number(v.id),
    productId: Number(v.productId ?? fallbackProductId),
    price: Number(v.price),
    discountPercentage: Number(v.discountPercentage ?? 0),
    status: (v.status ?? "active") as VariantStatus,
    sku: String(v.sku),
    stock:
      typeof v.stock === "number"
        ? v.stock
        : Number(v.stockOnHand ?? 0) - Number(v.reservedStock ?? 0),
    media: v.media ?? null,
    isDefault: Boolean(v.isDefault),
    attributes: v.attributes ?? null,
  }
}

export function stockStatusFromCount(stock: number): StockStatusFilter {
  if (stock <= 0) return StockStatusFilter.OUT_OF_STOCK
  if (stock <= 5) return StockStatusFilter.LOW_STOCK
  return StockStatusFilter.IN_STOCK
}

export function compareAtFromDiscount(
  price: number,
  discountPercentage: number,
): number | undefined {
  if (discountPercentage <= 0) return undefined
  return Math.round(price / (1 - discountPercentage / 100))
}
