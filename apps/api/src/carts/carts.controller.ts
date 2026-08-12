import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { User } from 'src/shared/decorators/user.decorator'
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator'
import type { AuthUser } from 'src/shared/types/auth-user'
import { CartsService } from './carts.service'
import {
  AddToCartDto,
  RemoveCartItemsDto,
  UpdateCartItemDto,
} from './dtos/cart.dto'

@Controller('cart')
@UseGuards(AuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ResponseMessage('Cart fetched successfully')
  getCart(@User() user: AuthUser) {
    return this.cartsService.getCart(user.id)
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Item added to cart')
  addItem(@User() user: AuthUser, @Body() dto: AddToCartDto) {
    return this.cartsService.addItem(user.id, dto)
  }

  @Patch('items/:itemId')
  @ResponseMessage('Cart item updated')
  updateItem(
    @User() user: AuthUser,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(user.id, itemId, dto)
  }

  @Delete('items/:itemId')
  @ResponseMessage('Cart item removed')
  removeItem(
    @User() user: AuthUser,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartsService.removeItem(user.id, itemId)
  }

  @Post('items/remove')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Selected cart items removed')
  removeItems(@User() user: AuthUser, @Body() dto: RemoveCartItemsDto) {
    return this.cartsService.removeItems(user.id, dto)
  }

  @Delete()
  @ResponseMessage('Cart cleared')
  clearCart(@User() user: AuthUser) {
    return this.cartsService.clearCart(user.id)
  }
}
