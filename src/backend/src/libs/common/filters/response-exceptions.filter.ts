import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from "@/libs/logging/services/logging.service";

@Catch()
export class ResponseExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception['httpStatus'] || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception['message'] || 'Unknown error';

    const errorInfo = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorName: exception['name'] || 'Error',
      message
    };

    this.logger.error(errorInfo);

    response
      .status(status)
      .json(errorInfo);
  }
}