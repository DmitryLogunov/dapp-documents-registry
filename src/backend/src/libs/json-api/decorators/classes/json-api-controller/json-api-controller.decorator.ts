import {applyDecorators, Controller, UseGuards} from "@nestjs/common";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import getPrototypeOf = Reflect.getPrototypeOf;

import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";
import {applyMixins} from "@/libs/common/mixins/apply-mixins";
import {JsonApiServiceInterface} from "@/libs/json-api/types";
import {JsonApiControllerDecoratorHelper} from "./helpers";

export function JsonApiController(entity: EntityClassOrSchema,
                                  injectedService?: JsonApiServiceInterface): ClassDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard), Controller(), _decorator(entity, injectedService));
}

export function _decorator(entity: EntityClassOrSchema,
                           injectedService?: JsonApiServiceInterface): ClassDecorator {
  return function (ResourceController: any): any { // eslint-disable-line @typescript-eslint/no-explicit-any
    const helper = new JsonApiControllerDecoratorHelper(entity);

    const {relationsMethodsNames, mixins: builtMixins} = helper.buildMixins();
    const mixins = [];
    mixins.push(...builtMixins);

    const resourceController = new ResourceController();
    const builtController = applyMixins(getPrototypeOf(resourceController).constructor, mixins);

    helper.setSwaggerMetadata(relationsMethodsNames, builtController);

    return builtController;
  }
}