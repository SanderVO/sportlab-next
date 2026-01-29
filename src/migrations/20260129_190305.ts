import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`PRAGMA foreign_keys=OFF;`);

    // Clean up any temporary tables from previous failed attempts
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header_nav_items\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_media\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_footer\`;`);

    // First, recreate the header and footer tables to remove the NOT NULL constraint on logo_id fields
    // Recreate header table
    await db.run(sql`CREATE TABLE \`__new_header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`header_logo_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`header_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_header\`("id", "header_logo_id", "updated_at", "created_at") SELECT "id", "header_logo_id", "updated_at", "created_at" FROM \`header\`;`,
    );
    await db.run(sql`DROP TABLE \`header\`;`);
    await db.run(sql`ALTER TABLE \`__new_header\` RENAME TO \`header\`;`);
    await db.run(
        sql`CREATE INDEX \`header_logo_idx\` ON \`header\` (\`header_logo_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_updated_at_idx\` ON \`header\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_created_at_idx\` ON \`header\` (\`created_at\`);`,
    );

    // Recreate footer table
    await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`footer_logo_id\` integer,
  	\`contact_text\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`footer_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_footer\`("id", "title", "description", "footer_logo_id", "contact_text", "updated_at", "created_at") SELECT "id", "title", "description", "footer_logo_id", "contact_text", "updated_at", "created_at" FROM \`footer\`;`,
    );
    await db.run(sql`DROP TABLE \`footer\`;`);
    await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`);
    await db.run(
        sql`CREATE INDEX \`footer_logo_idx\` ON \`footer\` (\`footer_logo_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_updated_at_idx\` ON \`footer\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_created_at_idx\` ON \`footer\` (\`created_at\`);`,
    );

    // Now recreate the media table
    await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`poster_id\` integer,
  	\`prefix\` text DEFAULT 'images/',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_media\`("id", "alt", "poster_id", "prefix", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height") SELECT "id", "alt", "poster_id", "prefix", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height" FROM \`media\`;`,
    );
    await db.run(sql`DROP TABLE \`media\`;`);
    await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`);

    await db.run(
        sql`CREATE INDEX \`media_poster_idx\` ON \`media\` (\`poster_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new_header_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_add_label\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_header_nav_items\`("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_add_label", "link_url", "link_label") SELECT "_order", "_parent_id", "id", "link_type", "link_new_tab", "link_add_label", "link_url", "link_label" FROM \`header_nav_items\`;`,
    );
    await db.run(sql`DROP TABLE \`header_nav_items\`;`);
    await db.run(
        sql`ALTER TABLE \`__new_header_nav_items\` RENAME TO \`header_nav_items\`;`,
    );
    await db.run(
        sql`CREATE INDEX \`header_nav_items_order_idx\` ON \`header_nav_items\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_nav_items_parent_id_idx\` ON \`header_nav_items\` (\`_parent_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_team\` ADD \`link_add_label\` integer;`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_team\` DROP COLUMN \`link_appearance\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram_images\` ADD \`link_add_label\` integer;`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram_images\` DROP COLUMN \`link_appearance\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_team\` ADD \`link_add_label\` integer;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_team\` DROP COLUMN \`link_appearance\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram_images\` ADD \`link_add_label\` integer;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram_images\` DROP COLUMN \`link_appearance\`;`,
    );
    await db.run(sql`PRAGMA foreign_keys=ON;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`PRAGMA foreign_keys=OFF;`);

    // Clean up any temporary tables from previous failed attempts
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header_nav_items\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_media\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_footer\`;`);

    // First, recreate the header and footer tables to remove the NOT NULL constraint on logo_id fields
    // Recreate header table
    await db.run(sql`CREATE TABLE \`__new_header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`header_logo_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`header_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_header\`("id", "header_logo_id", "updated_at", "created_at") SELECT "id", "header_logo_id", "updated_at", "created_at" FROM \`header\`;`,
    );
    await db.run(sql`DROP TABLE \`header\`;`);
    await db.run(sql`ALTER TABLE \`__new_header\` RENAME TO \`header\`;`);
    await db.run(
        sql`CREATE INDEX \`header_logo_idx\` ON \`header\` (\`header_logo_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_updated_at_idx\` ON \`header\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_created_at_idx\` ON \`header\` (\`created_at\`);`,
    );

    // Recreate footer table
    await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`footer_logo_id\` integer,
  	\`contact_text\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`footer_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_footer\`("id", "title", "description", "footer_logo_id", "contact_text", "updated_at", "created_at") SELECT "id", "title", "description", "footer_logo_id", "contact_text", "updated_at", "created_at" FROM \`footer\`;`,
    );
    await db.run(sql`DROP TABLE \`footer\`;`);
    await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`);
    await db.run(
        sql`CREATE INDEX \`footer_logo_idx\` ON \`footer\` (\`footer_logo_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_updated_at_idx\` ON \`footer\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_created_at_idx\` ON \`footer\` (\`created_at\`);`,
    );

    // Now recreate the media table
    await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`poster_id\` integer,
  	\`prefix\` text DEFAULT 'images_dev/',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_media\`("id", "alt", "poster_id", "prefix", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height") SELECT "id", "alt", "poster_id", "prefix", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height" FROM \`media\`;`,
    );
    await db.run(sql`DROP TABLE \`media\`;`);
    await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`);

    await db.run(
        sql`CREATE INDEX \`media_poster_idx\` ON \`media\` (\`poster_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new_header_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text NOT NULL,
  	\`link_appearance\` text DEFAULT 'black',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_header_nav_items\`("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance") SELECT "_order", "_parent_id", "id", "link_type", "link_new_tab", "link_url", "link_label", "link_appearance" FROM \`header_nav_items\`;`,
    );
    await db.run(sql`DROP TABLE \`header_nav_items\`;`);
    await db.run(
        sql`ALTER TABLE \`__new_header_nav_items\` RENAME TO \`header_nav_items\`;`,
    );
    await db.run(
        sql`CREATE INDEX \`header_nav_items_order_idx\` ON \`header_nav_items\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_nav_items_parent_id_idx\` ON \`header_nav_items\` (\`_parent_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_team\` ADD \`link_appearance\` text DEFAULT 'black';`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_team\` DROP COLUMN \`link_add_label\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram_images\` ADD \`link_appearance\` text DEFAULT 'black';`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram_images\` DROP COLUMN \`link_add_label\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_team\` ADD \`link_appearance\` text DEFAULT 'black';`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_team\` DROP COLUMN \`link_add_label\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram_images\` ADD \`link_appearance\` text DEFAULT 'black';`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram_images\` DROP COLUMN \`link_add_label\`;`,
    );
    await db.run(sql`PRAGMA foreign_keys=ON;`);
}
