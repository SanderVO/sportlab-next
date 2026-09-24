import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_cycle_timeline_stages\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_stages_image_idx\` ON \`pages_blocks_cycle_timeline_stages\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cycle_timeline\` ADD \`footer_content\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cycle_timeline_stages\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_stages_image_idx\` ON \`_pages_v_blocks_cycle_timeline_stages\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cycle_timeline\` ADD \`footer_content\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_cycle_timeline_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`week_label\` text,
  	\`phase_title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cycle_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_cycle_timeline_stages\`("_order", "_parent_id", "id", "week_label", "phase_title", "description") SELECT "_order", "_parent_id", "id", "week_label", "phase_title", "description" FROM \`pages_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_cycle_timeline_stages\` RENAME TO \`pages_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_stages_order_idx\` ON \`pages_blocks_cycle_timeline_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_stages_parent_id_idx\` ON \`pages_blocks_cycle_timeline_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_cycle_timeline_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`week_label\` text,
  	\`phase_title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cycle_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_cycle_timeline_stages\`("_order", "_parent_id", "id", "week_label", "phase_title", "description", "_uuid") SELECT "_order", "_parent_id", "id", "week_label", "phase_title", "description", "_uuid" FROM \`_pages_v_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_cycle_timeline_stages\` RENAME TO \`_pages_v_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_stages_order_idx\` ON \`_pages_v_blocks_cycle_timeline_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_stages_parent_id_idx\` ON \`_pages_v_blocks_cycle_timeline_stages\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cycle_timeline\` DROP COLUMN \`footer_content\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cycle_timeline\` DROP COLUMN \`footer_content\`;`)
}
