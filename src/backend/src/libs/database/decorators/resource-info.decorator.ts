import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

export type ResourceInfoOptionsType = {
  resource: string,
  methods: {[key: string]: string}
}

const RESOURCE_INFO_METADATA_KEY = Symbol('Entity/ResourceInfo');

export function ResourceInfo(options: ResourceInfoOptionsType): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): TFunction | void { // eslint-disable-line @typescript-eslint/ban-types
    Reflect.defineMetadata(RESOURCE_INFO_METADATA_KEY, options, constructor);
  }
}

export function getResourceEntityInfo(entity: EntityClassOrSchema): ResourceInfoOptionsType {
  return Reflect.getMetadata(RESOURCE_INFO_METADATA_KEY, entity);
}