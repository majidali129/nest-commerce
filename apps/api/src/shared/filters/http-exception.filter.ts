import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { ApiErrorPayload, ApiResponse } from '@repo/contracts';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, errors } = this.normalizeException(exception);

    const body: ApiResponse<null> = {
      success: false,
      statusCode,
      message,
      data: null,
      errors,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }

  private normalizeException(exception: unknown): {
    message: string;
    errors: ApiErrorPayload;
  } {
    if (!(exception instanceof HttpException)) {
      return {
        message: 'Internal server error',
        errors: null,
      };
    }

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse, errors: null };
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const payload = exceptionResponse as Record<string, unknown>;
      const rawMessage = payload.message;

      if (Array.isArray(rawMessage)) {
        return {
          message: 'Validation failed',
          errors: rawMessage.map(String),
        };
      }

      if (typeof rawMessage === 'string') {
        return {
          message: rawMessage,
          errors:
            payload.errors !== undefined
              ? (payload.errors as ApiErrorPayload)
              : null,
        };
      }

      return {
        message: exception.message || 'Request failed',
        errors: null,
      };
    }

    return {
      message: exception.message || 'Request failed',
      errors: null,
    };
  }
}
