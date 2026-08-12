import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from 'src/orders/order.entity'
import { PaymentStatus } from './constants'

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'order_id' })
  orderId!: number

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order

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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'stripe_charge_id',
  })
  stripeChargeId!: string | null

  @Column({ type: 'text', nullable: true, name: 'failure_message' })
  failureMessage!: string | null

  @Column({ type: 'int', nullable: false })
  amount!: number

  @Column({ type: 'varchar', length: 8, nullable: false, default: 'usd' })
  currency!: string

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    nullable: false,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    name: 'payment_method',
  })
  paymentMethod!: string | null

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'timestamptz', nullable: true, name: 'paid_at' })
  paidAt!: Date | null

  @Column({ type: 'int', nullable: false, default: 0, name: 'refunded_amount' })
  refundedAmount!: number
}
