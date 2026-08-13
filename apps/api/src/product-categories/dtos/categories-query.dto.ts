import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const CATEGORY_SORTS = [
  'newest',
  'name-asc',
  'name-desc',
  'products-asc',
  'products-desc',
] as const;

export class CategoriesQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(CATEGORY_SORTS)
  sort?: (typeof CATEGORY_SORTS)[number];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
