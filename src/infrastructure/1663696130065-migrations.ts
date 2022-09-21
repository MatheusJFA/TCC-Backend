import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1663696130065 implements MigrationInterface {
    name = 'migrations1663696130065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tokens_type_enum" AS ENUM('ACCESS_TOKEN', 'REFRESH_TOKEN', 'VERIFY_EMAIL', 'RESET_PASSWORD')`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "jwt" character varying NOT NULL, "type" "tokens_type_enum" NOT NULL, "expires" TIMESTAMP NOT NULL, "clientId" uuid, "helperId" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "clients_sex_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "clients_role_enum" AS ENUM('VISITOR', 'USER', 'HELPER', 'MODERATOR', 'ADMINISTRATOR')`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "birthdate" TIMESTAMP NOT NULL, "sex" "clients_sex_enum" NOT NULL, "role" "clients_role_enum" NOT NULL, "image" character varying NOT NULL, "isEmailVerified" boolean NOT NULL, "height" numeric NOT NULL, "weight" numeric NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "helpers_sex_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "helpers_role_enum" AS ENUM('VISITOR', 'USER', 'HELPER', 'MODERATOR', 'ADMINISTRATOR')`);
        await queryRunner.query(`CREATE TYPE "helpers_occupation_enum" AS ENUM('PERSONAL_TRAINNER', 'PSYCHOLOGIST', 'NUTRITIONIST', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "helpers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "birthdate" TIMESTAMP NOT NULL, "sex" "helpers_sex_enum" NOT NULL, "role" "helpers_role_enum" NOT NULL, "image" character varying NOT NULL, "isEmailVerified" boolean NOT NULL, "occupation" "helpers_occupation_enum" NOT NULL, CONSTRAINT "PK_04c83cce51f546b9970498e2c87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "certifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "image" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "helperId" uuid, CONSTRAINT "PK_fd763d412e4a1fb1b6dadd6e72b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "helpers_clients_clients" ("helpersId" uuid NOT NULL, "clientsId" uuid NOT NULL, CONSTRAINT "PK_ec22462ca6b857c197a21b2587b" PRIMARY KEY ("helpersId", "clientsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53d3cf365083518a6ff019f479" ON "helpers_clients_clients" ("helpersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a220271612248d596eb7fcbc10" ON "helpers_clients_clients" ("clientsId") `);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_6d8a8b45147acd34b4af203d650" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_2dbc4158b9bf39267554f6225a7" FOREIGN KEY ("helperId") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certifications" ADD CONSTRAINT "FK_ae95dd24aca143c78a925b70fa9" FOREIGN KEY ("helperId") REFERENCES "helpers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "helpers_clients_clients" ADD CONSTRAINT "FK_53d3cf365083518a6ff019f4794" FOREIGN KEY ("helpersId") REFERENCES "helpers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "helpers_clients_clients" ADD CONSTRAINT "FK_a220271612248d596eb7fcbc10d" FOREIGN KEY ("clientsId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "helpers_clients_clients" DROP CONSTRAINT "FK_a220271612248d596eb7fcbc10d"`);
        await queryRunner.query(`ALTER TABLE "helpers_clients_clients" DROP CONSTRAINT "FK_53d3cf365083518a6ff019f4794"`);
        await queryRunner.query(`ALTER TABLE "certifications" DROP CONSTRAINT "FK_ae95dd24aca143c78a925b70fa9"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_2dbc4158b9bf39267554f6225a7"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_6d8a8b45147acd34b4af203d650"`);
        await queryRunner.query(`DROP INDEX "IDX_a220271612248d596eb7fcbc10"`);
        await queryRunner.query(`DROP INDEX "IDX_53d3cf365083518a6ff019f479"`);
        await queryRunner.query(`DROP TABLE "helpers_clients_clients"`);
        await queryRunner.query(`DROP TABLE "certifications"`);
        await queryRunner.query(`DROP TABLE "helpers"`);
        await queryRunner.query(`DROP TYPE "helpers_occupation_enum"`);
        await queryRunner.query(`DROP TYPE "helpers_role_enum"`);
        await queryRunner.query(`DROP TYPE "helpers_sex_enum"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TYPE "clients_role_enum"`);
        await queryRunner.query(`DROP TYPE "clients_sex_enum"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TYPE "tokens_type_enum"`);
    }

}
