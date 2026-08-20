import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`organization_opening_hours\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`day_of_week\` text NOT NULL,
  	\`opens\` text NOT NULL,
  	\`closes\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`organization\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`organization_opening_hours_order_idx\` ON \`organization_opening_hours\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`organization_opening_hours_parent_id_idx\` ON \`organization_opening_hours\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`organization_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`organization\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`organization_images_order_idx\` ON \`organization_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`organization_images_parent_id_idx\` ON \`organization_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`organization_images_image_idx\` ON \`organization_images\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`organization\` ADD \`price_range\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`organization_opening_hours\`;`)
  await db.run(sql`DROP TABLE \`organization_images\`;`)
  await db.run(sql`ALTER TABLE \`organization\` DROP COLUMN \`price_range\`;`)
}
