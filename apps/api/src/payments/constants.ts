export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY'

export enum StripePaymentMethodType {
  CARD = 'card',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
