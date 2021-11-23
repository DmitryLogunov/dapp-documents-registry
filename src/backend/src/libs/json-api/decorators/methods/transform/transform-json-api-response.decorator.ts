import {Repository} from "typeorm";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import {get} from "@/libs/common/helpers/object.helpers";
import {JsonApiItemDataType} from "@/libs/json-api/types";
import {BaseJsonApiTransformDecorator} from "./base-json-api-transform.decorator";
import {MetadataHelper} from "@/libs/json-api/helpers/metadata.helper";

export function TransformJsonApiResponse(entity: EntityClassOrSchema): MethodDecorator {
  return BaseJsonApiTransformDecorator(entity, transformData);
}

function transformData(data: unknown,
                       repo: Repository<EntityClassOrSchema>): JsonApiItemDataType {
  const {resourceType: type, relations} = MetadataHelper.getResourceEntityMetadata(repo);

  const id = get(data, 'id');

  const attributes = Object.entries(data)
    .reduce((res, pair) => {
      const [attribute, value] = pair;
      if (attribute === "id" || Object.keys(relations).includes(attribute)) {
        return res;
      }
      res[attribute] = value;
      return res;
    }, {});

  let relationships = {};
  for (const [relationName, relationType] of Object.entries(relations)) {
    if (!data[relationName]) {
      data[relationName] = null;
      continue;
    }

    if (!Array.isArray(data[relationName])) {
      relationships[relationName] = {
        type: relationType.replace('_', '-'),
        id: get(data[relationName], 'id')
      }
      continue;
    }

    if (data[relationName].length === 0) {
      relationships[relationName] = null;
      continue;
    }

    relationships[relationName] = data[relationName]
      .map(rel => ({
        type: relationType.replace('_', '-'),
        id: get(rel, 'id')
      }));
  }

  if (Object.keys(relationships).length === 0) {
    relationships = null;
  }

  return {
    type: type.replace('_', '-'),
    id,
    attributes,
    relationships
  };
}

