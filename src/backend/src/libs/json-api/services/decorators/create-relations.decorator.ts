import {JsonApiError} from "@/libs/json-api/errors";
import {HttpStatus} from "@nestjs/common";
import {JsonApiServiceInterface} from "@/libs/json-api/types";
import {MetadataHelper} from "@/libs/json-api/helpers/metadata.helper";

export function CreateRelations(): MethodDecorator {
  return (target: JsonApiServiceInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
      const [{id, payload, relation: relationResource}, repo] = args;

      const instancesCollection = Reflect.getMetadata('InstancesCollection', repo.constructor) || [];
      let instance = instancesCollection && instancesCollection[0];

      if (!instance) {
        throw new JsonApiError('Not Found', HttpStatus.NOT_FOUND);
      }

      const {relationName, relationRepo} = MetadataHelper.getRelationByResourceName(relationResource, repo) || {};

      if (!relationName || !relationRepo) {
        throw new JsonApiError(`Could not find relation: ${relationResource}`, HttpStatus.BAD_REQUEST);
      }

      const instanceRelations = relationName && instance[relationName];

      let originalInstanceRelationIDs = [];
      if (instanceRelations && Array.isArray(instanceRelations)) {
        originalInstanceRelationIDs = instanceRelations.map(rel => rel.id)
      }
      if (instanceRelations && !Array.isArray(instanceRelations)) {
        originalInstanceRelationIDs = [instanceRelations.id]
      }

      for await (const {type: relationType, id: relationId} of payload) {
        if (relationType !== relationResource) {
          throw new JsonApiError(`Relation is incorrect: ${relationType}`, HttpStatus.BAD_REQUEST);
        }

        if (originalInstanceRelationIDs.includes(relationId)) continue;

        const relationInstance = await relationRepo.findOne(relationId);
        if (!relationInstance) continue;

        if (MetadataHelper.getRelationRepoMetadata(relationRepo, repo)?.isOneToOne) {
         instance = await MetadataHelper.oneToOneRelationHandler(
            'update',
            id,
            relationId,
            instance,
            relationInstance,
            relationName,
            relationRepo,
            repo
          );

          continue;
        }

        if (Array.isArray(instance[relationName])) {
          instance[relationName].push(relationInstance);
        } else {
          instance[relationName] = relationInstance;
        }
      }

      if (Array.isArray(instance[relationName]) &&
        instance[relationName].length > originalInstanceRelationIDs.length) {
        await repo.save(instance);
      }

      Reflect.defineMetadata('InstancesCollection', [instance], repo.constructor);

      return originalMethod.apply(this, args);
    }
  }
}