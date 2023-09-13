"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1694543036257 = void 0;
class Migrations1694543036257 {
    constructor() {
        this.name = 'Migrations1694543036257';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum" AS ENUM('radio', 'checkbox')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "quiz" character varying NOT NULL, "options" text array NOT NULL, "answer" text array NOT NULL, "rank" character varying NOT NULL, "type" "public"."question_type_enum" NOT NULL DEFAULT 'radio', CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timeStart" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "timeEnd" TIMESTAMP NOT NULL, "time" integer NOT NULL, CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "birthday" TIMESTAMP DEFAULT '"2023-09-12T18:24:10.700Z"', "phone" character varying, "address" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "result" ("id" SERIAL NOT NULL, "userAnswer" jsonb NOT NULL, "score" integer NOT NULL, "timeStart" TIMESTAMP NOT NULL DEFAULT 'now()', "examId" integer, "userId" integer, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam_questions_question" ("examId" integer NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_819e09c139d395314f8ca9c0e50" PRIMARY KEY ("examId", "questionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11295ef1e6332790d25510c17b" ON "exam_questions_question" ("examId") `);
        await queryRunner.query(`CREATE INDEX "IDX_28266c51d2322010c18960f486" ON "exam_questions_question" ("questionId") `);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_15d91965444a69aea2b8017a488" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_601be29c4bf75f59d0261f769ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_questions_question" ADD CONSTRAINT "FK_11295ef1e6332790d25510c17b4" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "exam_questions_question" ADD CONSTRAINT "FK_28266c51d2322010c18960f4862" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "exam_questions_question" DROP CONSTRAINT "FK_28266c51d2322010c18960f4862"`);
        await queryRunner.query(`ALTER TABLE "exam_questions_question" DROP CONSTRAINT "FK_11295ef1e6332790d25510c17b4"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_601be29c4bf75f59d0261f769ba"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_15d91965444a69aea2b8017a488"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28266c51d2322010c18960f486"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11295ef1e6332790d25510c17b"`);
        await queryRunner.query(`DROP TABLE "exam_questions_question"`);
        await queryRunner.query(`DROP TABLE "result"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "exam"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
    }
}
exports.Migrations1694543036257 = Migrations1694543036257;
//# sourceMappingURL=1694543036257-migrations.js.map