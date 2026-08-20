import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_cycle_timeline_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`week_label\` text,
  	\`phase_title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cycle_timeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_stages_order_idx\` ON \`pages_blocks_cycle_timeline_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_stages_parent_id_idx\` ON \`pages_blocks_cycle_timeline_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cycle_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`background_color\` text DEFAULT 'backgroundDark',
  	\`title\` text,
  	\`subtitle\` text,
  	\`footer_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_order_idx\` ON \`pages_blocks_cycle_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_parent_id_idx\` ON \`pages_blocks_cycle_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cycle_timeline_path_idx\` ON \`pages_blocks_cycle_timeline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_carousel_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_media_carousel\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_gallery_images_order_idx\` ON \`pages_blocks_media_carousel_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_gallery_images_parent_id_idx\` ON \`pages_blocks_media_carousel_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_gallery_images_media_idx\` ON \`pages_blocks_media_carousel_gallery_images\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_carousel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`background_color\` text DEFAULT 'backgroundLight',
  	\`title\` text,
  	\`main_media_id\` integer,
  	\`quote_text\` text,
  	\`quote_author\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`main_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_order_idx\` ON \`pages_blocks_media_carousel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_parent_id_idx\` ON \`pages_blocks_media_carousel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_path_idx\` ON \`pages_blocks_media_carousel\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_carousel_main_media_idx\` ON \`pages_blocks_media_carousel\` (\`main_media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cycle_timeline_stages\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_stages_order_idx\` ON \`_pages_v_blocks_cycle_timeline_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_stages_parent_id_idx\` ON \`_pages_v_blocks_cycle_timeline_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cycle_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`background_color\` text DEFAULT 'backgroundDark',
  	\`title\` text,
  	\`subtitle\` text,
  	\`footer_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_order_idx\` ON \`_pages_v_blocks_cycle_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_parent_id_idx\` ON \`_pages_v_blocks_cycle_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cycle_timeline_path_idx\` ON \`_pages_v_blocks_cycle_timeline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_carousel_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_media_carousel\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_gallery_images_order_idx\` ON \`_pages_v_blocks_media_carousel_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_gallery_images_parent_id_idx\` ON \`_pages_v_blocks_media_carousel_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_gallery_images_media_idx\` ON \`_pages_v_blocks_media_carousel_gallery_images\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_carousel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`background_color\` text DEFAULT 'backgroundLight',
  	\`title\` text,
  	\`main_media_id\` integer,
  	\`quote_text\` text,
  	\`quote_author\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`main_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_order_idx\` ON \`_pages_v_blocks_media_carousel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_parent_id_idx\` ON \`_pages_v_blocks_media_carousel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_path_idx\` ON \`_pages_v_blocks_media_carousel\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_carousel_main_media_idx\` ON \`_pages_v_blocks_media_carousel\` (\`main_media_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`background_color\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content\` ADD \`introduction\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`background_color\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content\` ADD \`introduction\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cycle_timeline\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_carousel_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_carousel\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cycle_timeline_stages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cycle_timeline\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_carousel_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_carousel\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`background_color\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_content\` DROP COLUMN \`introduction\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`background_color\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_content\` DROP COLUMN \`introduction\`;`)
}
