import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lessons_workout_blocks_timer_mode" AS ENUM('countdown', 'emom', 'amrap', 'rounds', 'intervals');
  CREATE TYPE "public"."enum_lesson_templates_default_workout_blocks_timer_mode" AS ENUM('countdown', 'emom', 'amrap', 'rounds', 'intervals');
  ALTER TABLE "lessons_workout_blocks_exercises" ADD COLUMN "quantity" varchar;
  ALTER TABLE "lessons_workout_blocks_exercises" ADD COLUMN "rotating" boolean DEFAULT false;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "timer_mode" "enum_lessons_workout_blocks_timer_mode" DEFAULT 'countdown';
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "highlight_exercises" boolean DEFAULT false;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "interval_seconds" numeric;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "rounds" numeric;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "work_seconds" numeric;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "rest_seconds" numeric;
  ALTER TABLE "lessons_workout_blocks" ADD COLUMN "poa" varchar;
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" ADD COLUMN "quantity" varchar;
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" ADD COLUMN "rotating" boolean DEFAULT false;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "timer_mode" "enum_lesson_templates_default_workout_blocks_timer_mode" DEFAULT 'countdown';
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "highlight_exercises" boolean DEFAULT false;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "interval_seconds" numeric;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "rounds" numeric;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "work_seconds" numeric;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "rest_seconds" numeric;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD COLUMN "poa" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lessons_workout_blocks_exercises" DROP COLUMN "quantity";
  ALTER TABLE "lessons_workout_blocks_exercises" DROP COLUMN "rotating";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "timer_mode";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "highlight_exercises";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "interval_seconds";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "rounds";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "work_seconds";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "rest_seconds";
  ALTER TABLE "lessons_workout_blocks" DROP COLUMN "poa";
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" DROP COLUMN "quantity";
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" DROP COLUMN "rotating";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "timer_mode";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "highlight_exercises";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "interval_seconds";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "rounds";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "work_seconds";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "rest_seconds";
  ALTER TABLE "lesson_templates_default_workout_blocks" DROP COLUMN "poa";
  DROP TYPE "public"."enum_lessons_workout_blocks_timer_mode";
  DROP TYPE "public"."enum_lesson_templates_default_workout_blocks_timer_mode";`)
}
