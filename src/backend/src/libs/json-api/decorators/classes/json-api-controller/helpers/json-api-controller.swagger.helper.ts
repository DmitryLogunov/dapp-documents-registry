import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {
  DEFAULT_SWAGGER_HTTP_ERRORS_CODES,
  DEFAULT_SWAGGER_TAGS, SWAGGER_HTTP_SUCCESS_CODES,
  SWAGGER_METADATA_KEYS,
  NEST_ROUTE_ARGS_METADATA_KEY,
  NEST_PARSER_METADATA
} from "@/libs/json-api/constants";
import {
  getPropertiesEntityInfo,
  getResourceEntityInfo,
  getRelationsMethodsMetadata
} from "@/libs/database/decorators";
import {JwtAuthGuard} from "@/modules/authentication/guards/jwt-auth.guard";

type RelationItemSchemaType = {
  type: string,
  required: string[],
  properties: {
    "type": string,
    "items": {
      "type": string,
      "required": string[],
      "properties": {
        "type": {
          "type": string,
          "example": string
        },
        "id": {
          "type": number,
          "example": number
        }
      }
    }
  }
}

export class JsonApiControllerSwaggerHelper {
  protected readonly entity: EntityClassOrSchema;

  constructor(entity: EntityClassOrSchema) {
    this.entity = entity;
  }

  /**
   * Sets swagger metadata to ready Json API controller
   *
   * @param entity
   * @param relationsMethodsNames
   * @param target
   */
  public setSwaggerMetadata(relationsMethodsNames: { [key: string]: { [key: string]: string } },
                            target: any): any {
    Reflect.defineMetadata(SWAGGER_METADATA_KEYS.apiTags, DEFAULT_SWAGGER_TAGS, target);
    Reflect.defineMetadata(SWAGGER_METADATA_KEYS.apiResponse, DEFAULT_SWAGGER_HTTP_ERRORS_CODES, target);

    const {resource, methods: resourceMethodsList} = getResourceEntityInfo(this.entity);

    if (Array.isArray(Object.keys(resourceMethodsList)) && Object.keys(resourceMethodsList).length > 0) {
      for (const [resourceMethod, methodDescription] of Object.entries(resourceMethodsList)) {
        const response = {
          [SWAGGER_HTTP_SUCCESS_CODES[resourceMethod].code]: {
            "description": SWAGGER_HTTP_SUCCESS_CODES[resourceMethod].description,
            "content": this.responseBody(resource, resourceMethod)
          }
        };

        Reflect.defineMetadata(
          SWAGGER_METADATA_KEYS.apiResponse,
          response,
          target.prototype[resourceMethod]);

        Reflect.defineMetadata(
          SWAGGER_METADATA_KEYS.apiOperation,
          {
            summary: methodDescription,
            operationId: `${target.name}_${resourceMethod}`,
            parameters: this.parameters(resourceMethod),
            requestBody: this.requestBody(resourceMethod)
          },
          target.prototype[resourceMethod]);

        this.setNestParametersParsingMetadata(resourceMethod, target);
      }
    }

    const relationsMethods = getRelationsMethodsMetadata(this.entity);

    if (relationsMethods &&
      Array.isArray(Object.keys(relationsMethods)) &&
      Object.keys(relationsMethods).length > 0) {
      for (const [relationName, relationMethodsList] of Object.entries(relationsMethods)) {
        if (!relationMethodsList ||
          !Array.isArray(Object.keys(relationMethodsList)) ||
          Object.keys(relationMethodsList).length === 0) {
          continue;
        }

        for (const [relationMethod, methodDescription] of Object.entries(relationMethodsList)) {
          const relationMethodName = relationsMethodsNames[relationName][relationMethod];
          const operationId = `${target.name}_${relationMethodName}`;
          const response = {
            [SWAGGER_HTTP_SUCCESS_CODES[relationMethod].code]: {
              "description": SWAGGER_HTTP_SUCCESS_CODES[relationMethod].description,
              "content": this.relationsResponseBody(relationName, relationMethod)
            }
          };

          Reflect.defineMetadata(
            SWAGGER_METADATA_KEYS.apiResponse,
            response,
            target.prototype[relationMethodName]);

          Reflect.defineMetadata(
            SWAGGER_METADATA_KEYS.apiOperation,
            {
              summary: methodDescription,
              operationId,
              parameters: this.parameters(relationMethod),
              requestBody: this.relationsRequestBody(relationName, relationMethod)
            },
            target.prototype[relationMethodName]);

          this.setNestParametersParsingMetadata(relationMethod, target, relationMethodName);
        }
      }
    }

    return target;
  }

