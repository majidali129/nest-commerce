import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from 'src/users/user.entity'
import { AddressType } from './constants'

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'recipient_name' })
  recipientName!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  line1!: string

  @Column({ type: 'varchar', length: 120, nullable: false })
  city!: string

  @Column({ type: 'varchar', length: 120, nullable: false })
  state!: string

  @Column({ type: 'varchar', length: 32, nullable: false, name: 'zip_code' })
  zipCode!: string

  @Column({ type: 'varchar', length: 120, nullable: false })
  country!: string

  @Column({
    type: 'enum',
    enum: AddressType,
    nullable: false,
    default: AddressType.SHIPPING,
  })
  type!: AddressType

  @Column({ type: 'boolean', nullable: false, default: false, name: 'is_default' })
  isDefault!: boolean

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt!: Date | null
}
