import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from 'src/users/user.entity'
import { CartStatus } from './constants'
import { CartItem } from './cart-item.entity'

@Entity({ name: 'carts' })
@Index('uq_carts_one_active_per_user', ['userId'], {
  unique: true,
  where: `"status" = 'active' AND "deleted_at" IS NULL`,
})
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({
    type: 'enum',
    enum: CartStatus,
    nullable: false,
    default: CartStatus.ACTIVE,
  })
  status!: CartStatus

  @Column({ type: 'int', nullable: true, name: 'converted_order_id' })
  convertedOrderId!: number | null

  @Column({ type: 'int', nullable: true, name: 'pending_checkout_order_id' })
  pendingCheckoutOrderId!: number | null

  @Column({ type: 'timestamptz', nullable: true, name: 'expires_at' })
  expiresAt!: Date | null

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items!: CartItem[]

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null
}
