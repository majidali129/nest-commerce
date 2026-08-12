import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
  } from 'class-validator';
  
  export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MaxLength(255)
    name!: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description!: string;
  
    @IsOptional()
    @IsUrl({}, { message: 'imageUrl must be a valid URL' })
    @MaxLength(255)
    imageUrl?: string | null;
  }