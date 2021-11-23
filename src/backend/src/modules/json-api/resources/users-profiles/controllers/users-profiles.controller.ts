import {UsersProfilesEntity} from "@/libs/database/entities";
import {JsonApiController} from "@/libs/json-api";

@JsonApiController(UsersProfilesEntity)
export class UsersProfilesController {}