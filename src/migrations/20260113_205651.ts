import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`CREATE TABLE \`footer_social_media_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`footer_social_media_links_order_idx\` ON \`footer_social_media_links\` (\`_order\`);`
    );
    await db.run(
        sql`CREATE INDEX \`footer_social_media_links_parent_id_idx\` ON \`footer_social_media_links\` (\`_parent_id\`);`
    );
    await db.run(sql`CREATE TABLE \`whats_app\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`phone_number\` text NOT NULL,
  	\`text_pre_filled\` text NOT NULL,
  	\`button_text\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `);
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram\` ADD \`content\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram\` DROP COLUMN \`subtitle\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram\` ADD \`content\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram\` DROP COLUMN \`subtitle\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`title\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`enable_link\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`link_type\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`link_new_tab\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`link_url\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`link_label\`;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` DROP COLUMN \`link_appearance\`;`
    );
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_title\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_color\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_enable_link\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_link_type\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_link_new_tab\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_link_url\`;`);
    await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_link_label\`;`);
    await db.run(
        sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_link_appearance\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`title\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`enable_link\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`link_type\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`link_new_tab\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`link_url\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`link_label\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` DROP COLUMN \`link_appearance\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_title\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_color\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_enable_link\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_link_type\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_link_new_tab\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_link_url\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_link_label\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_link_appearance\`;`
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`DROP TABLE \`footer_social_media_links\`;`);
    await db.run(sql`DROP TABLE \`whats_app\`;`);
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`title\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`enable_link\` integer;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`link_type\` text DEFAULT 'reference';`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`link_new_tab\` integer;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`link_url\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`link_label\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_content_columns\` ADD \`link_appearance\` text DEFAULT 'black';`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram\` ADD \`subtitle\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram\` DROP COLUMN \`content\`;`
    );
    await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_title\` text;`);
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`hero_color\` text DEFAULT 'black';`
    );
    await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_enable_link\` integer;`);
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`hero_link_type\` text DEFAULT 'reference';`
    );
    await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_link_new_tab\` integer;`);
    await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_link_url\` text;`);
    await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_link_label\` text;`);
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`hero_link_appearance\` text DEFAULT 'black';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`title\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`enable_link\` integer;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`link_type\` text DEFAULT 'reference';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`link_new_tab\` integer;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`link_url\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`link_label\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_content_columns\` ADD \`link_appearance\` text DEFAULT 'black';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram\` ADD \`subtitle\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram\` DROP COLUMN \`content\`;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_title\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_color\` text DEFAULT 'black';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_enable_link\` integer;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_link_type\` text DEFAULT 'reference';`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_link_new_tab\` integer;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_link_url\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_link_label\` text;`
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_link_appearance\` text DEFAULT 'black';`
    );
}
