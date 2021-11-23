import {Repository} from "typeorm";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {BadRequestException} from "@nestjs/common";
import {paginate, PaginationTypeEnum} from 'nestjs-typeorm-paginate';

import {JsonApiServiceInterface, ParsedQueryType} from "@/libs/json-api/types";
import {MetadataHelper} from "@/libs/json-api/helpers/metadata.helper";
import {getRelationsMethodsMetadata} from "@/libs/database/decorators";
import {OPERANDS} from "@/libs/json-api/constants"
import {KeyValueType} from "@/libs/common/types/key-value.type";

export function FindInstances(
  options?: {
    searchByUniques?: boolean,
    filterRelations?: boolean
  }): MethodDecorator {
  return (target: JsonApiServiceInterface, method: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;
    const {searchByUniques: isSearchByUniques, filterRelations} = options || {};

    descriptor.value = async function (...args: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const [{id, query, payload}, repo] = args;
      Reflect.defineMetadata('InstancesCollection', [], repo.constructor);

      if (id) {
        if (isNaN(parseInt(String(id), 10))) {
          throw new BadRequestException(`Parameter 'id' should be an integer`);
        }
        return await searchByID(id, originalMethod, filterRelations, args);
      }

      if (payload && isSearchByUniques) {
        return await searchByUniques(payload, originalMethod, filterRelations, args);
      }

      if (!query) {
        Reflect.defineMetadata('InstancesCollection', [], repo.constructor);
        return originalMethod.apply(this, args);
      }

      return await searchByQueryFilters(query, originalMethod, filterRelations, args);
    }
  }
}

/**
 * Search instance by ID
 *
 * @param id
 * @param originalMethod
 * @param filterRelations
 * @param args
 */
async function searchByID(
  id: number,
  originalMethod: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  filterRelations: boolean,
  args: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const [{relation}, repo] = args;
  const relationsNames = getRelationsNames(filterRelations, relation, repo);

  const instancesCollection = [await repo.findOne(id, {relations: relationsNames.visible})]
    .filter(item => item);

  Reflect.defineMetadata('InstancesCollection', instancesCollection, repo.constructor);
  return originalMethod.apply(this, args);
}

/**
 * Searches by uniques fields (needs fo methods POST & PATCH)
 *
 * @param payload
 * @param originalMethod
 * @param filterRelations
 * @param args
 */
async function searchByUniques(
  payload: KeyValueType,
  originalMethod: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  filterRelations: boolean,
  args: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const [{relation}, repo] = args;
  const relationsNames = getRelationsNames(filterRelations, relation, repo);

  const uniqueAttributes =
    getUniqueAttributes(relationsNames.all || [], repo);

  if (isArrayEmpty(uniqueAttributes) || isArrayEmpty(Object.entries(payload))) {
    Reflect.defineMetadata('InstancesCollection', [], repo.constructor);
    return originalMethod.apply(this, args);
  }

  const searchPayload = Object.entries(payload)
    .filter(pair => uniqueAttributes.includes(pair[0]))
    .reduce((res, pair) => {
      res[pair[0]] = pair[1];
      return res;
    }, {});

  const instancesCollection = (
    await repo.find({
      where: searchPayload,
      relations: relationsNames.visible
    })
  ).filter(item => item);

  Reflect.defineMetadata('InstancesCollection', instancesCollection, repo.constructor);
  return originalMethod.apply(this, args);
}

/**
 * Searches by query filters (method getCollection: GET /resource)
 *
 * @param query
 * @param originalMethod
 * @param filterRelations
 * @param args
 */
async function searchByQueryFilters(
  query: ParsedQueryType,
  originalMethod: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  filterRelations: boolean,
  args: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const [{relation}, repo] = args;
  const relationsNames = getRelationsNames(filterRelations, relation, repo);

  const {resourceAlias, page, limit, where, values} = getWhereCondition(query)

  let queryBuilder = repo
    .createQueryBuilder(resourceAlias)
    .where(where, values);

  if (!isArrayEmpty(relationsNames.visible)) {
    for (const relation of relationsNames.visible) {
      queryBuilder = queryBuilder.leftJoinAndSelect(`${resourceAlias}.${relation}`, relation)
    }
  }

  const resourceName = repo.metadata.givenTableName.replace('_', '-');
  const {items, meta, links} =
    await paginate<EntityClassOrSchema>(
      queryBuilder,
      {page, limit, paginationType: PaginationTypeEnum.TAKE_AND_SKIP, route: `/${resourceName}`});

  const {totalItems, itemCount: currentPageItemsCount, itemsPerPage, totalPages, currentPage} = meta;
  const parsedLinks = Object.entries(links)
    .map(entry => [entry[0], entry[1] !== "" ? entry[1] : null])
    .reduce((res, entry) => {
      const [key, value] = entry;
      res[key] = value;
      return res;
    }, {});

  const instancesCollection = {
    items,
    meta: {totalItems, currentPageItemsCount, itemsPerPage, totalPages, currentPage},
    links: parsedLinks
  };

  Reflect.defineMetadata('InstancesCollection', instancesCollection, repo.constructor);
  return originalMethod.apply(this, args);
}

