import { useMutation } from "@tanstack/react-query"
import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionReturnType,
} from "@repo/contracts"
import { toast } from "sonner"

import type { ApiError } from "#api/client"
import { paymentsApi } from "#api/services/payments"
import { queryKeys } from "../query-keys"

export function useCreateCheckoutSession() {
  const mutation = useMutation<
    CreateCheckoutSessionReturnType,
    ApiError,
    CreateCheckoutSessionInput
  >({
    mutationKey: queryKeys.shop.payments.createSession,
    mutationFn: paymentsApi.createCheckoutSession,
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return {
    createCheckoutSession: mutation.mutate,
    createCheckoutSessionAsync: mutation.mutateAsync,
    isCreatingCheckoutSession: mutation.isPending,
  }
}
