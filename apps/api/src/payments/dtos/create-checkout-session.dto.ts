import { IsInt, IsNotEmpty, IsPositive } from 'class-validator'

export class CreateCheckoutSessionDto {
  @IsInt({ message: 'cartId must be an integer' })
  @IsPositive({ message: 'cartId must be a positive number' })
  @IsNotEmpty({ message: 'cartId is required' })
  cartId!: number

  @IsInt({ message: 'addressId must be an integer' })
  @IsPositive({ message: 'addressId must be a positive number' })
  @IsNotEmpty({ message: 'addressId is required' })
  addressId!: number
}
