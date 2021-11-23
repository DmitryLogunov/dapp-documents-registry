import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {getRepository, Repository} from "typeorm";

export class MetadataHelper {
  static getRelations(repo: Repository<EntityClassOrSchema>):
    { [key: string]: { resource: string, repo: Repository<EntityClassOrSchema> } } {
    const relations = {};
    const resourceRepositoryRelationsMetadata = repo.metadata.relations;

    for (const relation of resourceRepositoryRelationsMetadata) {
      relations[relation.propertyName] = {
        resource: relation.inverseEntityMetadata.givenTableName,
        repo: getRepository(relation.type)
      };
    }

    return relations;
  }

  static getInstances(repo: Repository<EntityClassOrSchema>): Array<EntityClassOrSchema> {
    return Reflect.getMetadata('InstancesCollection', repo.constructor);
  }

  static getResourceEntityMetadata(repo: Repository<EntityClassOrSchema>):
    { resourceType: string, relations: { [key: string]: string } } {
    const resourceType = repo.metadata.tableName;
    const relations = repo
      .metadata
      .relations
      .reduce((res, rel) => {
        let relationTable = null;
        if (rel.isOneToOne || rel.isOneToMany || rel.isManyToOne) {
          relationTable = rel.inverseEntityMetadata.tableName;
        }
        if (rel.isManyToMany) {
          relationTable = rel.propertyName;
        }
        res[rel.propertyName] = relationTable;
        return res;
      }, {});

    return {resourceType, relations}
  }

  static getRelationNameByResourceName(resourceName: string,
                                       repo: Repository<EntityClassOrSchema>): string | undefined {
    const {relationName} = MetadataHelper.getRelationByResourceName(resourceName, repo) || {};
    return relationName;
  }

  static getRelationByResourceName(resourceName: string,
                                   repo: Repository<EntityClassOrSchema>):
    { relationName: string, relationRepo: Repository<EntityClassOrSchema> } {
    const entityRelations = MetadataHelper.getRelations(repo);

    if (!entityRelations ||
      !Array.isArray(Object.keys(entityRelations)) ||
      Object.keys(entityRelations).length === 0) return;

    const filteredRelations = Object
      .entries(entityRelations)
      .filter(entry => entry[1].resource === resourceName.replace('-', '_'));

    const [relationName, {repo: relationRepo}] =
    filteredRelations && Array.isArray(filteredRelations) && filteredRelations.shift() || [undefined, {}];

    return {relationName, relationRepo};
  }

  static async oneToOneRelationHandler(
    action: string,
    id: number,
    relationId: number,
    instance: EntityClassOrSchema,
    relationInstance: EntityClassOrSchema,
    relationName: string,
    relationRepo: Repository<EntityClassOrSchema>,
    repo: Repository<EntityClassOrSchema>): Promise<EntityClassOrSchema> {
    const relationRepoMetadata = MetadataHelper.getRelationRepoMetadata(relationRepo, repo);

    const isRelationActive = relationRepoMetadata?.joinColumns.length > 0;

    const actionTable =
      isRelationActive ?
        relationRepo.metadata.tableName :
        repo.metadata.tableName;

    const actionId = isRelationActive ? relationId : id;

    let actionRelationId = 'NULL';
    if (action === "update") {
      actionRelationId = isRelationActive ?  `'${id}'` : `'${relationId}'` ;
    }

    const joinColumn =
      relationRepoMetadata?.joinColumns.length > 0 ?
        relationRepoMetadata?.joinColumns[0].givenDatabaseName :
        (relationRepoMetadata?.inverseEntityMetadata.relations[0].joinColumns.length > 0 &&
          relationRepoMetadata?.inverseEntityMetadata.relations[0].joinColumns[0].givenDatabaseName);

    if (!joinColumn || !actionTable || !actionId) return instance;

    await repo.query(`UPDATE "${actionTable}" SET "${joinColumn}" = ${actionRelationId} WHERE "id" = '${actionId}'`);

    instance[relationName] = relationInstance;

    return instance;
  }

  static getRelationRepoMetadata(relationRepo, repo) {
    return relationRepo.metadata.relations
      .filter(rel =>
        rel.inverseEntityMetadata.givenTableName === repo.metadata.tableName)
      .map(rel => rel)[0];
  }
}