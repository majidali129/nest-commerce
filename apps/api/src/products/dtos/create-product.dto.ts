import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { PublicationStatus } from '../constants';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Short description is required' })
  shortDescription!: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description!: string;

  @IsInt({ message: 'categoryId must be an integer' })
  @IsPositive({ message: 'categoryId must be a positive number' })
  @IsNotEmpty({ message: 'categoryId is required' })
  categoryId!: number;

  @IsOptional()
  @IsEnum(PublicationStatus, {
    message: `publicationStatus must be one of: ${Object.values(PublicationStatus).join(', ')}`,
  })
  publicationStatus?: PublicationStatus;

  @IsOptional()
  @IsBoolean({ message: 'isFeatured must be a boolean' })
  isFeatured?: boolean;
}
