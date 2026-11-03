import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_language" AS ENUM('nl', 'en');
  ALTER TABLE "users" ADD COLUMN "language" "enum_users_language" DEFAULT 'nl' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "language";
  DROP TYPE "public"."enum_users_language";`)
}
