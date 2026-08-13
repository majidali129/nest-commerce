import { useQuery } from "@tanstack/react-query"
import type {
  CategoriesQuery,
  CategoriesReturnType,
  CategoryListItem,
} from "@repo/contracts"
import { categoriesApi } from "../../../api/services/categories"
import type { ApiError } from "../../../api/client"
import { queryKeys } from "../../../query-keys"

const emptyMeta = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
}

export function useCategories(
  query: CategoriesQuery = {},
  options?: { enabled?: boolean },
) {
  const listQuery = useQuery<CategoriesReturnType, ApiError>({
    queryKey: queryKeys.shop.categories.list(query),
    queryFn: () => categoriesApi.getAll(query),
    placeholderData: (previous) => previous,
    enabled: options?.enabled ?? true,
  })

  return {
    categories: listQuery.data?.items ?? [],
    meta: listQuery.data?.meta ?? emptyMeta,
    isLoadingCategories: listQuery.isPending,
    isFetchingCategories: listQuery.isFetching,
    isCategoriesError: listQuery.isError,
    categoriesError: listQuery.error,
    refetchCategories: listQuery.refetch,
  }
}

export function useCategory(categoryId: string | number) {
  const numericId = Number(categoryId)
  const canFetchById = Number.isFinite(numericId) && numericId > 0

  const detailQuery = useQuery<CategoryListItem, ApiError>({
    queryKey: queryKeys.shop.categories.detail(String(categoryId)),
    queryFn: () => categoriesApi.getById(numericId),
    enabled: canFetchById,
  })

  const slugFallback = useCategories(
    { q: String(categoryId), limit: 20 },
    { enabled: !canFetchById && Boolean(categoryId) },
  )

  const category = canFetchById
    ? (detailQuery.data ?? null)
    : (slugFallback.categories.find(
        (item) => item.slug === String(categoryId),
      ) ?? null)

  return {
    category,
    isLoadingCategory: canFetchById
      ? detailQuery.isPending
      : slugFallback.isLoadingCategories,
    isCategoryError: canFetchById
      ? detailQuery.isError
      : slugFallback.isCategoriesError && !category,
    categoryError: canFetchById
      ? detailQuery.error
      : slugFallback.categoriesError,
  }
}
