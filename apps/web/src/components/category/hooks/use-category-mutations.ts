import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import type {
  CategoryCreateInput,
  CategoryCreateReturnType,
  CategoryDeleteReturnType,
  CategoryUpdateInput,
  CategoryUpdateReturnType,
} from "@repo/contracts"

import type { ApiError } from "../../../api/client"
import { categoriesApi } from "../../../api/services/categories"
import { queryKeys } from "../../../query-keys"

async function invalidateCategories(
  queryClient: ReturnType<typeof useQueryClient>,
  detailId?: string | number,
) {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.shop.categories.all,
  })
  if (detailId != null) {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.categories.detail(String(detailId)),
    })
  }
}

export function useCreateCategory() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync: createCategory, isPending: isCreatingCategory } =
    useMutation<CategoryCreateReturnType, ApiError, CategoryCreateInput>({
      mutationKey: queryKeys.shop.categories.create,
      mutationFn: categoriesApi.create,
      onSuccess: async (data) => {
        toast.success("Category created successfully")
        await invalidateCategories(queryClient, data.id)
        navigate("/admin/categories", { replace: true })
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create category")
      },
    })

  return { createCategory, isCreatingCategory }
}

export function useUpdateCategory(categoryId: number | string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } =
    useMutation<CategoryUpdateReturnType, ApiError, CategoryUpdateInput>({
      mutationKey: queryKeys.shop.categories.update(categoryId),
      mutationFn: (input) => categoriesApi.update(categoryId, input),
      onSuccess: async (data) => {
        toast.success("Category updated successfully")
        await invalidateCategories(queryClient, data.id)
        navigate("/admin/categories", { replace: true })
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update category")
      },
    })

  return { updateCategory, isUpdatingCategory }
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  const {
    mutate: deleteCategory,
    isPending: isDeletingCategory,
    variables: deletingCategoryId,
  } = useMutation<CategoryDeleteReturnType, ApiError, number | string>({
    mutationKey: ["categories", "delete"],
    mutationFn: (id) => categoriesApi.delete(id),
    onSuccess: async (_data, id) => {
      toast.success("Category deleted successfully")
      await invalidateCategories(queryClient, id)
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete category")
    },
  })

  return { deleteCategory, isDeletingCategory, deletingCategoryId }
}
