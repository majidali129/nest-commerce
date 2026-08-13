import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  AdminOrdersReturnType,
  OrderReturnType,
  OrdersReturnType,
  UpdateOrderStatusInput,
} from "@repo/contracts"
import { toast } from "sonner"

import type { ApiError } from "#api/client"
import { ordersApi } from "#api/services/orders"
import { queryKeys } from "../../../query-keys"

export function useOrders() {
  const query = useQuery<OrdersReturnType, ApiError>({
    queryKey: queryKeys.shop.orders.list,
    queryFn: ordersApi.list,
  })

  return {
    orders: query.data?.items ?? [],
    isLoadingOrders: query.isPending,
    isOrdersError: query.isError,
    ordersError: query.error,
    refetchOrders: query.refetch,
  }
}

export function useOrder(orderId: number | null) {
  const query = useQuery<OrderReturnType, ApiError>({
    queryKey: queryKeys.shop.orders.detail(orderId ?? 0),
    queryFn: () => ordersApi.getById(orderId!),
    enabled: orderId != null && orderId > 0,
  })

  return {
    order: query.data ?? null,
    isLoadingOrder: query.isPending,
    isOrderError: query.isError,
    orderError: query.error,
  }
}

export function useOrderBySession(sessionId: string | null) {
  const query = useQuery<OrderReturnType, ApiError>({
    queryKey: queryKeys.shop.orders.bySession(sessionId ?? ""),
    queryFn: () => ordersApi.getBySession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: (q) => {
      const status = q.state.data?.status
      if (status === "pending") return 2000
      return false
    },
  })

  return {
    order: query.data ?? null,
    isLoadingOrder: query.isPending,
    orderError: query.error,
  }
}

export function useCancelCheckout() {
  const queryClient = useQueryClient()
  const mutation = useMutation<OrderReturnType, ApiError, number>({
    mutationKey: queryKeys.shop.orders.cancelCheckout,
    mutationFn: ordersApi.cancelCheckout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.shop.cart })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shop.orders.all,
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    cancelCheckout: mutation.mutate,
    cancelCheckoutAsync: mutation.mutateAsync,
    isCancellingCheckout: mutation.isPending,
  }
}

export function useAdminOrders() {
  const query = useQuery<AdminOrdersReturnType, ApiError>({
    queryKey: queryKeys.shop.orders.admin.list,
    queryFn: ordersApi.listAdmin,
  })

  return {
    orders: query.data?.items ?? [],
    isLoadingOrders: query.isPending,
    isOrdersError: query.isError,
    ordersError: query.error,
    refetchOrders: query.refetch,
  }
}

export function useAdminOrder(orderId: number | null) {
  const query = useQuery<OrderReturnType, ApiError>({
    queryKey: queryKeys.shop.orders.admin.detail(orderId ?? 0),
    queryFn: () => ordersApi.getByIdAdmin(orderId!),
    enabled: orderId != null && orderId > 0,
  })

  return {
    order: query.data ?? null,
    isLoadingOrder: query.isPending,
    isOrderError: query.isError,
    orderError: query.error,
    refetchOrder: query.refetch,
  }
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const mutation = useMutation<
    OrderReturnType,
    ApiError,
    { orderId: number; input: UpdateOrderStatusInput }
  >({
    mutationKey: queryKeys.shop.orders.admin.updateStatus,
    mutationFn: ({ orderId, input }) =>
      ordersApi.updateStatusAdmin(orderId, input),
    onSuccess: async (order) => {
      toast.success(`Order marked as ${order.status}`)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shop.orders.admin.all,
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shop.orders.all,
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    updateOrderStatus: mutation.mutate,
    updateOrderStatusAsync: mutation.mutateAsync,
    isUpdatingOrderStatus: mutation.isPending,
  }
}
