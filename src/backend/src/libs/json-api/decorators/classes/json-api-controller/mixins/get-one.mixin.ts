import {Get, UseGuards} from "@nestjs/common";
import {TransformJsonApiResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function GetOneMixin(resource: string,
                            entity: EntityClassOrSchema) {
  class GetOneController {
    @UseGuards(JwtAuthGuard)
    @Get(`${resource}/:id`)
    @TransformJsonApiResponse(entity)
    protected async getOne(id: number): Promise<unknown> {
      return await JsonApiService.getService(entity).getOne(id);
    }
  }

  return GetOneController;
}