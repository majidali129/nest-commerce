import type {
  ProductCreateInput,
  ProductCreateReturnType,
  ProductDetailsReturnType,
  ProductUpdateInput,
  ProductUpdateReturnType,
  ProductsQuery,
  ProductsReturnType,
} from "@repo/contracts"
import { httpClient } from "../client"
import { toQueryString } from "#lib/query-string"

export const productsApi = {
  getAll: (query: ProductsQuery = {}) =>
    httpClient.get<ProductsReturnType>(`/products${toQueryString(query)}`),
  getById: (id: number | string) =>
    httpClient.get<ProductDetailsReturnType>(`/products/${id}`),
  create: (input: ProductCreateInput) =>
    httpClient.post<ProductCreateReturnType>("/products", input),
  update: (id: number | string, input: ProductUpdateInput) =>
    httpClient.patch<ProductUpdateReturnType>(`/products/${id}`, input),
  delete: (id: number | string) =>
    httpClient.delete<ProductDetailsReturnType>(`/products/${id}`),
}
