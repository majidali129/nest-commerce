import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { In, Repository } from 'typeorm'
import type {
  AddToCartInput,
  CartLineItem,
  CartReturnType,
  RemoveCartItemsInput,
  UpdateCartItemInput,
} from '@repo/contracts'
import { PRODUCT_VARIANT_REPOSITORY } from 'src/product-variants/constants'
import { ProductVariant } from 'src/product-variants/product-variant.entity'
import { VariantStatus } from 'src/product-variants/constants'
import { PublicationStatus } from 'src/products/constants'
import {
  CART_ITEM_REPOSITORY,
  CART_REPOSITORY,
  CartStatus,
} from './constants'
import { Cart } from './cart.entity'
import { CartItem } from './cart-item.entity'

@Injectable()
export class CartsService {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepo: Repository<Cart>,
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepo: Repository<CartItem>,
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async getCart(userId: number): Promise<CartReturnType> {
    const cart = await this.getCurrentShopCart(userId)
    return this.toCartReturn(cart)
  }

  async addItem(
    userId: number,
    input: AddToCartInput,
  ): Promise<CartReturnType> {
    const cart = await this.getMutableCart(userId)
    const variant = await this.findPurchasableVariant(input.variantId)
    const available = this.availableStock(variant)
    if (available < 1) {
      throw new BadRequestException(`${this.itemLabel(variant)} is out of stock.`)
    }

    const existing = await this.cartItemRepo.findOne({
      where: { cartId: cart.id, variantId: variant.id },
    })

    const nextQty = (existing?.quantity ?? 0) + input.quantity
    if (nextQty > available) {
      throw new BadRequestException(this.stockMessage(variant, available))
    }

    if (existing) {
      existing.quantity = nextQty
      await this.cartItemRepo.save(existing)
    } else {
      await this.cartItemRepo.save(
        this.cartItemRepo.create({
          cartId: cart.id,
          variantId: variant.id,
          quantity: input.quantity,
        }),
      )
    }

    return this.getCart(userId)
  }

