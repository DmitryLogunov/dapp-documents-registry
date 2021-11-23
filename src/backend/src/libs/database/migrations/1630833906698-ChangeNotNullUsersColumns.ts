import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeNotNullColumnUserIDinTableUsersProfiles1630833906698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nonce" DROP NOT NULL`);
  }

  public async down(): Promise<void> {
  }
}
