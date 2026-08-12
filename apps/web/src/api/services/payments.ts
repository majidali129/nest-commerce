import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionReturnType,
} from "@repo/contracts"

import { httpClient } from "../client"

export const paymentsApi = {
  createCheckoutSession: (input: CreateCheckoutSessionInput) =>
    httpClient.post<CreateCheckoutSessionReturnType>(
      "/payments/create-checkout-session",
      input,
      // { timeout: 20000 },
    ),
}
