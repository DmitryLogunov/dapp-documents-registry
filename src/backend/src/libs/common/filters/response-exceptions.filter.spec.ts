import { ResponseExceptionsFilter } from './response-exceptions.filter';
import {HttpException} from "@nestjs/common";

describe('ResponseExceptionsFilter', () => {
  let host;
  let logger;
  let exceptionsFilter;
  const response = { errorInfo: null, status: null };

  beforeAll(() => {
    host = {
      switchToHttp: () => ({
          getResponse: () =>({
            status: (status) => ({
              json: errorInfo => { response.errorInfo = errorInfo; response.status = status; }
            })
          }),
          getRequest: () => ({
            url: '/some/url'
          })
      })
    };

    logger = {
      error: () => void {}
    }

   exceptionsFilter = new ResponseExceptionsFilter(logger);
  });

  it('check HTTP Exception', () => {
    const exception = new HttpException('some message', 123);

    exceptionsFilter.catch(exception, host);

    const errorInfoShouldBe = {
      statusCode: 123,
      timestamp: new Date().toISOString(),
      path: '/some/url',
      errorName: 'Error',
      message: 'some message'
    }

    expect(response.status).toBe(123);
    expect(response.errorInfo.statusCode).toBe(errorInfoShouldBe.statusCode);
    expect(response.errorInfo.path).toBe(errorInfoShouldBe.path);
    expect(response.errorInfo.errorName).toBe(errorInfoShouldBe.errorName);
    expect(response.errorInfo.message).toBe(errorInfoShouldBe.message);
  });
});