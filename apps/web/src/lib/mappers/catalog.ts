import type {
  CategoryListItem,
  ProductDetailsReturnType,
  ProductListItem,
  Variant,
} from "@repo/contracts"
import type { Category, Product, ProductImage, StockStatus } from "#lib/types"

export function productImagePlaceholder(seed: string, alt?: string): ProductImage {
  return {
    id: `ph-${seed}`,
    url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`,
    alt: alt ?? seed,
    is_primary: true,
    sort_order: 0,
  }
}

export function categoryImagePlaceholder(seed: string): string {
  return `https://picsum.photos/seed/cat-${encodeURIComponent(seed)}/640/480`
}

function stockStatusFromCount(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock"
  if (stock <= 5) return "low_stock"
  return "in_stock"
}

function compareAtFromDiscount(price: number, discountPercentage: number) {
  if (discountPercentage <= 0) return undefined
  return Math.round(price / (1 - discountPercentage / 100))
}

function imagesFromVariant(
  variant: Variant | null | undefined,
  seed: string,
  name: string,
): ProductImage[] {
  if (variant?.media?.url) {
    return [
      {
        id: `media-${variant.id}`,
        url: variant.media.url,
        alt: variant.media.altText ?? name,
        is_primary: true,
        sort_order: 0,
      },
    ]
  }
  return [productImagePlaceholder(seed, name)]
}

/** Map list API item → UI Product (temporary placeholders when no media). */
export function mapProductListItem(item: ProductListItem): Product {
  const variant = item.variant
  const price = variant?.price ?? 0
  const discount = variant?.discountPercentage ?? 0
  const stock = variant?.stock ?? 0
  const color = variant?.attributes?.color
  const size = variant?.attributes?.size

  return {
    id: String(item.id),
    slug: item.slug,
    title: item.name,
    short_description: "",
    description: "",
    brand: item.category.name,
    category_id: String(item.category.id),
    product_type: "physical",
    price,
    compare_at_price: compareAtFromDiscount(price, discount),
    discount_percent: discount > 0 ? discount : undefined,
    currency: "USD",
    is_featured: item.isFeatured,
    is_published: item.publicationStatus === "published",
    sku: variant?.sku ?? "",
    stock_status: stockStatusFromCount(stock),
    rating_average: 0,
    rating_count: 0,
    images: imagesFromVariant(variant, item.slug || String(item.id), item.name),
    variants: variant
      ? [
          {
            id: String(variant.id),
            color,
            size,
            sku: variant.sku,
            price: variant.price,
            compare_at_price: compareAtFromDiscount(price, discount),
            discount_percent: discount > 0 ? discount : undefined,
            stock,
            stock_status: stockStatusFromCount(stock),
            image_url: variant.media?.url,
            image_alt: variant.media?.altText ?? item.name,
            is_default: variant.isDefault,
          },
        ]
      : [],
    colors: color ? [color] : [],
    sizes: size ? [size] : [],
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    published_at: item.publicationStatus === "published" ? item.createdAt : null,
  }
}

/** Map category API item → UI Category (temporary image when missing). */
export function mapCategoryListItem(item: CategoryListItem): Category {
  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    description: item.description,
    image_url:
      item.imageUrl ?? categoryImagePlaceholder(item.slug || String(item.id)),
    product_count: item.productsCount,
  }
}

/**
 * Best-effort map for product detail when API returns entity-shaped data
 * or a ProductDetailsReturnType-like payload.
 */
