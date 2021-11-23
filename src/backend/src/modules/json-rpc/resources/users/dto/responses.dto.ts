export class GetOrCreateUserResponseDto {
  accountAddress: string;
  nonce: string;
}

export class AuthenticateUserResponseDto {
  accessToken: string|null;
}