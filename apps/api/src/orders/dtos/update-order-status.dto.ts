import { IsEnum, IsNotEmpty } from 'class-validator'
import { OrderStatus } from '../constants'

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: `status must be one of: ${Object.values(OrderStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'status is required' })
  status!: OrderStatus
}
