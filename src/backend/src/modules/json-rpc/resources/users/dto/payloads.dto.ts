export class GetOrCreateUserPayloadDto {
  accountAddress: string;
}

export class AuthenticateUserPayloadDto {
  accountAddress: string;
  signature: string;
}