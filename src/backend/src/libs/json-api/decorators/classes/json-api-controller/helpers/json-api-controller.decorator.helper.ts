import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {throwError} from "rxjs";

import {JsonApiControllerInterface} from "@/libs/json-api/types";
import {getResourceEntityInfo, getRelationsMethodsMetadata} from "@/libs/database/decorators";
import {JsonApiControllerSwaggerHelper} from "./json-api-controller.swagger.helper";
import {METHODS_MIXINS} from "../constants/relations-methods.constants";

export class JsonApiControllerDecoratorHelper extends JsonApiControllerSwaggerHelper {
  constructor(entity: EntityClassOrSchema) {
    super(entity);
  }

  /**
   * Builds controllers methods mixins for JSON API controller
   *
   * @param entity
   * @param service
   */
  public buildMixins():
    {
      relationsMethodsNames: { [key: string]: { [key: string]: string } },
      mixins: Array<{ new(): JsonApiControllerInterface }>
    } {
    const {resource, methods: resourceMethodsList} = getResourceEntityInfo(this.entity);

    if (!resource) {
      console.log(`WARNING: There are no Resource annotations for ${this.entity.constructor.name} entity`);
      return;
    }

    const relationsMethodsNames = {};
    const mixins = [];

    if (Array.isArray(Object.keys(resourceMethodsList)) &&
      Object.keys(resourceMethodsList).length > 0) {
      for (const resourceMethod of Object.keys(resourceMethodsList)) {
        mixins.push(METHODS_MIXINS.resource[resourceMethod](resource, this.entity))
      }
    }

    const relationsMethods = getRelationsMethodsMetadata(this.entity);

    if (relationsMethods && Array.isArray(Object.keys(relationsMethods)) && Object.keys(relationsMethods).length > 0) {
      if (Object.keys(relationsMethods).length > 5) {
        throwError(`${resource}: Relationships routes initialization error! The number of relations should be less than 5`);
      }

      let index = 0;
      for (const [relationName, relationMethodsList] of Object.entries(relationsMethods)) {
        if (!relationMethodsList ||
          !Array.isArray(Object.keys(relationMethodsList)) ||
          Object.keys(relationMethodsList).length === 0) {
          index++;
          continue;
        }

        if (!Object.keys(relationsMethodsNames).includes(relationName)) {
          relationsMethodsNames[relationName] = {};
        }

        for (const relationMethod of Object.keys(relationMethodsList)) {
          const methodMixin = METHODS_MIXINS.relations[index][relationMethod](resource, relationName, this.entity);
          relationsMethodsNames[relationName][relationMethod] = this.getMixinMethodName(methodMixin);
          mixins.push(methodMixin)
        }
        index++;
      }
    }

    return {relationsMethodsNames, mixins};
  }

  /**
   * Return the own method name for controller's mixin  
   * 
   * @param mixin
   * @private
   */
  private getMixinMethodName(mixin: any): string {
    return Object
      .getOwnPropertyNames(mixin.prototype)
      .filter(property => property !== "constructor")
      .shift();
  }
}