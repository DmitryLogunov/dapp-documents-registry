import { HttpStatus } from "@nestjs/common";

export class JsonApiError extends Error {
  public httpStatus: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "JsonApiError";
    this.httpStatus = status || HttpStatus.BAD_REQUEST;
  }
}