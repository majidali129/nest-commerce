import type {
  AdminOrdersReturnType,
  OrderReturnType,
  OrdersReturnType,
  UpdateOrderStatusInput,
} from "@repo/contracts"

import { httpClient } from "../client"

export const ordersApi = {
  list: () => httpClient.get<OrdersReturnType>("/orders"),

  getById: (orderId: number) =>
    httpClient.get<OrderReturnType>(`/orders/${orderId}`),

  getBySession: (sessionId: string) =>
    httpClient.get<OrderReturnType>("/orders/by-session", {
      params: { session_id: sessionId },
    }),

  cancelCheckout: (orderId: number) =>
    httpClient.post<OrderReturnType>(`/orders/${orderId}/cancel-checkout`),

  listAdmin: () => httpClient.get<AdminOrdersReturnType>("/orders/admin"),

  getByIdAdmin: (orderId: number) =>
    httpClient.get<OrderReturnType>(`/orders/admin/${orderId}`),

  updateStatusAdmin: (orderId: number, input: UpdateOrderStatusInput) =>
    httpClient.patch<OrderReturnType>(
      `/orders/admin/${orderId}/status`,
      input,
    ),
}
