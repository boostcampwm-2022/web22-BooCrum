import { ExceptionFilter, Catch, UnauthorizedException, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnAuthRedirectionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    const statusCode = exception.getStatus();
    res.status(statusCode).redirect(process.env.REDIRECT_FAIL_LOGIN);
  }
}
