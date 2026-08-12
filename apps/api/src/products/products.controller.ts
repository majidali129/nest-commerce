import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsQueryDto } from './dtos/products-query.dto';
import { Admin } from 'src/shared/decorators/admin.decorator';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ResponseMessage('Products found successfully')
  findAll(@Query() query: ProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Product found successfully')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  // @Admin()
  @Post()
  @ResponseMessage('Product created successfully')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // @Admin()
  @Patch(':id')
  @ResponseMessage('Product updated successfully')
  update(@Body() dto: UpdateProductDto, @Param('id') id: number) {
    return this.productsService.update(id, dto);
  }

  // @Admin()
  @Delete(':id')
  @ResponseMessage('Product deleted successfully')
  delete(@Param('id') id: number) {
    return this.productsService.delete(id);
  }
}
