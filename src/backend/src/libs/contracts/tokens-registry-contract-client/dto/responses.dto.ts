export class TokenCreateResponseDto {
  nonce: number;
}

export class TokenIdResponseDto {
  type: string;
  hex: string
}


export class TokenInfoResponseDto {
  tokenId: TokenIdResponseDto;
  metadataURI: string;
}