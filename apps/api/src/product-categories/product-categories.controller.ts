import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoriesQueryDto } from './dtos/categories-query.dto';
import { Admin } from 'src/shared/decorators/admin.decorator';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  @ResponseMessage('Categories found successfully')
  findAll(@Query() query: CategoriesQueryDto) {
    return this.productCategoriesService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Category found successfully')
  findOne(@Param('id') id: number) {
    return this.productCategoriesService.findOne(id);
  }

  // @Admin()
  @Post()
  @ResponseMessage('Category created successfully')
  create(@Body() dto: CreateCategoryDto) {
    return this.productCategoriesService.create(dto);
  }

  // @Admin()
  @Patch(':id')
  @ResponseMessage('Category updated successfully')
  update(@Body() dto: UpdateCategoryDto, @Param('id') id: number) {
    return this.productCategoriesService.update(id, dto);
  }

  // @Admin()
  @Delete(':id')
  @ResponseMessage('Category deleted successfully')
  delete(@Param('id') id: number) {
    return this.productCategoriesService.delete(id);
  }
}
