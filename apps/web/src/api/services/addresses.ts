import type {
  AddressCreateInput,
  AddressReturnType,
  AddressUpdateInput,
  AddressesReturnType,
} from "@repo/contracts"
import { httpClient } from "../client"

export const addressesApi = {
  list: () => httpClient.get<AddressesReturnType>("/addresses"),
  create: (input: AddressCreateInput) =>
    httpClient.post<AddressReturnType>("/addresses", input),
  update: (id: number, input: AddressUpdateInput) =>
    httpClient.patch<AddressReturnType>(`/addresses/${id}`, input),
  setDefault: (id: number) =>
    httpClient.post<AddressReturnType>(`/addresses/${id}/default`),
  remove: (id: number) =>
    httpClient.delete<AddressReturnType>(`/addresses/${id}`),
}
