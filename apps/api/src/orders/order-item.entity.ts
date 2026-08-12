import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Product } from 'src/products/product.entity'
import { ProductVariant } from 'src/product-variants/product-variant.entity'
import type { OrderProductSnapshot } from './constants'
import { Order } from './order.entity'

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'order_id' })
  orderId!: number

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order

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

  @Column({ type: 'int', nullable: false })
  quantity!: number

  @Column({ type: 'int', nullable: false, name: 'unit_price' })
  unitPrice!: number

  @Column({ type: 'int', nullable: false, name: 'total_price' })
  totalPrice!: number

  @Column({ type: 'jsonb', nullable: false, name: 'product_snapshot' })
  productSnapshot!: OrderProductSnapshot
}
