import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from 'src/users/user.entity'
import { OrderStatus } from './constants'
import type { OrderAddressSnapshot } from './constants'
import { OrderItem } from './order-item.entity'

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId!: number

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
    name: 'order_number',
  })
  orderNumber!: string

  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: false,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus

  @Column({ type: 'int', nullable: false, name: 'total_amount' })
  totalAmount!: number

  @Column({ type: 'varchar', length: 8, nullable: false, default: 'usd' })
  currency!: string

  @Column({ type: 'jsonb', nullable: false, name: 'shipping_address' })
  shippingAddress!: OrderAddressSnapshot

  @Column({ type: 'jsonb', nullable: true, name: 'billing_address' })
  billingAddress!: OrderAddressSnapshot | null

  @Column({ type: 'int', nullable: true, name: 'cart_id' })
  cartId!: number | null

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'stripe_checkout_session_id',
  })
  stripeCheckoutSessionId!: string | null

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'stripe_payment_intent_id',
  })
  stripePaymentIntentId!: string | null

  @Column({ type: 'text', nullable: true })
  notes!: string | null

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[]

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt!: Date
}
