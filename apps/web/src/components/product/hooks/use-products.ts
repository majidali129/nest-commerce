import { useQuery } from "@tanstack/react-query"
import {
  PublicationStatus,
  type ProductDetailsReturnType,
  type ProductListItem,
  type ProductsQuery,
  type ProductsReturnType,
} from "@repo/contracts"

import type { ApiError } from "../../../api/client"
import { productsApi } from "../../../api/services/products"
import { normalizeProductDetails } from "../../../lib/mappers/product"
import { queryKeys } from "../../../query-keys"

const emptyMeta = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
}

export function useProducts(
  query: ProductsQuery = {},
  options?: { enabled?: boolean },
) {
  const listQuery = useQuery<ProductsReturnType, ApiError>({
    queryKey: queryKeys.shop.products.list(query),
    queryFn: () => productsApi.getAll(query),
    placeholderData: (previous) => previous,
    enabled: options?.enabled ?? true,
  })

  return {
    products: listQuery.data?.items ?? [],
    meta: listQuery.data?.meta ?? emptyMeta,
    isLoadingProducts: listQuery.isPending,
    isFetchingProducts: listQuery.isFetching,
    isProductsError: listQuery.isError,
    productsError: listQuery.error,
    refetchProducts: listQuery.refetch,
  }
}

export function useProduct(productIdOrSlug: string) {
  const numericId = Number(productIdOrSlug)
  const canFetchById = Number.isFinite(numericId) && numericId > 0

  const slugLookup = useQuery<ProductListItem | null, ApiError>({
    queryKey: queryKeys.shop.products.detail(`slug:${productIdOrSlug}`),
    queryFn: async () => {
      const result = await productsApi.getAll({
        q: productIdOrSlug,
        limit: 20,
        publicationStatus: PublicationStatus.PUBLISHED,
      })
      return (
        result.items.find(
          (item) =>
            item.slug === productIdOrSlug || String(item.id) === productIdOrSlug,
        ) ?? null
      )
    },
    enabled: !canFetchById && Boolean(productIdOrSlug),
  })

  const resolvedId = canFetchById ? numericId : (slugLookup.data?.id ?? null)

  const detailQuery = useQuery<ProductDetailsReturnType, ApiError>({
    queryKey: queryKeys.shop.products.detail(
      String(resolvedId ?? productIdOrSlug),
    ),
    queryFn: async () => {
      const raw = await productsApi.getById(resolvedId!)
      return normalizeProductDetails(raw)
    },
    enabled: resolvedId != null,
  })

  const product = detailQuery.data ?? null

  const relatedQuery = useProducts(
    {
      categoryId: product?.category.id,
      publicationStatus: PublicationStatus.PUBLISHED,
      limit: 5,
      page: 1,
    },
    { enabled: Boolean(product) },
  )

  const relatedProducts = product
    ? relatedQuery.products
        .filter((item) => item.id !== product.id)
        .slice(0, 4)
    : []

  const isLoading =
    (!canFetchById && slugLookup.isPending) ||
    (resolvedId != null && detailQuery.isPending)

  const isError =
    (!canFetchById && slugLookup.isError) ||
    (resolvedId != null && detailQuery.isError) ||
    (!canFetchById && !slugLookup.isPending && slugLookup.data === null)

  return {
    product,
    isLoadingProduct: isLoading,
    isProductError: isError,
    productError: detailQuery.error ?? slugLookup.error,
    relatedProducts,
  }
}
