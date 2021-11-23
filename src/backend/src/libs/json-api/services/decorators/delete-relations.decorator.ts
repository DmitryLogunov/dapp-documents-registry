import {JsonApiError} from "@/libs/json-api/errors";
import {HttpStatus} from "@nestjs/common";
import {get} from "@/libs/common/helpers/object.helpers";
import {JsonApiServiceInterface} from "@/libs/json-api/types";
import {MetadataHelper} from "@/libs/json-api/helpers/metadata.helper";

export function DeleteRelations(): MethodDecorator {
  return (target: JsonApiServiceInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const [{id, relation: relationResourceName, payload, relationId}, repo]= args;

      const instancesCollection = Reflect.getMetadata('InstancesCollection', repo.constructor);
      let instance = instancesCollection && instancesCollection[0];

      if (!instance) {
        throw new JsonApiError('Not Found', HttpStatus.NOT_FOUND);
      }

      const {relationName, relationRepo} = MetadataHelper.getRelationByResourceName(String(relationResourceName), repo) || {};

      if (!relationName || !relationRepo) {
        throw new JsonApiError(`Could not find relation: ${relationResourceName}`, HttpStatus.BAD_REQUEST);
      }

      const instanceRelations = instance[String(relationName)];

      if (MetadataHelper.getRelationRepoMetadata(relationRepo, repo)?.isOneToOne) {
        instance = await MetadataHelper.oneToOneRelationHandler(
          'delete',
          id,
          relationId,
          instance,
          instanceRelations,
          relationName,
          relationRepo,
          repo
        );

        Reflect.defineMetadata('InstancesCollection', [instance], repo.constructor);
        return originalMethod.apply(this, args);
      }

      if (!instanceRelations ||
        !Array.isArray(instanceRelations) ||
        instanceRelations.length === 0 ) {
        Reflect.defineMetadata('InstancesCollection', [instance], repo.constructor);
        return originalMethod.apply(this, args);
      }

      let updatedInstanceRelations;
      if (!isNaN(parseInt(String(relationId), 10))) {
        updatedInstanceRelations = instanceRelations
          .filter(rel => String(get(rel, 'id')) !== String(relationId));
      } else {
        if (!validateRelationsPayload(payload)) {
          throw new JsonApiError('Relations data is incorrect', HttpStatus.BAD_REQUEST);
        }
        const savedRelationsIDs = payload.map(rel => String(rel.id));
        updatedInstanceRelations = instanceRelations
          .filter(rel => savedRelationsIDs.includes(String(get(rel, 'id'))));
      }

      instance[String(relationName)] = updatedInstanceRelations;
      repo.save(instance);

      Reflect.defineMetadata('InstancesCollection', [instance], repo.constructor);

      return originalMethod.apply(this, args);
    }
  }
}

function validateRelationsPayload(payload: Array<{type: string, id: number}>): boolean {
  if (!Array.isArray(payload)) {
    return false;
  }

  for (const item of payload) {
    const itemEntries = Object.entries(item);
    if (itemEntries.length !== 2) {
      return false;
    }

    for (const entry of itemEntries) {
      const [key, value] = entry;

      if (!['type', 'id'].includes(key)) {
        return false;
      }

      if (key === 'type' && typeof value !== 'string') {
        return false
      }

      if (key === 'id' && typeof value !== 'number') {
        return false
      }
    }
  }

  return true;
}