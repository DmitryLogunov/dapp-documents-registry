import {Get, UseGuards} from "@nestjs/common";
import {TransformJsonApiRelationshipsResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function GetRelationsCollectionMixin_0(resource: string,
                                              relation: string,
                                              entity: EntityClassOrSchema) {
  class GetRelationsCollectionController_0 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsCollection_0(id: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsCollection(id, relation);
    }
  }

  return GetRelationsCollectionController_0;
}

export function GetRelationsCollectionMixin_1(resource: string,
                                              relation: string,
                                              entity: EntityClassOrSchema) {
  class GetRelationsCollectionController_1 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsCollection_1(id: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsCollection(id, relation);
    }
  }

  return GetRelationsCollectionController_1;
}

export function GetRelationsCollectionMixin_2(resource: string,
                                              relation: string,
                                              entity: EntityClassOrSchema) {
  class GetRelationsCollectionController_2 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsCollection_2(id: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsCollection(id, relation);
    }
  }

  return GetRelationsCollectionController_2;
}

export function GetRelationsCollectionMixin_3(resource: string,
                                              relation: string,
                                              entity: EntityClassOrSchema) {
  class GetRelationsCollectionController_3 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsCollection_3(id: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsCollection(id, relation);
    }
  }

  return GetRelationsCollectionController_3;
}

export function GetRelationsCollectionMixin_4(resource: string,
                                              relation: string,
                                              entity: EntityClassOrSchema) {
  class GetRelationsCollectionController_4 {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async getRelationsCollection_4(id: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getRelationsCollection(id, relation);
    }
  }

  return GetRelationsCollectionController_4;
}