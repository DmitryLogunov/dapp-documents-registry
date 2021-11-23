import {Post, UseGuards} from "@nestjs/common";

import {JsonApiService} from "@/libs/json-api/services";
import {TransformJsonApiResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function CreateMixin(resource: string,
                            entity: EntityClassOrSchema) {
  class CreateController {
    @UseGuards(JwtAuthGuard)
    @Post(`${resource}`)
    @TransformJsonApiResponse(entity)
    protected async create(payload: unknown): Promise<unknown> {
      return await JsonApiService.getService(entity).create(payload);
    }
  }

  return CreateController;
}


