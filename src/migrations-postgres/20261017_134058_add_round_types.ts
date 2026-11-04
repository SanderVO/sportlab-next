import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lessons_workout_blocks_round_types_type" AS ENUM('work', 'rest', 'active_rest');
  CREATE TYPE "public"."enum_round_types_type" AS ENUM('work', 'rest', 'active_rest');
  CREATE TABLE "lessons_workout_blocks_round_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_lessons_workout_blocks_round_types_type" DEFAULT 'work',
  	"seconds" numeric
  );
  
  CREATE TABLE "round_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_round_types_type" DEFAULT 'work',
  	"seconds" numeric
  );
  
  ALTER TABLE "lessons_workout_blocks_round_types" ADD CONSTRAINT "lessons_workout_blocks_round_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_workout_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "round_types" ADD CONSTRAINT "round_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lesson_templates_default_workout_blocks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lessons_workout_blocks_round_types_order_idx" ON "lessons_workout_blocks_round_types" USING btree ("_order");
  CREATE INDEX "lessons_workout_blocks_round_types_parent_id_idx" ON "lessons_workout_blocks_round_types" USING btree ("_parent_id");
  CREATE INDEX "round_types_order_idx" ON "round_types" USING btree ("_order");
  CREATE INDEX "round_types_parent_id_idx" ON "round_types" USING btree ("_parent_id");
`)

  // Convert the old per-exercise work / rest seconds into round types before the columns are dropped.
  // Each exercise becomes a work round (plus a rest round when rest > 0), as long as the sequence fits
  // in the 10 rounds allowed. Otherwise one work / rest pair is used and "rounds" is multiplied by the
  // number of exercises, which gives the same timeline.
  for (const target of [
    {
      blocks: "lessons_workout_blocks",
      exercises: "lessons_workout_blocks_exercises",
      roundTypes: "lessons_workout_blocks_round_types",
      enumType: "enum_lessons_workout_blocks_round_types_type",
    },
    {
      blocks: "lesson_templates_default_workout_blocks",
      exercises: "lesson_templates_default_workout_blocks_exercises",
      roundTypes: "round_types",
      enumType: "enum_round_types_type",
    },
  ]) {
    const { blocks, exercises, roundTypes, enumType } = target
    await db.execute(
      sql.raw(`
  CREATE TEMP TABLE _interval_blocks AS
  SELECT b."id", b."work_seconds" AS w, COALESCE(b."rest_seconds", 0) AS r,
    (SELECT count(*) FROM "${exercises}" e WHERE e."_parent_id" = b."id") AS n
  FROM "${blocks}" b
  WHERE b."timer_mode" = 'intervals' AND b."work_seconds" > 0;

  DELETE FROM _interval_blocks WHERE n = 0;

  INSERT INTO "${roundTypes}" ("_order", "_parent_id", "id", "type", "seconds")
  SELECT i * k + j + 1, ib."id", gen_random_uuid()::text,
    (CASE WHEN j = 0 THEN 'work' ELSE 'rest' END)::"public"."${enumType}",
    CASE WHEN j = 0 THEN ib.w ELSE ib.r END
  FROM (SELECT *, CASE WHEN r > 0 THEN 2 ELSE 1 END AS k FROM _interval_blocks) ib
  CROSS JOIN LATERAL generate_series(0, CASE WHEN ib.n * ib.k <= 10 THEN ib.n - 1 ELSE 0 END) AS i
  CROSS JOIN LATERAL generate_series(0, ib.k - 1) AS j;

  UPDATE "${blocks}" b SET "rounds" = b."rounds" * ib.n
  FROM _interval_blocks ib
  WHERE b."id" = ib."id" AND b."rounds" > 0
    AND ib.n * (CASE WHEN ib.r > 0 THEN 2 ELSE 1 END) > 10;

  DROP TABLE _interval_blocks;`),
    )
  }

  await db.execute(sql`
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "work_seconds";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "rest_seconds";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "work_seconds";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "rest_seconds";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "lessons_workout_blocks_round_types" CASCADE;
  DROP TABLE "round_types" CASCADE;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "work_seconds" numeric;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "rest_seconds" numeric;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "work_seconds" numeric;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "rest_seconds" numeric;
  DROP TYPE "public"."enum_lessons_workout_blocks_round_types_type";
  DROP TYPE "public"."enum_round_types_type";`)
}
