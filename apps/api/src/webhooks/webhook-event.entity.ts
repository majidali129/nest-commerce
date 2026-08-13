import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from 'src/orders/order.entity'

@Entity({ name: 'webhook_events' })
export class WebhookEvent {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
    name: 'stripe_event_id',
  })
  stripeEventId!: string

  @Column({ type: 'varchar', length: 120, nullable: false, name: 'event_type' })
  eventType!: string

  @Column({ type: 'boolean', nullable: false, default: false })
  processed!: boolean

  @Column({ type: 'timestamptz', nullable: true, name: 'processed_at' })
  processedAt!: Date | null

  @Column({ type: 'int', nullable: true, name: 'order_id' })
  orderId!: number | null

  @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'order_id' })
  order!: Order | null

  @Column({ type: 'jsonb', nullable: false, name: 'raw_data' })
  rawData!: Record<string, unknown>

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'int', nullable: false, default: 0 })
  attempts!: number

  @Column({ type: 'timestamptz', nullable: true, name: 'last_attempt_at' })
  lastAttemptAt!: Date | null

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage!: string | null
}
