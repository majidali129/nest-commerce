export const INVENTORY_RESERVATION_REPOSITORY =
  'INVENTORY_RESERVATION_REPOSITORY'

/** Checkout reservation TTL in minutes (aligned with Stripe Checkout default). */
export const RESERVATION_TTL_MINUTES = 30

export enum ReservationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  RELEASED = 'released',
  FULFILLED = 'fulfilled',
}

export enum ReservationType {
  CART = 'cart',
  CHECKOUT = 'checkout',
  PAYMENT_PROCESSING = 'payment_processing',
}
