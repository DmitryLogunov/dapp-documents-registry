import {Delete, UseGuards} from "@nestjs/common";
import {TransformJsonApiResponse} from "@/libs/json-api/decorators";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {JsonApiService} from "@/libs/json-api/services";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

export function DeleteMixin(resource: string,
                            entity: EntityClassOrSchema) {
  class DeleteController {
    @UseGuards(JwtAuthGuard)
    @Delete(`${resource}/:id`)
    @TransformJsonApiResponse(entity)
    protected async delete(id: number): Promise<void> {
      await JsonApiService.getService(entity).delete(id);
    }
  }

  return DeleteController;
}