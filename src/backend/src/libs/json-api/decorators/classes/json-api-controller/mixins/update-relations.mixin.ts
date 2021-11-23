import {Patch, Body, Param, UseGuards} from "@nestjs/common";
import {TransformJsonApiRelationshipsResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function UpdateRelationsMixin_0(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class UpdateRelationsController_0 {
    @UseGuards(JwtAuthGuard)
    @Patch(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async updateRelations_0(id: number, payload: Array<{type: string, id: number}>): Promise<unknown> {
      return await JsonApiService.getService(entity).updateRelations(id, relation, payload);
    }
  }

  return UpdateRelationsController_0;
}

export function UpdateRelationsMixin_1(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class UpdateRelationsController_1 {
    @UseGuards(JwtAuthGuard)
    @Patch(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async updateRelations_1(id: number, payload: Array<{type: string, id: number}>): Promise<unknown> {
      return await JsonApiService.getService(entity).updateRelations(id, relation, payload);
    }
  }

  return UpdateRelationsController_1;
}

export function UpdateRelationsMixin_2(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class UpdateRelationsController_2 {
    @UseGuards(JwtAuthGuard)
    @Patch(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async updateRelations_2(id: number, payload: Array<{type: string, id: number}>): Promise<unknown> {
      return await JsonApiService.getService(entity).updateRelations(id, relation, payload);
    }
  }

  return UpdateRelationsController_2;
}

export function UpdateRelationsMixin_3(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class UpdateRelationsController_3 {
    @UseGuards(JwtAuthGuard)
    @Patch(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async updateRelations_3(id: number, payload: Array<{type: string, id: number}>): Promise<unknown> {
      return await JsonApiService.getService(entity).updateRelations(id, relation, payload);
    }
  }

  return UpdateRelationsController_3;
}

export function UpdateRelationsMixin_4(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class UpdateRelationsController_4 {
    @UseGuards(JwtAuthGuard)
    @Patch(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async updateRelations_4(id: number, payload: Array<{type: string, id: number}>): Promise<unknown> {
      return await JsonApiService.getService(entity).updateRelations(id, relation, payload);
    }
  }

  return UpdateRelationsController_4;
}