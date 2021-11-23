import {Get, UseGuards} from "@nestjs/common";
import {TransformJsonApiResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function GetCollectionMixin(resource: string,
                                   entity: EntityClassOrSchema) {
  class GetCollectionController {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}`)
    @TransformJsonApiResponse(entity)
    protected async getCollection(query: unknown): Promise<unknown> {
      return await JsonApiService.getService(entity).getCollection(query);
    }
  }

  return GetCollectionController;
}