import {JsonApiError} from "@/libs/json-api/errors";
import {HttpStatus} from "@nestjs/common";
import {JsonApiServiceInterface} from "@/libs/json-api/types";
import {MetadataHelper} from "@/libs/json-api/helpers/metadata.helper";

export function ValidateRelation(): MethodDecorator {
  return (target: JsonApiServiceInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
      const [{relation}, repo] = args;
      const relations = MetadataHelper.getRelations(repo);
      const relationsResources = Object.entries(relations).map(entry => entry[1].resource);

      if (!relationsResources.includes(String(relation).replace('-', '_'))) {
        throw new JsonApiError('Relationship is incorrect', HttpStatus.BAD_REQUEST);
      }

      return originalMethod.apply(this, args);
    }
  }
}