  async updateItem(
    userId: number,
    itemId: number,
    input: UpdateCartItemInput,
  ): Promise<CartReturnType> {
    const cart = await this.getMutableCart(userId)
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cartId: cart.id },
      relations: { variant: { product: true } },
    })
    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    const variant = item.variant
    if (
      !variant ||
      variant.deletedAt ||
      variant.status !== VariantStatus.ACTIVE
    ) {
      throw new BadRequestException(
        `${this.itemLabel(variant)} is no longer available.`,
      )
    }

    const available = this.availableStock(variant)
    if (input.quantity > available) {
      throw new BadRequestException(this.stockMessage(variant, available))
    }

    item.quantity = input.quantity
    await this.cartItemRepo.save(item)
    return this.getCart(userId)
  }

  async removeItem(userId: number, itemId: number): Promise<CartReturnType> {
    const cart = await this.getMutableCart(userId)
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cartId: cart.id },
    })
    if (!item) {
      throw new NotFoundException('Cart item not found')
    }
    await this.cartItemRepo.remove(item)
    return this.getCart(userId)
  }

  async removeItems(
    userId: number,
    input: RemoveCartItemsInput,
  ): Promise<CartReturnType> {
    if (!input.itemIds?.length) {
      throw new BadRequestException('itemIds is required')
    }

    const cart = await this.getMutableCart(userId)
    await this.cartItemRepo.delete({
      cartId: cart.id,
      id: In(input.itemIds),
    })
    return this.getCart(userId)
  }

  async clearCart(userId: number): Promise<CartReturnType> {
    const cart = await this.getMutableCart(userId)
    await this.cartItemRepo.delete({ cartId: cart.id })
    return this.getCart(userId)
  }

  async getActiveCartWithItems(userId: number): Promise<Cart> {
    return this.getOrCreateActiveCart(userId)
  }

  async convertActiveCart(userId: number, orderId: number): Promise<void> {
    const cart =
      (await this.cartRepo.findOne({
        where: { userId, status: CartStatus.CHECKOUT_IN_PROGRESS },
      })) ??
      (await this.cartRepo.findOne({
        where: { userId, status: CartStatus.ACTIVE },
      }))
    if (!cart) return

    cart.status = CartStatus.CONVERTED
    cart.convertedOrderId = orderId
    cart.pendingCheckoutOrderId = null
    await this.cartRepo.save(cart)
  }

  async restoreCheckoutCartToActive(cartId: number): Promise<void> {
    const cart = await this.cartRepo.findOne({ where: { id: cartId } })
    if (!cart || cart.status !== CartStatus.CHECKOUT_IN_PROGRESS) return
    cart.status = CartStatus.ACTIVE
    cart.pendingCheckoutOrderId = null
    await this.cartRepo.save(cart)
  }

  /**
   * Prefer checkout-in-progress cart for display; otherwise active cart.
   */
  async getCurrentShopCart(userId: number): Promise<Cart> {
    const inProgress = await this.cartRepo.findOne({
      where: { userId, status: CartStatus.CHECKOUT_IN_PROGRESS },
      relations: {
        items: {
          variant: {
            product: true,
          },
        },
      },
    })
    if (inProgress) return inProgress
    return this.getOrCreateActiveCart(userId)
  }

  async getOrCreateActiveCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { userId, status: CartStatus.ACTIVE },
      relations: {
        items: {
          variant: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      try {
        cart = await this.cartRepo.save(
          this.cartRepo.create({
            userId,
            status: CartStatus.ACTIVE,
          }),
        )
        cart.items = []
      } catch (error) {
        // Concurrent create of active cart — reload the winner.
        cart = await this.cartRepo.findOne({
          where: { userId, status: CartStatus.ACTIVE },
          relations: {
            items: {
              variant: {
                product: true,
              },
            },
          },
        })
        if (!cart) throw error
      }
    }

    return cart
  }

  private async getMutableCart(userId: number): Promise<Cart> {
    const inProgress = await this.cartRepo.findOne({
      where: { userId, status: CartStatus.CHECKOUT_IN_PROGRESS },
    })
    if (inProgress) {
      throw new ConflictException(
        'Checkout is in progress. Complete or cancel payment before editing your cart.',
      )
    }
    return this.getOrCreateActiveCart(userId)
  }

  private async findPurchasableVariant(
    variantId: number,
  ): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({
      where: { id: variantId, status: VariantStatus.ACTIVE },
      relations: { product: true },
    })

    if (!variant || variant.deletedAt) {
      throw new NotFoundException('Variant not found')
    }

    if (
      !variant.product ||
      variant.product.deletedAt ||
      variant.product.publicationStatus !== PublicationStatus.PUBLISHED
    ) {
      throw new BadRequestException(
        `${this.itemLabel(variant)} is no longer available.`,
      )
    }

    return variant
  }

  private itemLabel(variant?: ProductVariant | null): string {
    const name = variant?.product?.name?.trim()
    const color = variant?.attributes?.color?.trim()
    const size = variant?.attributes?.size?.trim()
    const details = [color, size].filter(Boolean).join(', ')
    if (name && details) return `${name} (${details})`
    if (name) return name
    return 'This item'
  }

  private stockMessage(variant: ProductVariant, available: number): string {
    const label = this.itemLabel(variant)
    if (available < 1) return `${label} is out of stock.`
    return `Only ${available} left for ${label}. Update your quantity to continue.`
  }

  private availableStock(variant: ProductVariant): number {
    return Math.max(0, variant.stockOnHand - variant.reservedStock)
  }

  private toCartReturn(cart: Cart): CartReturnType {
    const items: CartLineItem[] = (cart.items ?? [])
      .filter((item) => item.variant && !item.variant.deletedAt)
      .map((item) => this.toLineItem(item))
      .sort((a, b) => a.id - b.id)

    return {
      id: cart.id,
      status: cart.status as CartReturnType['status'],
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    }
  }

  private toLineItem(item: CartItem): CartLineItem {
    const variant = item.variant
    const product = variant.product
    return {
      id: item.id,
      variantId: variant.id,
      productId: product?.id ?? variant.productId,
      quantity: item.quantity,
      title: product?.name ?? 'Product',
      imageUrl: variant.media?.url ?? null,
      price: variant.price,
      stock: this.availableStock(variant),
      sku: variant.sku,
      color: variant.attributes?.color ?? null,
      size: variant.attributes?.size ?? null,
    }
  }
}
