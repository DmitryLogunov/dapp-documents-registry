import {UsersEntity} from "@/libs/database/entities";
import {JsonApiController} from "@/libs/json-api";

@JsonApiController(UsersEntity)
export class UsersController {}