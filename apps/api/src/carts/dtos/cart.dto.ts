import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator'

export class AddToCartDto {
  @IsInt({ message: 'variantId must be an integer' })
  @IsPositive({ message: 'variantId must be a positive number' })
  @IsNotEmpty({ message: 'variantId is required' })
  variantId!: number

  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  @IsNotEmpty({ message: 'quantity is required' })
  quantity!: number
}

export class UpdateCartItemDto {
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  @IsNotEmpty({ message: 'quantity is required' })
  quantity!: number
}

export class RemoveCartItemsDto {
  @IsArray({ message: 'itemIds must be an array' })
  @ArrayMinSize(1, { message: 'itemIds must include at least one id' })
  @IsInt({ each: true, message: 'each itemId must be an integer' })
  @IsPositive({ each: true, message: 'each itemId must be positive' })
  itemIds!: number[]
}
