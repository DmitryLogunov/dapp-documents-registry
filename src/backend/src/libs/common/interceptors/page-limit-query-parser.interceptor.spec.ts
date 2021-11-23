import { CallHandler, ExecutionContext } from "@nestjs/common";
import { PageLimitQueryParserInterceptor } from './page-limit-query-parser.interceptor';

function initMockedContext<T>(request: { query: T }): ExecutionContext {
  return {
    switchToHttp: () => {
      return {
        getRequest: () => {
          return request;
        }
      }
    }
  } as ExecutionContext;
}

describe('QueryParserInterceptor', () => {
  let pageLimitQueryParserInterceptor: PageLimitQueryParserInterceptor;
  const next = {
    handle: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  } as CallHandler;

  beforeEach(async () => {
    pageLimitQueryParserInterceptor = new PageLimitQueryParserInterceptor();
  });

  it('should parse params \'page\' and \'limit\' in request.query as number', () => {
    const request = {
      query: {
        page: '2',
        limit: '300'
      }
    }
    const context = initMockedContext(request);

    pageLimitQueryParserInterceptor.intercept(context, next);

    expect(request.query.page).toBe(2);
    expect(request.query.limit).toBe(300);
  });

  it('should set params \'page\' and \'limit\' in default value if it\'s unparsable', () => {
    const request = {
      query: {
        page: 'null',
        limit: 'null'
      }
    }
    const context = initMockedContext(request);

    pageLimitQueryParserInterceptor.intercept(context, next);

    expect(request.query.page).toBe(1);
    expect(request.query.limit).toBe(100);
  });
});
