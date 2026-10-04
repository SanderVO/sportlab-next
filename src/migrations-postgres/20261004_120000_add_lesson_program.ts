import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "program_id" integer;
  DO $$ BEGIN
   ALTER TABLE "lessons" ADD CONSTRAINT "lessons_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "lessons_program_idx" ON "lessons" USING btree ("program_id");

  UPDATE "lessons" SET "program_id" = s."_parent_id"
  FROM "programs_schedule" s
  WHERE s."lessons_id" = "lessons"."id" AND "lessons"."program_id" IS NULL;

  DROP TABLE IF EXISTS "programs_schedule" CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "programs_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"lessons_id" integer NOT NULL
  );
  ALTER TABLE "programs_schedule" ADD CONSTRAINT "programs_schedule_lessons_id_lessons_id_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_schedule" ADD CONSTRAINT "programs_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_schedule_order_idx" ON "programs_schedule" USING btree ("_order");
  CREATE INDEX "programs_schedule_parent_id_idx" ON "programs_schedule" USING btree ("_parent_id");
  CREATE INDEX "programs_schedule_lessons_idx" ON "programs_schedule" USING btree ("lessons_id");

  INSERT INTO "programs_schedule" ("_order", "_parent_id", "id", "date", "lessons_id")
  SELECT row_number() OVER (PARTITION BY "program_id" ORDER BY "start_date"), "program_id", md5(random()::text || "id"::text), COALESCE("start_date", now()), "id"
  FROM "lessons" WHERE "program_id" IS NOT NULL;

  ALTER TABLE "lessons" DROP CONSTRAINT IF EXISTS "lessons_program_id_programs_id_fk";
  DROP INDEX IF EXISTS "lessons_program_idx";
  ALTER TABLE "lessons" DROP COLUMN IF EXISTS "program_id";`)
}
