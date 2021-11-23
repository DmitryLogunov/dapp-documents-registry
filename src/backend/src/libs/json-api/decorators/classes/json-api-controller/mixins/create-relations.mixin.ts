import {Post, UseGuards} from "@nestjs/common";
import {TransformJsonApiRelationshipsResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function CreateRelationsMixin_0(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class CreateRelationsController_0 {
    @UseGuards(JwtAuthGuard)
    @Post(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async createRelations_0(id: number,
                                      payload: Array<{ type: string, id: number }>): Promise<unknown> {
      return await JsonApiService.getService(entity).createRelations(id, relation, payload);
    }
  }

  return CreateRelationsController_0;
}

export function CreateRelationsMixin_1(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class CreateRelationsController_1 {
    @UseGuards(JwtAuthGuard)
    @Post(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async createRelations_1(id: number,
                                      payload: Array<{ type: string, id: number }>): Promise<unknown> {
      return await JsonApiService.getService(entity).createRelations(id, relation, payload);
    }
  }

  return CreateRelationsController_1;
}

export function CreateRelationsMixin_2(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class CreateRelationsController_2 {
    @UseGuards(JwtAuthGuard)
    @Post(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async createRelations_2(id: number,
                                      payload: Array<{ type: string, id: number }>): Promise<unknown> {
      return await JsonApiService.getService(entity).createRelations(id, relation, payload);
    }
  }

  return CreateRelationsController_2;
}

export function CreateRelationsMixin_3(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class CreateRelationsController_3 {
    @UseGuards(JwtAuthGuard)
    @Post(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async createRelations_3(id: number,
                                      payload: Array<{ type: string, id: number }>): Promise<unknown> {
      return await JsonApiService.getService(entity).createRelations(id, relation, payload);
    }
  }

  return CreateRelationsController_3;
}

export function CreateRelationsMixin_4(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class CreateRelationsController_4 {
    @UseGuards(JwtAuthGuard)
    @Post(`${resource}/:id/relationships/${relation}`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async createRelations_4(id: number,
                                      payload: Array<{ type: string, id: number }>): Promise<unknown> {
      return await JsonApiService.getService(entity).createRelations(id, relation, payload);
    }
  }

  return CreateRelationsController_4;
}