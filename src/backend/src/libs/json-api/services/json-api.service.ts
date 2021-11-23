import {getRepository, Repository} from "typeorm";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {BaseJsonApiService} from "@/libs/json-api/services";

export class JsonApiService {
  static getService(entity: EntityClassOrSchema) {
    const repo = getRepository(entity);
    return {
      getCollection: JsonApiService.getCollection(repo) ,
      getOne: JsonApiService.getOne(repo),
      create: JsonApiService.create(repo),
      update: JsonApiService.update(repo),
      delete:JsonApiService.delete(repo),
      getRelationsCollection:JsonApiService.getRelationsCollection(repo),
      getRelationsOne: JsonApiService.getRelationsOne(repo),
      createRelations: JsonApiService.createRelations(repo),
      updateRelations: JsonApiService.updateRelations(repo),
      deleteRelations: JsonApiService.deleteRelations(repo)
    }
  }

   static getCollection(repo: Repository<EntityClassOrSchema>) {
    return (query: unknown) => {
      return BaseJsonApiService._getCollection({query}, repo);
    }
  }

  static getOne(repo: Repository<EntityClassOrSchema>) {
    return (id: number) => {
      return BaseJsonApiService._getOne({id}, repo);
    }
  }

  static create(repo: Repository<EntityClassOrSchema>) {
    return (payload: unknown) => {
      console.log('/api/users: create start ' + payload );
      return BaseJsonApiService._create({payload}, repo);
    }
  }

  static update(repo: Repository<EntityClassOrSchema>) {
    return (id: number, payload: unknown) => {
      return BaseJsonApiService._update({id, payload}, repo);
    }
  }

  static delete(repo: Repository<EntityClassOrSchema>) {
    return (id: number) => {
      return BaseJsonApiService._delete({id}, repo);
    }
  }

  static getRelationsCollection(repo: Repository<EntityClassOrSchema>) {
    return (id: number,
            relation: string) => {
      return BaseJsonApiService._getRelationsCollection({id, relation}, repo);
    }
  }

  static getRelationsOne(repo: Repository<EntityClassOrSchema>) {
    return (id: number,
            relation: string,
            relationId: number) => {
      return BaseJsonApiService._getRelationsOne({id, relation, relationId}, repo);
    }
  }

  static createRelations(repo: Repository<EntityClassOrSchema>) {
    return (id: number,
            relation: string,
            payload: Array<{ type: string, id: number }>) => {
      return BaseJsonApiService._createRelations({id, relation, payload}, repo);
    }
  }

  static updateRelations(repo: Repository<EntityClassOrSchema>) {
    return (id: number,
            relation: string,
            payload: Array<{ type: string, id: number }>) => {
      return BaseJsonApiService._updateRelations({id, relation, payload}, repo);
    }
  }

  static deleteRelations(repo: Repository<EntityClassOrSchema>) {
    return (id: number,
            relation: string,
            relationId: number) => {
      return BaseJsonApiService._deleteRelations({id, relation, relationId}, repo);
    }
  }
}