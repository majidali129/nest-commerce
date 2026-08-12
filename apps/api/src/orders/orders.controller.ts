import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { Admin } from 'src/shared/decorators/admin.decorator'
import { User } from 'src/shared/decorators/user.decorator'
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator'
import type { AuthUser } from 'src/shared/types/auth-user'
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ResponseMessage('Orders fetched successfully')
  list(@User() user: AuthUser) {
    return this.ordersService.listForUser(user.id)
  }

  @Get('admin')
  @Admin()
  @ResponseMessage('Orders fetched successfully')
  listAdmin() {
    return this.ordersService.listAllAdmin()
  }

  @Get('admin/:id')
  @Admin()
  @ResponseMessage('Order fetched successfully')
  getAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getByIdAdmin(id)
  }

  @Patch('admin/:id/status')
  @Admin()
  @ResponseMessage('Order status updated')
  updateStatusAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatusAdmin(id, dto.status)
  }

  @Get('by-session')
  @UseGuards(AuthGuard)
  @ResponseMessage('Order fetched successfully')
  getBySession(
    @User() user: AuthUser,
    @Query('session_id') sessionId: string,
  ) {
    if (!sessionId?.trim()) {
      throw new BadRequestException('session_id is required')
    }
    return this.ordersService.getByStripeSessionId(user.id, sessionId)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ResponseMessage('Order fetched successfully')
  getOne(
    @User() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.getForUser(user.id, id)
  }

  @Post(':id/cancel-checkout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Checkout cancelled')
  cancelCheckout(
    @User() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.cancelCheckoutForUser(user.id, id)
  }
}
