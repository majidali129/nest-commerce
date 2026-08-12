import type {
  CategoriesQuery,
  CategoriesReturnType,
  CategoryCreateInput,
  CategoryCreateReturnType,
  CategoryDeleteReturnType,
  CategoryListItem,
  CategoryUpdateInput,
  CategoryUpdateReturnType,
} from "@repo/contracts"
import { httpClient } from "../client"
import { toQueryString } from "#lib/query-string"

export const categoriesApi = {
  getAll: (query: CategoriesQuery = {}) =>
    httpClient.get<CategoriesReturnType>(
      `/product-categories${toQueryString(query)}`,
    ),
  getById: (id: number | string) =>
    httpClient.get<CategoryListItem>(`/product-categories/${id}`),
  create: (input: CategoryCreateInput) =>
    httpClient.post<CategoryCreateReturnType>("/product-categories", input),
  update: (id: number | string, input: CategoryUpdateInput) =>
    httpClient.patch<CategoryUpdateReturnType>(
      `/product-categories/${id}`,
      input,
    ),
  delete: (id: number | string) =>
    httpClient.delete<CategoryDeleteReturnType>(`/product-categories/${id}`),
}
