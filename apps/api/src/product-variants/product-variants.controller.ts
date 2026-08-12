import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';
import { Admin } from 'src/shared/decorators/admin.decorator';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly productVariantsService: ProductVariantsService) {}

  @Get()
  @ResponseMessage('Variants found successfully')
  findAll() {
    return this.productVariantsService.findAll();
  }

  @Get('product/:productId')
  @ResponseMessage('Variants found successfully')
  findByProductId(@Param('productId') productId: number) {
    return this.productVariantsService.findByProductId(productId);
  }

  @Get(':id')
  @ResponseMessage('Variant found successfully')
  findOne(@Param('id') id: number) {
    return this.productVariantsService.findOne(id);
  }

  // @Admin()
  @Post()
  @ResponseMessage('Variant created successfully')
  create(@Body() dto: CreateVariantDto) {
    return this.productVariantsService.create(dto);
  }

  // @Admin()
  @Patch(':id')
  @ResponseMessage('Variant updated successfully')
  update(@Param('id') id: number, @Body() dto: UpdateVariantDto) {
    return this.productVariantsService.update(id, dto);
  }

  // @Admin()
  @Delete(':id')
  @ResponseMessage('Variant deleted successfully')
  delete(@Param('id') id: number) {
    return this.productVariantsService.delete(id);
  }
}
