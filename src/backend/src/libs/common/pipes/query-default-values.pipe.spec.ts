import { ArgumentMetadata } from "@nestjs/common";
import { QueryDefaultValuesPipe } from './query-default-values.pipe';

class SomeClass {
   property1?: string = 'value1';
   property2?: number = 1;
   property3?: string = 'value3';
   property4?: number = 2;
}

describe('DefaultValuesQueryParserInterceptor', () => {
  it('should parse request.query correctly', () => {
    let query = {
      property1: 'custom-value1',
      property2: 3,
      property3: undefined
    } as SomeClass;

    const metadata = {
      metatype: SomeClass
    } as  ArgumentMetadata;

    const queryDefaultValuesPipe = new QueryDefaultValuesPipe<SomeClass>();

    query = queryDefaultValuesPipe.transform(query, metadata);

    expect(query.property1).toBe('custom-value1');
    expect(query.property2).toBe(3);
    expect(query.property3).toBe('value3');
    expect(query.property4).toBe(2);
  });
});