  /**
   * Sets @QUERY(), @BODY(), @PARAM('id'), @PARAM('relation_id') metadata
   *
   * @param method
   * @param target
   * @private
   */
  private setNestParametersParsingMetadata(method: string, target: any, relationMethodName?: string): void {
    const decoratorsMetadata = [];

    if (["getCollection"].includes(method)) {
      if (relationMethodName) {
        decoratorsMetadata.push(NEST_PARSER_METADATA['PARAM'](0, 'id'));
      }
      const queryIndex = relationMethodName ? 1 : 0;
      decoratorsMetadata.push(NEST_PARSER_METADATA['QUERY'](queryIndex));

    }

    if (["getOne", "delete"].includes(method)) {
      decoratorsMetadata.push(NEST_PARSER_METADATA['PARAM'](0, 'id'));
      if (relationMethodName) {
        decoratorsMetadata.push(NEST_PARSER_METADATA['PARAM'](1, 'relation_id'));
      }
    }

    if (["update"].includes(method)) {
      decoratorsMetadata.push(NEST_PARSER_METADATA['PARAM'](0, 'id'));
      decoratorsMetadata.push(NEST_PARSER_METADATA['BODY'](1));
    }

    if (["create"].includes(method)) {
      if (relationMethodName) {
        decoratorsMetadata.push(NEST_PARSER_METADATA['PARAM'](0, 'id'));
      }
      const bodyIndex = relationMethodName ? 1 : 0;
      decoratorsMetadata.push(NEST_PARSER_METADATA['BODY'](bodyIndex));
    }

    const metadata = decoratorsMetadata
      .reduce((res, meta) => {
        res = { ...res, ...meta};
        return res;
      }, {});

    Reflect.defineMetadata(
      NEST_ROUTE_ARGS_METADATA_KEY,
      metadata,
      target.prototype.constructor,
      relationMethodName || method
    );
  }

  /**
   *
   * @param method
   * @private
   */
  private parameters(method: string): any {
    if (method !== "getCollection") return undefined;

    const attributesMetadata = this.getAttributesMetadata();

    if (!attributesMetadata) return;

    return Object.entries(attributesMetadata)
      .map(entry => {
        const [key, value] = entry;
        const name = value?.name || key;
        const {description, example, required, type} = value || {};
        return {
          name, description, example, required,
          in: 'query',
          default: value?.default,
          schema: type && {type}
        };
      });
  }

