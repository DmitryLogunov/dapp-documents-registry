import {Get, UseGuards} from "@nestjs/common";
import {TransformJsonApiRelationshipsResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function GetRelationsOneMixin_0(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class GetRelationsOneController_0 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsOne_0(id: number, relationId: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsOne(id, relation, relationId);
    }
  }

  return GetRelationsOneController_0;
}

export function GetRelationsOneMixin_1(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class GetRelationsOneController_1 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsOne_1(id: number, relationId: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsOne(id, relation, relationId);
    }
  }

  return GetRelationsOneController_1;
}

export function GetRelationsOneMixin_2(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class GetRelationsOneController_2 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsOne_2(id: number, relationId: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsOne(id, relation, relationId);
    }
  }

  return GetRelationsOneController_2;
}

export function GetRelationsOneMixin_3(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class GetRelationsOneController_3 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsOne_3(id: number, relationId: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsOne(id, relation, relationId);
    }
  }

  return GetRelationsOneController_3;
}

export function GetRelationsOneMixin_4(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class GetRelationsOneController_4 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsOne_4(id: number, relationId: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsOne(id, relation, relationId);
    }
  }

  return GetRelationsOneController_4;
}