import { CallHandler, ExecutionContext } from "@nestjs/common";
import { QueryParserInterceptor } from './query-parser.interceptor';

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
  let queryParserInterceptor: QueryParserInterceptor;
  const next = {
    handle: () => {}
  } as CallHandler;

  beforeEach(async () => {
    queryParserInterceptor = new QueryParserInterceptor();
  });

  it('should parse request.query correctly', () => {
    const request = {
      query: {
        startDate: 'null',
        stopDate: '2020-01-01T23:59:59.000Z',
        brand: 'null',
        page: 4,
        limit: 500,
        fields: '["data","city","CVP","SKU","pharmacy","region","inn","amount","summ"]'
      }
    }
    const context = initMockedContext(request);

    queryParserInterceptor.intercept(context, next);

    expect(request.query.startDate).toBe(undefined);
    expect(request.query.stopDate).toBe('2020-01-01T23:59:59.000Z');
    expect(request.query.brand).toBe(undefined);
    expect(request.query.page).toBe(4);
    expect(request.query.limit).toBe(500);
    expect(request.query.fields).toBe('["data","city","CVP","SKU","pharmacy","region","inn","amount","summ"]');
  });

  it('should parse params \'page\' and \'limit\' in request.query as number', () => {
    const request = {
      query: {
        page: '2',
        limit: '300'
      }
    }
    const context = initMockedContext(request);

    queryParserInterceptor.intercept(context, next);

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

    queryParserInterceptor.intercept(context, next);

    expect(request.query.page).toBe(1);
    expect(request.query.limit).toBe(100);
  });
});
