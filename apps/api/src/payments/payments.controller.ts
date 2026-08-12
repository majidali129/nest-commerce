import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { User } from 'src/shared/decorators/user.decorator'
import type { AuthUser } from 'src/shared/types/auth-user'
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator'
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout-session')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Create checkout session successfully')
  @UseGuards(AuthGuard)
  async createSession(
    @User() user: AuthUser,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.paymentsService.createSession(user, dto)
  }
}
