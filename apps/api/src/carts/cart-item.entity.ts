import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { ProductVariant } from 'src/product-variants/product-variant.entity'
import { Cart } from './cart.entity'

@Entity({ name: 'cart_items' })
@Unique(['cartId', 'variantId'])
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'cart_id' })
  cartId!: number

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart

  @Column({ type: 'int', nullable: false, name: 'variant_id' })
  variantId!: number

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariant

  @Column({ type: 'int', nullable: false, default: 1 })
  quantity!: number

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt!: Date
}
