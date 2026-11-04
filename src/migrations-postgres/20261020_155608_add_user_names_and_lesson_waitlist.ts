import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_lesson_enrollments_status" ADD VALUE IF NOT EXISTS 'waitlisted';
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "first_name" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_name" varchar;
  ALTER TABLE "lesson_enrollments" ADD COLUMN IF NOT EXISTS "waitlisted_at" timestamp(3) with time zone;
  ALTER TABLE "lesson_enrollments" ADD COLUMN IF NOT EXISTS "waitlist_notified_at" timestamp(3) with time zone;`)

  // First word of the existing name becomes the first name, the rest the last name.
  await db.execute(sql`
   UPDATE "users"
  SET "first_name" = substring(btrim("name") from '^[^[:space:]]+'),
      "last_name" = NULLIF(btrim(regexp_replace(btrim("name"), '^[^[:space:]]+', '')), '')
  WHERE btrim(coalesce("name", '')) <> ''
    AND "first_name" IS NULL AND "last_name" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lesson_enrollments" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "lesson_enrollments" ALTER COLUMN "status" SET DEFAULT 'assigned'::text;
  DROP TYPE "public"."enum_lesson_enrollments_status";
  CREATE TYPE "public"."enum_lesson_enrollments_status" AS ENUM('assigned', 'started', 'completed', 'cancelled');
  ALTER TABLE "lesson_enrollments" ALTER COLUMN "status" SET DEFAULT 'assigned'::"public"."enum_lesson_enrollments_status";
  ALTER TABLE "lesson_enrollments" ALTER COLUMN "status" SET DATA TYPE "public"."enum_lesson_enrollments_status" USING "status"::"public"."enum_lesson_enrollments_status";
  ALTER TABLE "users" DROP COLUMN "first_name";
  ALTER TABLE "users" DROP COLUMN "last_name";
  ALTER TABLE "lesson_enrollments" DROP COLUMN "waitlisted_at";
  ALTER TABLE "lesson_enrollments" DROP COLUMN "waitlist_notified_at";`)
}
