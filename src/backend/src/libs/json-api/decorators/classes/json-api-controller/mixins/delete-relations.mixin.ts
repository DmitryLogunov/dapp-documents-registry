import {Delete, UseGuards} from "@nestjs/common";
import {TransformJsonApiRelationshipsResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function DeleteRelationsMixin_0(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class DeleteRelationsController_0 {
    @UseGuards(JwtAuthGuard)
    @Delete(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async deleteRelations_0(id: number,
                                      relationId: number): Promise<void> {
      return await JsonApiService.getService(entity).deleteRelations(id, relation, relationId);
    }
  }

  return DeleteRelationsController_0;
}

export function DeleteRelationsMixin_1(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class DeleteRelationsController_1 {
    @UseGuards(JwtAuthGuard)
    @Delete(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async deleteRelations_1(id: number,
                                      relationId: number): Promise<void> {
      return await JsonApiService.getService(entity).deleteRelations(id, relation, relationId);
    }
  }

  return DeleteRelationsController_1;
}

export function DeleteRelationsMixin_2(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class DeleteRelationsController_2 {
    @UseGuards(JwtAuthGuard)
    @Delete(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async deleteRelations_2(id: number,
                                      relationId: number): Promise<void> {
      return await JsonApiService.getService(entity).deleteRelations(id, relation, relationId);
    }
  }

  return DeleteRelationsController_2;
}

export function DeleteRelationsMixin_3(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class DeleteRelationsController_3 {
    @UseGuards(JwtAuthGuard)
    @Delete(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async deleteRelations_3(id: number,
                                      relationId: number): Promise<void> {
      return await JsonApiService.getService(entity).deleteRelations(id, relation, relationId);
    }
  }

  return DeleteRelationsController_3;
}

export function DeleteRelationsMixin_4(resource: string,
                                       relation: string,
                                       entity: EntityClassOrSchema) {
  class DeleteRelationsController_4 {
    @UseGuards(JwtAuthGuard)
    @Delete(`${resource}/:id/relationships/${relation}/:relation_id`)
    @TransformJsonApiRelationshipsResponse(entity, relation)
    protected async deleteRelations_4(id: number,
                                      relationId: number): Promise<void> {
      return await JsonApiService.getService(entity).deleteRelations(id, relation, relationId);
    }
  }

  return DeleteRelationsController_4;
}