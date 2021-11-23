import {JsonApiError} from "@/libs/json-api/errors";
import {HttpStatus} from "@nestjs/common";
import {JsonApiServiceInterface} from "@/libs/json-api/types";

export enum InstanceExistsExceptionConditions {
  IfExists = 'IF_EXISTS',
  IfNotExists = 'IF_NOT_EXISTS'
}

export function CheckInstanceExists(
  options?: { exceptionCondition?: InstanceExistsExceptionConditions }
): MethodDecorator {
  return (target: JsonApiServiceInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;

    const exceptionCondition =
      options?.exceptionCondition ||
      InstanceExistsExceptionConditions.IfNotExists;

    descriptor.value = async function (...args: Array<number | { [key: string]: string | number | boolean | null }>) {
      const repo = args[1];
      const instancesCollection = Reflect.getMetadata('InstancesCollection', repo.constructor);

      if (exceptionCondition === InstanceExistsExceptionConditions.IfNotExists &&
        instancesCollection.length === 0) {
        throw new JsonApiError('Not Found', HttpStatus.NOT_FOUND);
      }

      if (exceptionCondition === InstanceExistsExceptionConditions.IfExists &&
        instancesCollection.length > 0) {
        throw new JsonApiError('Instance already exists', HttpStatus.BAD_REQUEST);
      }

      return originalMethod.apply(this, args);
    }
  }
}