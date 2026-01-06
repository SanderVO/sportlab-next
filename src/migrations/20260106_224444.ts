import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`DROP TABLE \`forms_blocks_country\`;`);
    await db.run(sql`DROP TABLE \`forms_blocks_state\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_type\`;`);
    await db.run(
        sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_background_color\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_type\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_background_color\`;`
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`CREATE TABLE \`forms_blocks_country\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`forms_blocks_country_order_idx\` ON \`forms_blocks_country\` (\`_order\`);`
    );
    await db.run(
        sql`CREATE INDEX \`forms_blocks_country_parent_id_idx\` ON \`forms_blocks_country\` (\`_parent_id\`);`
    );
    await db.run(
        sql`CREATE INDEX \`forms_blocks_country_path_idx\` ON \`forms_blocks_country\` (\`_path\`);`
    );
    await db.run(sql`CREATE TABLE \`forms_blocks_state\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`forms_blocks_state_order_idx\` ON \`forms_blocks_state\` (\`_order\`);`
    );
    await db.run(
        sql`CREATE INDEX \`forms_blocks_state_parent_id_idx\` ON \`forms_blocks_state\` (\`_parent_id\`);`
    );
    await db.run(
        sql`CREATE INDEX \`forms_blocks_state_path_idx\` ON \`forms_blocks_state\` (\`_path\`);`
    );
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`hero_type\` text DEFAULT 'background';`
    );
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`hero_background_color\` text DEFAULT 'black';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_type\` text DEFAULT 'background';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_background_color\` text DEFAULT 'black';`
    );
}
