import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1683228687877 implements MigrationInterface {
    name = 'Migration1683228687877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('ACCEPTED', 'DECLINED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "status" "public"."transactions_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "sourceAccId" integer, "destinationAccId" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'DELETED')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "phone" character varying NOT NULL, "phoneCode" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "identityNumber" character varying NOT NULL, "birthDate" date, "status" "public"."users_status_enum" NOT NULL DEFAULT 'PENDING', "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."accountParams_type_enum" AS ENUM('TERM_DEPOSIT', 'FIXED_DEPOSIT')`);
        await queryRunner.query(`CREATE TYPE "public"."accountParams_status_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "accountParams" ("id" SERIAL NOT NULL, "type" "public"."accountParams_type_enum" NOT NULL DEFAULT 'FIXED_DEPOSIT', "interestRate" numeric(10,2) NOT NULL, "term" integer NOT NULL DEFAULT '6', "amount" numeric(10,2) NOT NULL DEFAULT '0', "interestAmount" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."accountParams_status_enum" NOT NULL DEFAULT 'OPEN', "nextInterestPayDate" TIMESTAMP, "lastInterestPayDate" TIMESTAMP, "interestPayCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_c038345b5a2519af2d3d339ff41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."accounts_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."accounts_type_enum" AS ENUM('CHECKING_ACCOUNT', 'SAVING_ACCOUNT')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "iban" character varying NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."accounts_status_enum" NOT NULL DEFAULT 'ACTIVE', "type" "public"."accounts_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "paramsId" integer, CONSTRAINT "REL_2b76c3a9d4eecc4a395936d51c" UNIQUE ("paramsId"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."accountHistories_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."accountHistories_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "accountHistories" ("id" SERIAL NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."accountHistories_status_enum" NOT NULL DEFAULT 'ACTIVE', "action" "public"."accountHistories_action_enum" NOT NULL DEFAULT 'UPDATED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "accountId" integer, CONSTRAINT "PK_9263123c37c902b72be9d8d4021" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interests" ("id" SERIAL NOT NULL, "rate" numeric NOT NULL, "minMonth" smallint NOT NULL, "maxMonth" smallint NOT NULL, "minAmount" integer NOT NULL, "maxAmount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a2dc7b6f9a8bcf9e3f9312a879d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_85370f406843ab6c2d8057e9d13" FOREIGN KEY ("sourceAccId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d1bc4e108f1e86533b067025b63" FOREIGN KEY ("destinationAccId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_2b76c3a9d4eecc4a395936d51cb" FOREIGN KEY ("paramsId") REFERENCES "accountParams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accountHistories" ADD CONSTRAINT "FK_2438dc23af193b3f75a468ac365" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accountHistories" DROP CONSTRAINT "FK_2438dc23af193b3f75a468ac365"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_2b76c3a9d4eecc4a395936d51cb"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d1bc4e108f1e86533b067025b63"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_85370f406843ab6c2d8057e9d13"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`DROP TABLE "interests"`);
        await queryRunner.query(`DROP TABLE "accountHistories"`);
        await queryRunner.query(`DROP TYPE "public"."accountHistories_action_enum"`);
        await queryRunner.query(`DROP TYPE "public"."accountHistories_status_enum"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_status_enum"`);
        await queryRunner.query(`DROP TABLE "accountParams"`);
        await queryRunner.query(`DROP TYPE "public"."accountParams_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."accountParams_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
