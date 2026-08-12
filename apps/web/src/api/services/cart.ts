import type {
  AddToCartInput,
  CartReturnType,
  RemoveCartItemsInput,
  UpdateCartItemInput,
} from "@repo/contracts"
import { httpClient } from "../client"

export const cartApi = {
  get: () => httpClient.get<CartReturnType>("/cart"),
  addItem: (input: AddToCartInput) =>
    httpClient.post<CartReturnType>("/cart/items", input),
  updateItem: (itemId: number, input: UpdateCartItemInput) =>
    httpClient.patch<CartReturnType>(`/cart/items/${itemId}`, input),
  removeItem: (itemId: number) =>
    httpClient.delete<CartReturnType>(`/cart/items/${itemId}`),
  removeItems: (input: RemoveCartItemsInput) =>
    httpClient.post<CartReturnType>("/cart/items/remove", input),
  clear: () => httpClient.delete<CartReturnType>("/cart"),
}
