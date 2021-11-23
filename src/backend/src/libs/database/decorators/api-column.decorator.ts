import {PropertyInfo} from "@/libs/database/decorators";

export interface ApiColumnsOptionsType {
  name: string,
  type?: string,
  isPrimary?: boolean;
  required?: boolean,
  isRelation?: boolean,
  description?: string,
  example?: string|number|boolean,
  default?: any,
  methods?: {[key: string]: string}
}

export function ApiColumn(options: ApiColumnsOptionsType): PropertyDecorator {
  return PropertyInfo(options);
}