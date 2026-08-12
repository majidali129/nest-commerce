import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';
import { LoginUserDto } from 'src/users/dtos/login-user-dto';
import type { Request, Response } from 'express';
import { User } from 'src/shared/decorators/user.decorator';
import type { AuthUser } from 'src/shared/types/auth-user';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @ResponseMessage('Sign up successful')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ResponseMessage('Sign in successful')
  async signIn(
    @Body() signInDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(signInDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', 
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { accessToken, refreshToken, user };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('sign-out')
  @ResponseMessage('Sign out successful')
  async signOut(
    @User() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOut(user);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return null;
  }

  @Post('refresh-token')
  @ResponseMessage('Token refreshed successfully')
  refreshToken(@Req() req: Request) {
    const refreshToken =
      (req.cookies?.['refreshToken'] as string) ||
      (req.headers?.['authorization']?.replace('Bearer ', '') as string);
    return this.authService.refreshToken(refreshToken);
  }
}
