import {applyDecorators} from "@nestjs/common";
import {Entity} from "typeorm";
import {ResourceInfo} from "@/libs/database/decorators";

type ApiEntityOptionsType = {
  table: string,
  methods: {[key: string]: string}
}

export function ApiEntity(options:  ApiEntityOptionsType): ClassDecorator {
  const {table, methods} = options;
  const resource = table?.replace('_', '-');

  return applyDecorators(Entity(table), ResourceInfo({resource, methods}));
}