import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { AddressType } from '../constants'

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'recipientName is required' })
  @MaxLength(255)
  recipientName!: string

  @IsEmail({}, { message: 'email must be valid' })
  @IsNotEmpty({ message: 'email is required' })
  email!: string

  @IsString()
  @IsNotEmpty({ message: 'phone is required' })
  @MaxLength(50)
  phone!: string

  @IsString()
  @IsNotEmpty({ message: 'line1 is required' })
  @MaxLength(255)
  line1!: string

  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  @MaxLength(120)
  city!: string

  @IsString()
  @IsNotEmpty({ message: 'state is required' })
  @MaxLength(120)
  state!: string

  @IsString()
  @IsNotEmpty({ message: 'zipCode is required' })
  @MaxLength(32)
  zipCode!: string

  @IsString()
  @IsNotEmpty({ message: 'country is required' })
  @MaxLength(120)
  country!: string

  @IsOptional()
  @IsEnum(AddressType, {
    message: `type must be one of: ${Object.values(AddressType).join(', ')}`,
  })
  type?: AddressType

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  recipientName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  line1?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  state?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  zipCode?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  country?: string

  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}