  /**
   *
   * @param method
   * @private
   */
  private requestBody(method: string, relation?: string): any {
    if (!["create", "update"].includes(method)) return undefined;

    const {required, properties} =
      this.splitAttributesToRequiredAndProperties(['id', 'createdAt', 'updatedAt']);

    return {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required,
            properties
          }
        }
      }
    }
  }

  /**
   *
   * @param method
   * @private
   */
  private responseBody(resource: string, method: string): any {
    if (["update", "delete"].includes(method)) return undefined;

    if (method === "getCollection") {
      return {
        "application/json": {
          "schema": {
            "type": "object",
            "required": ["data"],
            "properties": {
              "data": {
                "type": "array",
                "items": this.responseOneInstanceScheme(resource)
              }
            }
          }
        }
      }
    }

    return {
      "application/json": {
        "schema": {
          "type": "object",
          "required": ["data"],
          "properties": {
            "data": this.responseOneInstanceScheme(resource)
          }
        }
      }
    }
  }

  /**
   * Return relations list schema
   *
   * @param relationName
   * @private
   */
  private relationsRequestBody(relationName: string, method: string) {
    if (["getOne", "getCollection", "delete"].includes(method)) return;

    const itemRelationSchema = {
      "type": "object",
      "required": ["type", "id"],
      "properties": {
        "type": {
          "type": "string",
          "example": relationName
        },
        "id": {
          "type": "number",
          "example": 1
        }
      }
    };

    return {
      content: {
        "application/json": {
          "schema": {
            "type": "array",
            "items": itemRelationSchema
          }
        }
      }
    }
  }

  /**
   * Return relations list schema
   *
   * @param relationName
   * @private
   */
  private relationsResponseBody(relationName: string, method: string) {
    if (method === "delete") return;

    const itemRelationSchema = {
      "type": "object",
      "required": ["type", "id"],
      "properties": {
        "type": {
          "type": "string",
          "example": relationName
        },
        "id": {
          "type": "number",
          "example": 1
        }
      }
    };

    let relations;
    relations = {
      type: "object",
      required: [relationName],
      properties: {
        [relationName]: {
          "type": "array",
          "items": itemRelationSchema
        }
      }
    };

    if (relationName === "getOne") {
      relations = {
        type: "object",
        required: [relationName],
        properties: {
          [relationName]: itemRelationSchema
        }
      };
    }

    return {
      "application/json": {
        "schema": {
          "type": "object",
          "required": ["data"],
          "properties": {
            "data": relations
          }
        }
      }
    };
  }

  /**
   *
   * @param resource
   * @private
   */
  private responseOneInstanceScheme(resource: string) {
    const {required, properties} = this.splitAttributesToRequiredAndProperties(['id']);

    let relations;
    const relationsMethods = getRelationsMethodsMetadata(this.entity);
    if (relationsMethods &&
      Array.isArray(Object.keys(relationsMethods)) &&
      Object.keys(relationsMethods).length > 0) {
      relations = {
        "type": "object",
        "required": [],
        "properties": {}
      };
      for (const relationName of Object.keys(relationsMethods)) {
        relations = this.relationsListSchema(relations, relationName);
      }
    }

    return {
      "type": "object",
      "required": ["type", "id", "attributes", "relationships"],
      "properties": {
        "type": {
          "type": "string",
          "example": resource
        },
        "id": {
          "type": "number",
          "example": 1
        },
        "attributes": {
          "type": "object",
          "required": required,
          "properties": properties
        },
        "relationships": relations
      }
    }
  }

  /**
   * Builds and returns one relation section in relations list schema
   *
   * @param relations
   * @param relationName
   * @private
   */
  private relationsListSchema(relations: RelationItemSchemaType,
                              relationName: string): RelationItemSchemaType {
    relations.required.push(relationName);
    relations.properties[relationName] = {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["type", "id"],
        "properties": {
          "type": {
            "type": "string",
            "example": relationName
          },
          "id": {
            "type": "number",
            "example": 1
          }
        }
      }
    }

    return relations;
  }

  /**
   * Returns attributes from entity metadata as {required: [], properties: {}}
   *
   * @param skipId
   * @private
   */
  private splitAttributesToRequiredAndProperties(excludedProperties?: string[]):
    {
      required?: string[],
      properties?: {
        [key: string]: {
          type?: string,
          description?: string,
          example?: string
        }
      }
    } {
    const attributesMetadata = this.getAttributesMetadata();

    if (!attributesMetadata) return {};

    return Object.entries(attributesMetadata)
      .reduce((res, entry) => {
        const [key, value] = entry;
        if (excludedProperties && excludedProperties.includes(key)) return res;

        const name = value?.name || key;
        const {description, example, required, type} = value || {};

        if (required) {
          res.required.push(name);
        }

        res.properties[name] = {type, description, example};

        return res;
      }, {required: [], properties: {}});
  }

  /**
   * Returns relationships entity methods metadata
   *
   * @param entity
   */
  protected getAttributesMetadata(): {
    [key: string]: { [key: string]: string }
  } {
    const entityPropertiesInfo = getPropertiesEntityInfo(this.entity);
    const isEntityPropertiesInfoExists = entityPropertiesInfo &&
      Array.isArray(Object.keys(entityPropertiesInfo)) &&
      Object.keys(entityPropertiesInfo).length > 0;

    return !isEntityPropertiesInfoExists ? null :
      Object.entries(entityPropertiesInfo)
        .reduce((res, entry) => {
          const [key, value] = entry;
          if (value?.isRelation) return res;
          res[key] = value;
          return res;
        }, {});
  }
}