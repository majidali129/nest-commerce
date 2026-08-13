import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
  import type { Request } from 'express';
import { AccessTokenPayload } from 'src/users/constants';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
    async canActivate(ctx: ExecutionContext) {
      const req: Request = ctx.switchToHttp().getRequest();
      // We're checking headers for mobile clients that might not support cookies
      const token =
        (req.cookies['accessToken'] as string) ||
        (req.headers['authorization']?.replace('Bearer ', '') as string);
  
      if (!token) throw new UnauthorizedException('Authentication token missing');
      try {
        const decoded: AccessTokenPayload =
          await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          });
  
        req.user = {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          avatar: decoded.avatar,
        };
  
        return true;
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
  
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('Authentication token has expired');
        }
  
        if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedException(
            'Invalid or malformed authentication token',
          );
        }
  
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
  