import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lessons_workout_blocks_exercises" DROP COLUMN "quantity";
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" DROP COLUMN "quantity";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lessons_workout_blocks_exercises" ADD COLUMN "quantity" varchar;
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" ADD COLUMN "quantity" varchar;`)
}
