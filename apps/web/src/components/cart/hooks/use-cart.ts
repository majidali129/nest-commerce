import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  AddToCartInput,
  CartReturnType,
  RemoveCartItemsInput,
  UpdateCartItemInput,
} from "@repo/contracts"
import { toast } from "sonner"

import type { ApiError } from "#api/client"
import { cartApi } from "#api/services/cart"
import { useCurrentUser } from "#hooks/use-current-user"
import { queryKeys } from "../../../query-keys"

export function useCart() {
  const { isAuthenticated } = useCurrentUser()

  const query = useQuery({
    queryKey: queryKeys.shop.cart,
    queryFn: cartApi.get,
    enabled: isAuthenticated,
  })

  return {
    cart: query.data ?? null,
    isLoadingCart: query.isLoading,
    isCartError: query.isError,
    cartError: query.error as ApiError | null,
    refetchCart: query.refetch,
  }
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  const mutation = useMutation<CartReturnType, ApiError, AddToCartInput>({
    mutationFn: cartApi.addItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.shop.cart, cart)
      toast.success("Added to cart")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    addToCart: mutation.mutate,
    addToCartAsync: mutation.mutateAsync,
    isAddingToCart: mutation.isPending,
  }
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    CartReturnType,
    ApiError,
    { itemId: number; input: UpdateCartItemInput },
    { previous: CartReturnType | undefined }
  >({
    mutationFn: ({ itemId, input }) => cartApi.updateItem(itemId, input),
    onMutate: async ({ itemId, input }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.shop.cart })
      const previous = queryClient.getQueryData<CartReturnType>(
        queryKeys.shop.cart,
      )
      if (previous) {
        const items = previous.items.map((item) =>
          item.id === itemId ? { ...item, quantity: input.quantity } : item,
        )
        queryClient.setQueryData<CartReturnType>(queryKeys.shop.cart, {
          ...previous,
          items,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      }
      return { previous }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.shop.cart, ctx.previous)
      }
      toast.error(err.message)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.shop.cart, cart)
    },
  })

  return {
    updateCartItem: mutation.mutate,
    isUpdatingCartItem: mutation.isPending,
  }
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    CartReturnType,
    ApiError,
    number,
    { previous: CartReturnType | undefined }
  >({
    mutationFn: cartApi.removeItem,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.shop.cart })
      const previous = queryClient.getQueryData<CartReturnType>(
        queryKeys.shop.cart,
      )
      if (previous) {
        const items = previous.items.filter((item) => item.id !== itemId)
        queryClient.setQueryData<CartReturnType>(queryKeys.shop.cart, {
          ...previous,
          items,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      }
      return { previous }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.shop.cart, ctx.previous)
      }
      toast.error(err.message)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.shop.cart, cart)
      toast.success("Item removed")
    },
  })

  return {
    removeCartItem: mutation.mutate,
    isRemovingCartItem: mutation.isPending,
  }
}

export function useRemoveCartItems() {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    CartReturnType,
    ApiError,
    RemoveCartItemsInput,
    { previous: CartReturnType | undefined }
  >({
    mutationFn: cartApi.removeItems,
    onMutate: async ({ itemIds }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.shop.cart })
      const previous = queryClient.getQueryData<CartReturnType>(
        queryKeys.shop.cart,
      )
      if (previous) {
        const idSet = new Set(itemIds)
        const items = previous.items.filter((item) => !idSet.has(item.id))
        queryClient.setQueryData<CartReturnType>(queryKeys.shop.cart, {
          ...previous,
          items,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })
      }
      return { previous }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.shop.cart, ctx.previous)
      }
      toast.error(err.message)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.shop.cart, cart)
      toast.success("Selected items removed")
    },
  })

  return {
    removeCartItems: mutation.mutate,
    isRemovingCartItems: mutation.isPending,
  }
}

