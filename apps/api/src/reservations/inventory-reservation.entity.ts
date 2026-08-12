import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Cart } from 'src/carts/cart.entity'
import { Order } from 'src/orders/order.entity'
import { Product } from 'src/products/product.entity'
import { ProductVariant } from 'src/product-variants/product-variant.entity'
import { ReservationStatus, ReservationType } from './constants'

@Entity({ name: 'inventory_reservations' })
export class InventoryReservation {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'product_id' })
  productId!: number

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product!: Product

  @Column({ type: 'int', nullable: false, name: 'variant_id' })
  variantId!: number

  @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariant

  @Column({ type: 'int', nullable: true, name: 'cart_id' })
  cartId!: number | null

  @ManyToOne(() => Cart, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart | null

  @Column({ type: 'int', nullable: true, name: 'order_id' })
  orderId!: number | null

  @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'order_id' })
  order!: Order | null

  @Column({ type: 'int', nullable: false })
  quantity!: number

  @CreateDateColumn({ nullable: false, name: 'reserved_at' })
  reservedAt!: Date

  @Column({ type: 'timestamptz', nullable: false, name: 'expires_at' })
  expiresAt!: Date

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    nullable: false,
    default: ReservationStatus.ACTIVE,
  })
  status!: ReservationStatus

  @Column({
    type: 'enum',
    enum: ReservationType,
    nullable: false,
    name: 'reservation_type',
  })
  reservationType!: ReservationType
}
