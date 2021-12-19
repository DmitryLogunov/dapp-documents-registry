import {
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import {ApiEntity,ApiColumn} from "@/libs/database/decorators";

@ApiEntity({
  table: "tokens",
  methods: {
    getCollection: "Получить список токенов",
    getOne: "Получить токен по ID"
  }
})
export class TokensEntity {
  @PrimaryGeneratedColumn()
  @ApiColumn({
    isPrimary: true,
    name: 'id',
    type: 'number',
    description: 'ID токена',
    required: false,
    example: 10
  })
  id: number;

  @Column({
    name: 'contractAddress',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'contractAddress',
    type: 'string',
    default: 'NULL',
    description: 'Contract address',
    required: true,
    example: '0x34527935d54a8175d1eaf52857ec880df7eb5c'
  })
  public contractAddress: string;

  @Column({
    name: 'ownerAddress',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'ownerAddress',
    type: 'string',
    default: 'NULL',
    description: 'Owner address of token',
    required: true,
    example: '0x76f6e27935d54a8175d1eaf52857ec880df7eb5c'
  })
  public ownerAddress: string;

  @Column({
    name: 'tokenId',
    type: 'int',
    nullable: false,
  })
  @ApiColumn({
    name: 'tokenId',
    type: 'number',
    description: 'ID токена',
    required: true,
    example: '4'
  })
  public tokenId: number;

  @Column({
    name: 'detail',
    type: 'json',
    nullable: false,
  })
  @ApiColumn({
    name: 'detail',
    type: 'json',
    description: 'Detail token info',
    required: true
  })
  public detail: unknown;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  @ApiColumn({
    name: 'createdAt',
    type: 'datetime',
    default: 'CURRENT_TIMESTAMP',
    description: 'Дата создания',
    example: '2021-01-01 14:00:00'
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  @ApiColumn({
    name: 'updatedAt',
    type: 'datetime',
    description: 'Дата последнего обновления',
    example: '2021-08-01 11:00:00'
  })
  public updatedAt: Date;
}