import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
  ProductCreateInput,
  ProductCreateReturnType,
  ProductDetailsReturnType,
  ProductUpdateInput,
  ProductUpdateReturnType,
  VariantCreateInput,
  VariantCreateReturnType,
  VariantUpdateInput,
  VariantUpdateReturnType,
} from "@repo/contracts"

import type { ApiError } from "../../../api/client"
import { productsApi } from "../../../api/services/products"
import { variantsApi } from "../../../api/services/variants"
import { queryKeys } from "../../../query-keys"

async function invalidateProducts(
  queryClient: ReturnType<typeof useQueryClient>,
  detailId?: string | number,
) {
  await queryClient.invalidateQueries({
    queryKey: queryKeys.shop.products.all,
  })
  if (detailId != null) {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.products.detail(String(detailId)),
    })
    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.products.variants.byProduct(detailId),
    })
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  const { mutateAsync: createProduct, isPending: isCreatingProduct } =
    useMutation<ProductCreateReturnType, ApiError, ProductCreateInput>({
      mutationKey: queryKeys.shop.products.create,
      mutationFn: productsApi.create,
      onSuccess: async (data) => {
        toast.success("Product created — now add at least one variant")
        await invalidateProducts(queryClient, data.id)
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create product")
      },
    })

  return { createProduct, isCreatingProduct }
}

export function useUpdateProduct(productId: number | string) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
    useMutation<ProductUpdateReturnType, ApiError, ProductUpdateInput>({
      mutationKey: queryKeys.shop.products.update(productId),
      mutationFn: (input) => productsApi.update(productId, input),
      onSuccess: async () => {
        toast.success("Product updated successfully")
        await invalidateProducts(queryClient, productId)
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update product")
      },
    })

  return { updateProduct, isUpdatingProduct }
}

export function useCreateVariant(productId: number) {
  const queryClient = useQueryClient()

  const { mutateAsync: createVariant, isPending: isCreatingVariant } =
    useMutation<VariantCreateReturnType, ApiError, VariantCreateInput>({
      mutationKey: queryKeys.shop.products.variants.create(productId),
      mutationFn: variantsApi.create,
      onSuccess: async () => {
        toast.success("Variant added")
        await invalidateProducts(queryClient, productId)
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create variant")
      },
    })

  return { createVariant, isCreatingVariant }
}

export function useUpdateVariant(productId: number) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateVariant, isPending: isUpdatingVariant } =
    useMutation<
      VariantUpdateReturnType,
      ApiError,
      { id: number | string; input: VariantUpdateInput }
    >({
      mutationFn: ({ id, input }) => variantsApi.update(id, input),
      onSuccess: async () => {
        toast.success("Variant updated")
        await invalidateProducts(queryClient, productId)
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update variant")
      },
    })

  return { updateVariant, isUpdatingVariant }
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  const {
    mutate: deleteProduct,
    isPending: isDeletingProduct,
    variables: deletingProductId,
  } = useMutation<ProductDetailsReturnType, ApiError, number | string>({
    mutationKey: ["products", "delete"],
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: async (_data, id) => {
      toast.success("Product deleted successfully")
      await invalidateProducts(queryClient, id)
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete product")
    },
  })

  return { deleteProduct, isDeletingProduct, deletingProductId }
}
