import {getRepository, Repository} from "typeorm";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiControllerInterface} from "@/libs/json-api/types";

export function BaseJsonApiTransformDecorator(
  entity: EntityClassOrSchema,
  transformData: (data: unknown,
                  repo?: Repository<EntityClassOrSchema>) => unknown
): MethodDecorator {
  return (target: JsonApiControllerInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;
    const originalEntity = entity;

    descriptor.value = async function (...args: Array<unknown>) {
      const repo = getRepository(originalEntity);
      const result = await originalMethod.apply(this, args);

      if (!result) {
        return;
      }

      const {items, meta, links} = result;
      const resultData = items || result;

      if (!Array.isArray(resultData)) {
        return {data: transformData(result, repo)};
      }

      return {meta, links, data: resultData.map(item => transformData(item, repo))};
    }
  }
}