export function mapProductDetail(raw: ProductDetailsReturnType | Record<string, unknown>): Product {
  if ("variants" in raw && Array.isArray(raw.variants) && "name" in raw) {
    const detail = raw as ProductDetailsReturnType
    const toContractVariant = (v: Variant): Variant => {
      const rawVariant = v as Variant & {
        stockOnHand?: number
        reservedStock?: number
      }
      const stock =
        typeof rawVariant.stock === "number"
          ? rawVariant.stock
          : Number(rawVariant.stockOnHand ?? 0) -
            Number(rawVariant.reservedStock ?? 0)
      return { ...rawVariant, stock, isDefault: Boolean(rawVariant.isDefault) }
    }
    const primaryRaw =
      detail.variants.find((v) => v.isDefault) ?? detail.variants[0] ?? null
    const primary = primaryRaw ? toContractVariant(primaryRaw) : null
    const listLike: ProductListItem = {
      id: detail.id,
      name: detail.name,
      slug: detail.slug,
      category: detail.category ?? {
        id: (raw as { categoryId?: number }).categoryId ?? 0,
        name: "Uncategorized",
      },
      publicationStatus: detail.publicationStatus,
      isFeatured: Boolean(detail.isFeatured),
      variant: primary,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    }
    const mapped = mapProductListItem(listLike)
    const variants = detail.variants.map((v) => {
      const raw = v as Variant & {
        stockOnHand?: number
        reservedStock?: number
      }
      const stock =
        typeof raw.stock === "number"
          ? raw.stock
          : Number(raw.stockOnHand ?? 0) - Number(raw.reservedStock ?? 0)
      const discount = raw.discountPercentage ?? 0
      return {
        id: String(raw.id),
        color: raw.attributes?.color,
        size: raw.attributes?.size,
        sku: raw.sku,
        price: raw.price,
        compare_at_price: compareAtFromDiscount(raw.price, discount),
        discount_percent: discount > 0 ? discount : undefined,
        stock,
        stock_status: stockStatusFromCount(stock),
        image_url: raw.media?.url,
        image_alt: raw.media?.altText ?? detail.name,
        is_default: Boolean(raw.isDefault),
      }
    })

    const defaultId =
      detail.variants.find((v) => v.isDefault)?.id ?? detail.variants[0]?.id
    const normalizedVariants = variants.map((v) => ({
      ...v,
      is_default: String(defaultId) === v.id,
    }))

    const images =
      normalizedVariants.length > 0
        ? normalizedVariants.flatMap((v, index) =>
            v.image_url
              ? [
                  {
                    id: v.id,
                    url: v.image_url,
                    alt: v.image_alt ?? detail.name,
                    is_primary: Boolean(v.is_default) || index === 0,
                    sort_order: index,
                  },
                ]
              : [],
          )
        : mapped.images

    return {
      ...mapped,
      short_description: detail.shortDescription,
      description: detail.description,
      images: images.length > 0 ? images : mapped.images,
      variants: normalizedVariants,
      colors: [
        ...new Set(
          normalizedVariants
            .map((v) => v.color)
            .filter((c): c is string => Boolean(c)),
        ),
      ],
      sizes: [
        ...new Set(
          normalizedVariants
            .map((v) => v.size)
            .filter((s): s is string => Boolean(s)),
        ),
      ],
    }
  }

  // Entity-shaped fallback from Nest findOne
  const entity = raw as {
    id: number
    name: string
    slug: string
    shortDescription?: string
    description?: string
    publicationStatus?: ProductListItem["publicationStatus"]
    isFeatured?: boolean
    category?: { id: number; name: string }
    categoryId?: number
    variants?: Array<{
      id: number
      price: number
      discountPercentage: number
      sku: string
      stockOnHand: number
      reservedStock: number
      isDefault?: boolean
      attributes: { size: string; color: string } | null
      media: { url: string; publicId: string; altText: string | null } | null
    }>
    createdAt: string
    updatedAt: string
  }

  const variants = (entity.variants ?? []).map((v) => ({
    id: v.id,
    productId: entity.id,
    price: v.price,
    discountPercentage: v.discountPercentage,
    status: "active" as const,
    sku: v.sku,
    stock: v.stockOnHand - v.reservedStock,
    media: v.media,
    isDefault: Boolean(v.isDefault),
    attributes: v.attributes,
  }))

  return mapProductDetail({
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    shortDescription: entity.shortDescription ?? "",
    description: entity.description ?? "",
    category: entity.category ?? {
      id: entity.categoryId ?? 0,
      name: "Uncategorized",
    },
    publicationStatus: entity.publicationStatus ?? "draft",
    isFeatured: Boolean(entity.isFeatured),
    variants,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  })
}
