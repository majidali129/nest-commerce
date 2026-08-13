export const CART_REPOSITORY = 'CART_REPOSITORY'
export const CART_ITEM_REPOSITORY = 'CART_ITEM_REPOSITORY'

export enum CartStatus {
  ACTIVE = 'active',
  CHECKOUT_IN_PROGRESS = 'checkout_in_progress',
  CONVERTED = 'converted',
  EXPIRED = 'expired',
}
