import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lesson_enrollments_attendance" AS ENUM('present', 'absent');
  ALTER TYPE "public"."enum_lessons_status" ADD VALUE 'cancelled';
  CREATE TABLE "coach_notes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"author_id" integer,
  	"body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "lessons" ADD COLUMN "cancelled_at" timestamp(3) with time zone;
  ALTER TABLE "lessons" ADD COLUMN "cancelled_by_id" integer;
  ALTER TABLE "lessons" ADD COLUMN "cancel_reason" varchar;
  ALTER TABLE "lesson_enrollments" ADD COLUMN "attendance" "enum_lesson_enrollments_attendance";
  ALTER TABLE "lesson_enrollments" ADD COLUMN "attendance_marked_at" timestamp(3) with time zone;
  ALTER TABLE "lesson_enrollments" ADD COLUMN "attendance_marked_by_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "coach_notes_id" integer;
  ALTER TABLE "coach_notes" ADD CONSTRAINT "coach_notes_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coach_notes" ADD CONSTRAINT "coach_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "coach_notes_member_idx" ON "coach_notes" USING btree ("member_id");
  CREATE INDEX "coach_notes_author_idx" ON "coach_notes" USING btree ("author_id");
  CREATE INDEX "coach_notes_updated_at_idx" ON "coach_notes" USING btree ("updated_at");
  CREATE INDEX "coach_notes_created_at_idx" ON "coach_notes" USING btree ("created_at");
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_cancelled_by_id_users_id_fk" FOREIGN KEY ("cancelled_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_enrollments" ADD CONSTRAINT "lesson_enrollments_attendance_marked_by_id_users_id_fk" FOREIGN KEY ("attendance_marked_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coach_notes_fk" FOREIGN KEY ("coach_notes_id") REFERENCES "public"."coach_notes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lessons_cancelled_by_idx" ON "lessons" USING btree ("cancelled_by_id");
  CREATE INDEX "lesson_enrollments_attendance_marked_by_idx" ON "lesson_enrollments" USING btree ("attendance_marked_by_id");
  CREATE INDEX "payload_locked_documents_rels_coach_notes_id_idx" ON "payload_locked_documents_rels" USING btree ("coach_notes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "coach_notes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "coach_notes" CASCADE;
  ALTER TABLE "lessons" DROP CONSTRAINT "lessons_cancelled_by_id_users_id_fk";
  
  ALTER TABLE "lesson_enrollments" DROP CONSTRAINT "lesson_enrollments_attendance_marked_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_coach_notes_fk";

  ALTER TABLE "lessons" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "lessons" ALTER COLUMN "status" SET DEFAULT 'closed'::text;
  UPDATE "lessons" SET "status" = 'closed' WHERE "status" = 'cancelled';
  DROP TYPE "public"."enum_lessons_status";
  CREATE TYPE "public"."enum_lessons_status" AS ENUM('open', 'closed');
  ALTER TABLE "lessons" ALTER COLUMN "status" SET DEFAULT 'closed'::"public"."enum_lessons_status";
  ALTER TABLE "lessons" ALTER COLUMN "status" SET DATA TYPE "public"."enum_lessons_status" USING "status"::"public"."enum_lessons_status";
  DROP INDEX "lessons_cancelled_by_idx";
  DROP INDEX "lesson_enrollments_attendance_marked_by_idx";
  DROP INDEX "payload_locked_documents_rels_coach_notes_id_idx";
  ALTER TABLE "lessons" DROP COLUMN "cancelled_at";
  ALTER TABLE "lessons" DROP COLUMN "cancelled_by_id";
  ALTER TABLE "lessons" DROP COLUMN "cancel_reason";
  ALTER TABLE "lesson_enrollments" DROP COLUMN "attendance";
  ALTER TABLE "lesson_enrollments" DROP COLUMN "attendance_marked_at";
  ALTER TABLE "lesson_enrollments" DROP COLUMN "attendance_marked_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "coach_notes_id";
  DROP TYPE "public"."enum_lesson_enrollments_attendance";`)
}
