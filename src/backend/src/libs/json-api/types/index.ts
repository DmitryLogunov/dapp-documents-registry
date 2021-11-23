import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { Repository} from "typeorm";

export interface MetadataHelperInterface {
  setEntity?: (entity: EntityClassOrSchema) => void;
  getResourceRepository: () =>  any;
  getRelations: () =>  {[key: string]: Repository<EntityClassOrSchema>};
  getInstances: () => Array<EntityClassOrSchema>;
}

export interface JsonApiServiceInterface extends MetadataHelperInterface {
  getCollection: (query: unknown) => Promise<Array<EntityClassOrSchema>>;
  getOne: (id: number) => Promise<EntityClassOrSchema>;
  create: (payload: unknown) => Promise<EntityClassOrSchema>;
  update: (id: number, payload: unknown) => Promise<void>;
  delete: (id: number) => Promise<void>;
  getRelationsCollection: (id: number, relation: string) => Promise<Array<unknown>>;
  getRelationsOne: (id: number, relation: string, relationId: number) => Promise<unknown>;
  createRelations: (id: number, relation: string, payload: Array<{type: string, id: number}>) => Promise<Array<unknown>>;
  updateRelations: (id: number, relation: string, payload: Array<{type: string, id: number}>) => Promise<Array<unknown>>;
  deleteRelations: (id: number, relation: string, relationId: number) => Promise<void>;
  setEntity?: (entity: EntityClassOrSchema) => JsonApiServiceInterface;
}

export interface JsonApiControllerInterface extends MetadataHelperInterface {
  getService?: () => JsonApiServiceInterface;
}

export type JsonApiItemDataType = {
  type: string;
  id: number;
  attributes: { [key: string]: string | number | boolean | null };
  relationships: { [key: string]: {type: string, id: number} | Array<{type: string, id: number}> | null } | null;
}

export type ParsedQueryType = {
  [key: string]: string|number|null|string[]|number[]|ParsedQueryType
}
