import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

type QueryIncludedType = {
  query?: { [key: string]: string|number };
}

@Injectable()
export class PageLimitQueryParserInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>() as QueryIncludedType;

    if (request.query) {
      ['page', 'limit'].forEach((key: string) => {
        if (Object.keys(request.query).includes(key)) {
          const value = request.query[key];

          if (/^[0-9]+$/.test(String(value))) {
            request.query[key] = parseInt(String(value), 10);
          } else {
            request.query[key] = key === 'page' ? 1 : 100;
          }
        }
      })
    }

    return next.handle();
  }
}