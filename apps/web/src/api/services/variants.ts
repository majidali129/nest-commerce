import type {
  Variant,
  VariantCreateInput,
  VariantCreateReturnType,
  VariantUpdateInput,
  VariantUpdateReturnType,
} from "@repo/contracts"
import { httpClient } from "../client"

export const variantsApi = {
  getByProductId: (productId: number | string) =>
    httpClient.get<Variant[]>(`/product-variants/product/${productId}`),
  create: (input: VariantCreateInput) =>
    httpClient.post<VariantCreateReturnType>("/product-variants", input),
  update: (id: number | string, input: VariantUpdateInput) =>
    httpClient.patch<VariantUpdateReturnType>(`/product-variants/${id}`, input),
  delete: (id: number | string) =>
    httpClient.delete<Variant>(`/product-variants/${id}`),
}
