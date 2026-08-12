import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VariantStatus } from '../constants';

class VariantAttributesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  size!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  color!: string;
}

class VariantMediaDto {
  @IsUrl({}, { message: 'media.url must be a valid URL' })
  url!: string;

  @IsString()
  @IsNotEmpty({ message: 'media.publicId is required' })
  @MaxLength(500)
  publicId!: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(255)
  altText?: string | null;
}

export class CreateVariantDto {
  @IsInt({ message: 'productId must be an integer' })
  @IsPositive({ message: 'productId must be a positive number' })
  @IsNotEmpty({ message: 'productId is required' })
  productId!: number;

  @IsInt({ message: 'price must be an integer (e.g. cents)' })
  @Min(0, { message: 'price cannot be negative' })
  @IsNotEmpty({ message: 'price is required' })
  price!: number;

  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  @MaxLength(255)
  sku!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1_000_000)
  stockOnHand?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsOptional()
  @IsEnum(VariantStatus, {
    message: `status must be one of: ${Object.values(VariantStatus).join(', ')}`,
  })
  status?: VariantStatus;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @ValidateNested()
  @Type(() => VariantAttributesDto)
  attributes?: VariantAttributesDto;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @ValidateNested()
  @Type(() => VariantMediaDto)
  media?: VariantMediaDto;

  @IsOptional()
  @IsBoolean({ message: 'isDefault must be a boolean' })
  isDefault?: boolean;
}