import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738658816355 implements MigrationInterface {
    name = 'Migration1738658816355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "salaryOrDailyRate" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "salaryOrDailyRate" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "balances" ALTER COLUMN "balance" TYPE numeric`);
    }

}
