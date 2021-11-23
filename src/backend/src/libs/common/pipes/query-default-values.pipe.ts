import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class QueryDefaultValuesPipe<T> implements PipeTransform {
  transform(query: T, metadata: ArgumentMetadata): T {
    if ( !metadata.metatype ||
         !metadata.metatype.prototype.constructor ||
         typeof metadata.metatype.prototype.constructor !== 'function') {
      return query;
    }
    return Object
      .entries(query)
      .reduce((result, currentItem) => {
        const [key, value] = currentItem;
        if (value) {
          result[key] = value;
        }
        return result;
      }, new metadata.metatype());
  }
}