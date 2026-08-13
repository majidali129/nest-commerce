import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  AddressCreateInput,
  AddressReturnType,
  AddressUpdateInput,
} from "@repo/contracts"
import { toast } from "sonner"

import type { ApiError } from "#api/client"
import { addressesApi } from "#api/services/addresses"
import { useCurrentUser } from "#hooks/use-current-user"
import { queryKeys } from "../../../query-keys"

export function useAddresses() {
  const { isAuthenticated } = useCurrentUser()

  const query = useQuery({
    queryKey: queryKeys.shop.addresses.list,
    queryFn: addressesApi.list,
    enabled: isAuthenticated,
  })

  return {
    addresses: query.data ?? [],
    isLoadingAddresses: query.isLoading,
    isAddressesError: query.isError,
    addressesError: query.error as ApiError | null,
  }
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  const mutation = useMutation<AddressReturnType, ApiError, AddressCreateInput>({
    mutationFn: addressesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shop.addresses.all,
      })
      toast.success("Address saved")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    createAddress: mutation.mutate,
    createAddressAsync: mutation.mutateAsync,
    isCreatingAddress: mutation.isPending,
  }
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    AddressReturnType,
    ApiError,
    { id: number; input: AddressUpdateInput }
  >({
    mutationFn: ({ id, input }) => addressesApi.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shop.addresses.all,
      })
      toast.success("Address updated")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    updateAddress: mutation.mutate,
    updateAddressAsync: mutation.mutateAsync,
    isUpdatingAddress: mutation.isPending,
  }
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient()

  const mutation = useMutation<AddressReturnType, ApiError, number>({
    mutationFn: addressesApi.setDefault,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shop.addresses.all,
      })
      toast.success("Default address updated")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    setDefaultAddress: mutation.mutate,
    isSettingDefaultAddress: mutation.isPending,
  }
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  const mutation = useMutation<AddressReturnType, ApiError, number>({
    mutationFn: addressesApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.shop.addresses.all,
      })
      toast.success("Address deleted")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    deleteAddress: mutation.mutate,
    isDeletingAddress: mutation.isPending,
  }
}

