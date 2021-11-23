import { KeyValueType } from "@/libs/common/types";

export const PROPERTIES_INFO_METADATA_KEY = 'Entity/PropertiesInfo';

export interface PropertyInfoOptionsType {
  [key: string]:
    string |
    number |
    boolean |
    string[] |
    {[key: string]: string} |
    {[key: string]: PropertyInfoOptionsType}
}

export function PropertyInfo<T>(options: T): PropertyDecorator {
  return (target: unknown, propertyKey: string|symbol): void => {
    if (!Reflect.getMetadataKeys(target).includes(PROPERTIES_INFO_METADATA_KEY)) {
      Reflect.defineMetadata(PROPERTIES_INFO_METADATA_KEY, {}, target);
    }

    const dbColumnsNames = Reflect.getMetadata(PROPERTIES_INFO_METADATA_KEY, target);
    if ( !Object.keys(dbColumnsNames).includes(String(propertyKey)) && options) {
      dbColumnsNames[propertyKey] = { ... options };
      Reflect.defineMetadata(PROPERTIES_INFO_METADATA_KEY, dbColumnsNames, target);
    }
  }
}

export function getPropertiesInfo<T>(responseDto: { new(): T }, onlyDBFields = false):
  Array<{ [key: string]: KeyValueType }> {
  const propertiesInfo: {[key: string]: KeyValueType} =
    Reflect.getMetadata(PROPERTIES_INFO_METADATA_KEY, responseDto.prototype);

  return  propertiesInfo && Object
    .entries(propertiesInfo)
    .reduce((result, keyValue) => {
      const [key, value] = keyValue;
      if (!value?.dbPropertyName && onlyDBFields) {
        return result;
      }
      result[String(value?.dbPropertyName || key)] = value;
      return result;
    }, {} as  Array<{ [key: string]: KeyValueType }>);
}

export function getPropertiesEntityInfo(entity: any):
  {[key: string]: PropertyInfoOptionsType} {
  return Reflect.getMetadata(PROPERTIES_INFO_METADATA_KEY, entity.prototype);
}

export function getRelationsMethodsMetadata(entity: any): {
  [key: string]: { [key: string]: string }
} {
  const entityPropertiesInfo = getPropertiesEntityInfo(entity);
  const isEntityPropertiesInfoExists = entityPropertiesInfo &&
    Array.isArray(Object.keys(entityPropertiesInfo)) &&
    Object.keys(entityPropertiesInfo).length > 0;

  return !isEntityPropertiesInfoExists ? null :
    Object.entries(entityPropertiesInfo)
      .reduce((res, entry) => {
        const [key, value] = entry;
        if (!value?.isRelation) return res;
        const relationName = (value.name && String(value.name)) || key;
        res[relationName] = value.methods;
        return res;
      }, {});
}