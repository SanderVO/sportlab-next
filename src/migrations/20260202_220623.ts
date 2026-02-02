import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`position\` numeric;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_team\` ADD \`sort_by\` text DEFAULT 'name';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_team\` ADD \`sort_by\` text DEFAULT 'name';`)
  await db.run(sql`ALTER TABLE \`header_nav_items\` ADD \`initially_visible\` integer DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`position\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_team\` DROP COLUMN \`sort_by\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_team\` DROP COLUMN \`sort_by\`;`)
  await db.run(sql`ALTER TABLE \`header_nav_items\` DROP COLUMN \`initially_visible\`;`)
}
