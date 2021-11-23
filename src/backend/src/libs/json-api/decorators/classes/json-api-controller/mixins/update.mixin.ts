import {Body, Patch, UseGuards} from "@nestjs/common";
import {TransformJsonApiResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function UpdateMixin(resource: string,
                            entity: EntityClassOrSchema) {
  class UpdateController {
    @UseGuards(JwtAuthGuard)
    @Patch(`${resource}/:id`)
    @TransformJsonApiResponse(entity)
    protected async update(id: number, payload: unknown): Promise<void> {
      await JsonApiService.getService(entity).update(id, payload);
    }
  }

  return UpdateController;
}