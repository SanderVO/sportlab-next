import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "pages_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "posts_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "posts_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "posts_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "media_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "media_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "media_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "documents_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "documents_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "documents_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lesson_templates_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lesson_templates_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lesson_templates_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "events_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "events_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "events_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "programs_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "programs_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "programs_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lesson_exercise_tracking_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lesson_exercise_tracking_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lesson_exercise_tracking_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "program_enrollments_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "program_enrollments_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "program_enrollments_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "event_registrations_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "event_registrations_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "event_registrations_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "health_measurements_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "health_measurements_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "health_measurements_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "coach_notes_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "coach_notes_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "coach_notes_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lessons_delete";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "exercises_delete";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "lessons_delete" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "exercises_delete" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "pages_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "posts_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "posts_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "posts_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "media_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "media_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "media_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "documents_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "documents_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "documents_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lesson_templates_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lesson_templates_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lesson_templates_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "events_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "events_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "events_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "programs_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "programs_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "programs_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lesson_exercise_tracking_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lesson_exercise_tracking_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "lesson_exercise_tracking_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "program_enrollments_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "program_enrollments_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "program_enrollments_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "event_registrations_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "event_registrations_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "event_registrations_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "health_measurements_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "health_measurements_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "health_measurements_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "coach_notes_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "coach_notes_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "coach_notes_update";`)
}
