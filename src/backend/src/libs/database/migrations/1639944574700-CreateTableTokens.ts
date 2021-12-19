import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";

export class CreateTableTokens1639944574700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tokens',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            unsigned: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'contractAddress',
            type: 'varchar',
            length: '128',
            isNullable: false
          }),
          new TableColumn({
            name: 'ownerAddress',
            type: 'varchar',
            length: '128',
            isNullable: false
          }),
          new TableColumn({
            name: 'tokenId',
            type: 'int',
            isNullable: false
          }),
          new TableColumn({
            name: 'detail',
            type: 'json',
            isNullable: false
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          }),
        ]
      })
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tokens');
  }
}
