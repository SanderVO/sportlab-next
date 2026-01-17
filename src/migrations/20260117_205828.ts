import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`parent_id\` integer REFERENCES pages(id);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_parent_idx\` ON \`pages\` (\`parent_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_parent_id\` integer REFERENCES pages(id);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_version_parent_idx\` ON \`_pages_v\` (\`version_parent_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`header_nav_items\` ADD \`link_appearance\` text DEFAULT 'black';`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`PRAGMA foreign_keys=OFF;`);
    await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`has_hero\` integer DEFAULT false,
  	\`hero_media_id\` integer,
  	\`hero_text\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`published_at\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_pages\`("id", "title", "has_hero", "hero_media_id", "hero_text", "meta_title", "meta_image_id", "meta_description", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status") SELECT "id", "title", "has_hero", "hero_media_id", "hero_text", "meta_title", "meta_image_id", "meta_description", "published_at", "generate_slug", "slug", "updated_at", "created_at", "_status" FROM \`pages\`;`,
    );
    await db.run(sql`DROP TABLE \`pages\`;`);
    await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`);
    await db.run(sql`PRAGMA foreign_keys=ON;`);
    await db.run(
        sql`CREATE INDEX \`pages_hero_hero_media_idx\` ON \`pages\` (\`hero_media_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new__pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_has_hero\` integer DEFAULT false,
  	\`version_hero_media_id\` integer,
  	\`version_hero_text\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_published_at\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new__pages_v\`("id", "parent_id", "version_title", "version_has_hero", "version_hero_media_id", "version_hero_text", "version_meta_title", "version_meta_image_id", "version_meta_description", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_has_hero", "version_hero_media_id", "version_hero_text", "version_meta_title", "version_meta_image_id", "version_meta_description", "version_published_at", "version_generate_slug", "version_slug", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_pages_v\`;`,
    );
    await db.run(sql`DROP TABLE \`_pages_v\`;`);
    await db.run(sql`ALTER TABLE \`__new__pages_v\` RENAME TO \`_pages_v\`;`);
    await db.run(
        sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_hero_version_hero_media_idx\` ON \`_pages_v\` (\`version_hero_media_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`header_nav_items\` DROP COLUMN \`link_appearance\`;`,
    );
}
