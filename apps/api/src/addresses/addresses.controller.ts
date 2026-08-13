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
import { AddressesService } from './addresses.service'
import { CreateAddressDto, UpdateAddressDto } from './dtos/address.dto'

@Controller('addresses')
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ResponseMessage('Addresses fetched successfully')
  list(@User() user: AuthUser) {
    return this.addressesService.list(user.id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Address created successfully')
  create(@User() user: AuthUser, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.id, dto)
  }

  @Patch(':id')
  @ResponseMessage('Address updated successfully')
  update(
    @User() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.id, id, dto)
  }

  @Post(':id/default')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Default address updated')
  setDefault(
    @User() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.addressesService.setDefault(user.id, id)
  }

  @Delete(':id')
  @ResponseMessage('Address deleted successfully')
  remove(
    @User() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.addressesService.remove(user.id, id)
  }
}
