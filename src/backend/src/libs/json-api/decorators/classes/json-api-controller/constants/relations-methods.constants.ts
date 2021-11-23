import {
  GetCollectionMixin,
  GetOneMixin,
  CreateMixin,
  UpdateMixin,
  DeleteMixin,
  GetRelationsCollectionMixin_0,
  GetRelationsOneMixin_0,
  CreateRelationsMixin_0,
  UpdateRelationsMixin_0,
  DeleteRelationsMixin_0,
  GetRelationsCollectionMixin_1,
  GetRelationsOneMixin_1,
  CreateRelationsMixin_1,
  UpdateRelationsMixin_1,
  DeleteRelationsMixin_1,
  GetRelationsCollectionMixin_2,
  GetRelationsOneMixin_2,
  CreateRelationsMixin_2,
  UpdateRelationsMixin_2,
  DeleteRelationsMixin_2,
  GetRelationsCollectionMixin_3,
  GetRelationsOneMixin_3,
  CreateRelationsMixin_3,
  UpdateRelationsMixin_3,
  DeleteRelationsMixin_3,
  GetRelationsCollectionMixin_4,
  GetRelationsOneMixin_4,
  CreateRelationsMixin_4,
  UpdateRelationsMixin_4,
  DeleteRelationsMixin_4
} from "../index";

export const METHODS_MIXINS = {
  resource: {
    getCollection: GetCollectionMixin,
    getOne: GetOneMixin,
    create: CreateMixin,
    update: UpdateMixin,
    delete: DeleteMixin
  },
  relations: [
    {
      getCollection: GetRelationsCollectionMixin_0,
      getOne: GetRelationsOneMixin_0,
      create: CreateRelationsMixin_0,
      update: UpdateRelationsMixin_0,
      delete: DeleteRelationsMixin_0
    },
    {
      getCollection: GetRelationsCollectionMixin_1,
      getOne: GetRelationsOneMixin_1,
      create: CreateRelationsMixin_1,
      update: UpdateRelationsMixin_1,
      delete: DeleteRelationsMixin_1
    },
    {
      getCollection: GetRelationsCollectionMixin_2,
      getOne: GetRelationsOneMixin_2,
      create: CreateRelationsMixin_2,
      update: UpdateRelationsMixin_2,
      delete: DeleteRelationsMixin_2
    },
    {
      getCollection: GetRelationsCollectionMixin_3,
      getOne: GetRelationsOneMixin_3,
      create: CreateRelationsMixin_3,
      update: UpdateRelationsMixin_3,
      delete: DeleteRelationsMixin_3
    },
    {
      getCollection: GetRelationsCollectionMixin_4,
      getOne: GetRelationsOneMixin_4,
      create: CreateRelationsMixin_4,
      update: UpdateRelationsMixin_4,
      delete: DeleteRelationsMixin_4
    }
  ]
}

export type AvailableMethods = 'getCollection'|'getOne'|'create'|'update'|'delete';