/**
 * Returns relationships names
 *
 * @param filterRelations
 * @param relation
 * @param repo
 */
function getRelationsNames(filterRelations: boolean, relation: string, repo: Repository<EntityClassOrSchema>):
  { visible: string[], all: string[] } {
  const entityRelations = MetadataHelper.getRelations(repo); // metadata form Entity

  const filteredRelationName =
    filterRelations && MetadataHelper.getRelationNameByResourceName(relation, repo); //arg relation name if it needs to filter relations

  const resourceEntity = repo.metadata.target;
  const entityRelationsMethodsMetadata = getRelationsMethodsMetadata(resourceEntity); //metadata from customs Entity decorators

  const visibleEntityRelationsNames = entityRelationsMethodsMetadata && // should not be visible relations without get methods
    Object.entries(entityRelationsMethodsMetadata)
      .filter(entry => Object.keys(entry[1]).includes("getCollection") || Object.keys(entry[1]).includes("getOne"))
      .map(entry => entry.shift())
      .map(relationResourceName => MetadataHelper.getRelationNameByResourceName(String(relationResourceName), repo));

  const visibleRelationsNames =
    (filteredRelationName && [filteredRelationName]) ||
    Object
      .keys(entityRelations)
      .filter(relationName => visibleEntityRelationsNames.includes(relationName));

  const allRelationsNames = Object.keys(entityRelations)

  return {visible: visibleRelationsNames, all: allRelationsNames}
}

/**
 * Returns unique attributes
 *
 * @param allEntityRelationsNames
 * @param repo
 */
function getUniqueAttributes(allEntityRelationsNames: string[], repo: Repository<EntityClassOrSchema>): string[] {
  if (isArrayEmpty(repo?.metadata?.uniques)) {
    return;
  }

  return repo
    .metadata
    .uniques[0]
    .columns
    .map(u => u.propertyName)
    .filter(u => !allEntityRelationsNames.includes(u))
    .filter(u => u);
}

/**
 * Returns true if arr is empty or undefined
 *
 * @param arr
 */
function isArrayEmpty(arr: unknown[]): boolean {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return true;
  }
  return false
}

/**
 * Return 'where' condition object parsing incoming query ('where' string, values and resourceAlias)
 *
 * @param query
 */
function getWhereCondition(query: ParsedQueryType): {
  resourceAlias: string,
  page: number,
  limit: number,
  where: string,
  values: { [key: string]: string | string[] | number | number[] | null }
} {
  const page = (query.page && parseInt(String(query.page), 10)) || 1;
  const limit = (query.limit && parseInt(String(query.limit), 10)) || 100;

  const resourceAlias = 'resource';
  const values = {};

  const where = Object.entries(query)
    .filter(entry => !['page', 'limit'].includes(entry[0]))
    .map(entry => {
      const fieldName = entry[0];
      let value = entry[1];
      let dbField = `${resourceAlias}."${fieldName}"`;
      let operandCommand = `= :${fieldName}`;

      if (typeof value === 'object') {
        const valueEntry = Object.entries(value).shift();
        const operand = valueEntry[0];
        let operandValue = valueEntry[1];

        operandCommand = OPERANDS[operand];
        if (!operandCommand) {
          throw new BadRequestException(`Unsupported operand: ${operand}`);
        }

        if (['like', 'left-like', 'right-like'].includes(operand)) {
          operandCommand = operandCommand.replace('&', String(operandValue).toLowerCase());
          dbField = `LOWER(${resourceAlias}."${fieldName}")`;
          operandValue = undefined;
        } else if (['in', 'nin'].includes(operand)) {
          operandCommand = operandCommand.replace('&', fieldName);
          operandValue = String(operandValue).split(',');
        } else if (['isnull', 'isnotnull'].includes(operand)) {
          operandValue = undefined;
        } else {
          operandCommand = `${operandCommand} :${fieldName}`;
        }
        value = operandValue;
      }

      values[fieldName] = value;

      return `${dbField} ${operandCommand}`;
    })
    .join(' AND ');

  return {resourceAlias, page, limit, where, values};
}
