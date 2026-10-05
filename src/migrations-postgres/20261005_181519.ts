import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Intentionally empty. The lesson `program` change (new `lessons.program_id`
 * column, data copy from `programs_schedule`, dropping `programs_schedule`) is
 * done by 20261004_120000_add_lesson_program. This migration only exists to
 * keep the matching schema snapshot (20261005_181519.json) in place.
 */
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}
