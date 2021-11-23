import {JsonApiError} from "@/libs/json-api/errors";
import {HttpStatus} from "@nestjs/common";
import {get} from "@/libs/common/helpers/object.helpers";
import {JsonApiServiceInterface} from "@/libs/json-api/types";

export function FilterRelations(): MethodDecorator {
  return (target: JsonApiServiceInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
      const [{relation, relationId}, repo] = args;

      if (isNaN(parseInt(String(relationId), 10))) {
        throw new JsonApiError('Relation ID should be a number', HttpStatus.BAD_REQUEST);
      }

      const instancesCollection = Reflect.getMetadata('InstancesCollection', repo.constructor);
      const instance = instancesCollection?.shift();

      if (!instance) {
        throw new JsonApiError('Not Found', HttpStatus.NOT_FOUND);
      }

      const relationsCollection = instance[String(relation)];
      if (!relationsCollection) {
        throw new JsonApiError('Relationship is incorrect', HttpStatus.BAD_REQUEST);
      }

      if (!Array.isArray(relationsCollection)) {
        if (relationsCollection === null ||
          get(relationsCollection, 'id') !== String(relationId)) {
          throw new JsonApiError('Relation Not Found', HttpStatus.NOT_FOUND);
        }

        instance[String(relation)] = [relationsCollection];
        Reflect.defineMetadata('InstancesCollection', [instance], repo.constructor);

        return originalMethod.apply(this, args);
      }

      const filteredRelationCollection = relationsCollection
        .filter(rel => rel.id === parseInt(String(relationId), 10));

      if (filteredRelationCollection.length === 0) {
        throw new JsonApiError('Relation Not Found', HttpStatus.NOT_FOUND);
      }

      instance[String(relation)] = filteredRelationCollection;
      Reflect.defineMetadata('InstancesCollection', [instance], repo.constructor);

      return originalMethod.apply(this, args);
    }
  }
}