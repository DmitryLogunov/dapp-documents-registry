export class GetAccountTokensPayloadDto {
  accountAddress: string;
}

export class CreateTokenPayloadDto {
  ownerAddress: string;
  metadataURI: string;
}

export class TransferTokensPayloadDto {
  fromAccountAddress: string;
  toAccountAddress: string;
  tokenIndex: number;
}
