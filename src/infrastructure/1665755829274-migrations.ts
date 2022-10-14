import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1665755829274 implements MigrationInterface {
    name = 'migrations1665755829274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "helpers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "helpers" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "helpers" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "helpers" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "version" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "helpers" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "helpers" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "helpers" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "helpers" DROP COLUMN "createdAt"`);
    }

}
