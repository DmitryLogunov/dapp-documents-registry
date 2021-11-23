import {get} from "@/libs/common/helpers/object.helpers";
import {BaseJsonApiTransformDecorator} from "@/libs/json-api/decorators/methods/transform/base-json-api-transform.decorator";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

export function TransformJsonApiRelationshipsResponse(entity: EntityClassOrSchema,
                                                      relation: string): MethodDecorator {
  return BaseJsonApiTransformDecorator(entity, transformData(relation));
}

function transformData(relation: string) {
  return (data: unknown): {type: string, id: number} => {
    if (!data) {
      return null;
    }

    return {
      type: relation.replace('_', '-'),
      id: get(data, 'id')
    }
  }
}
