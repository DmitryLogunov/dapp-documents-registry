import {Repository} from "typeorm";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import {MetadataHelper} from "@/libs/json-api/helpers/metadata.helper";
import {
  CheckInstanceExists, CreateRelations, DeleteRelations, FilterRelations,
  FindInstances,InstanceExistsExceptionConditions, ValidateRelation
} from "./decorators";

export class BaseJsonApiService {
  @FindInstances()
  static async _getCollection(parameters: { query: unknown },
                              repo: Repository<EntityClassOrSchema>): Promise<Array<EntityClassOrSchema>> {
    return MetadataHelper.getInstances(repo);
  }

  @FindInstances()
  @CheckInstanceExists()
  static async _getOne(parameters: { id: number },
                       repo: Repository<EntityClassOrSchema>): Promise<EntityClassOrSchema> {
    return MetadataHelper.getInstances(repo).shift();
  }

  @FindInstances({searchByUniques: true})
  @CheckInstanceExists({
    exceptionCondition: InstanceExistsExceptionConditions.IfExists
  })
  static async _create(parameters: { payload: unknown },
                       repo: Repository<EntityClassOrSchema>): Promise<EntityClassOrSchema> {
    const {payload} = parameters;
    const instance = await repo.create(payload);
    return repo.save(instance);
  }

  @FindInstances()
  @CheckInstanceExists()
  static async _update(parameters: {
                         id: number,
                         payload: unknown
                       },
                       repo: Repository<EntityClassOrSchema>): Promise<void> {
    const {id, payload} = parameters;
    await repo.update(id, payload);
  }

  @FindInstances()
  @CheckInstanceExists()
  static async _delete(parameters: { id: number },
                       repo: Repository<EntityClassOrSchema>): Promise<void> {
    const {id} = parameters;
    await repo.delete(id);
  }

  @ValidateRelation()
  @FindInstances({filterRelations: true})
  @CheckInstanceExists()
  static async _getRelationsCollection(parameters: {
                                         id: number,
                                         relation: string
                                       },
                                       repo: Repository<EntityClassOrSchema>): Promise<Array<unknown>> {
    const {relation: relationResource} = parameters;
    const relationName = MetadataHelper.getRelationNameByResourceName(relationResource, repo);
    const instances =  MetadataHelper.getInstances(repo);
    return (instances && Array.isArray(instances) && instances.shift()[relationName]) || [];
  }

  @ValidateRelation()
  @FindInstances({filterRelations: true})
  @CheckInstanceExists()
  @FilterRelations()
  static async _getRelationsOne(parameters: {
                                  id: number,
                                  relation: string,
                                  relationId: number
                                },
                                repo: Repository<EntityClassOrSchema>): Promise<unknown> {
    const {relation: relationResource} = parameters;
    const relationName = MetadataHelper.getRelationNameByResourceName(relationResource, repo);
    const instances =  MetadataHelper.getInstances(repo);
    return instances &&
      Array.isArray(instances) &&
      ( Array.isArray(instances[0][relationName]) && instances[0][relationName].shift() ||
        instances[0][relationName] );
  }

  @ValidateRelation()
  @FindInstances({filterRelations: true})
  @CheckInstanceExists()
  @CreateRelations()
  static async _createRelations(parameters: {
                                  id: number,
                                  relation: string,
                                  payload: Array<{ type: string, id: number }>
                                },
                                repo: Repository<EntityClassOrSchema>): Promise<Array<unknown>> {
    const {relation: relationResource} = parameters;
    const relationName = MetadataHelper.getRelationNameByResourceName(relationResource, repo);
    const instances =  MetadataHelper.getInstances(repo);
    return instances && Array.isArray(instances) && instances.shift()[relationName];
  }

  @ValidateRelation()
  @FindInstances({filterRelations: true})
  @CheckInstanceExists()
  @DeleteRelations()
  @CreateRelations()
  static async _updateRelations(parameters: {
                                  id: number,
                                  relation: string,
                                  payload: Array<{ type: string, id: number }>
                                },
                                repo: Repository<EntityClassOrSchema>): Promise<Array<unknown>> {
    const {relation: relationResource} = parameters;
    const relationName = MetadataHelper.getRelationNameByResourceName(relationResource, repo);
    const instances =  MetadataHelper.getInstances(repo);
    return instances && Array.isArray(instances) && instances.shift()[relationName];
  }

  @ValidateRelation()
  @FindInstances({filterRelations: true})
  @CheckInstanceExists()
  @DeleteRelations()
  static async _deleteRelations(parameters: {
                                  id: number,
                                  relation: string,
                                  relationId: number
                                },
                                repo: Repository<EntityClassOrSchema>): Promise<void> {
  }
}