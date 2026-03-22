import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`pages_blocks_team\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram_images\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
    await db.run(
        sql`ALTER TABLE \`pages\` ADD \`hero_content_position\` text DEFAULT 'left';`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_team\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram_images\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` ADD \`version_hero_content_position\` text DEFAULT 'left';`,
    );
    await db.run(
        sql`ALTER TABLE \`header_nav_items\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
    await db.run(
        sql`ALTER TABLE \`footer_footer_columns_links\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
    await db.run(
        sql`ALTER TABLE \`footer_footer_columns\` ADD \`content_type\` text DEFAULT 'links' NOT NULL;`,
    );
    await db.run(
        sql`ALTER TABLE \`footer_footer_columns\` ADD \`rich_text\` text;`,
    );
    await db.run(
        sql`ALTER TABLE \`footer\` ADD \`link_label_color\` text DEFAULT 'default';`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`pages_blocks_team\` DROP COLUMN \`link_label_color\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`pages_blocks_instagram_images\` DROP COLUMN \`link_label_color\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`pages\` DROP COLUMN \`hero_content_position\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_team\` DROP COLUMN \`link_label_color\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_instagram_images\` DROP COLUMN \`link_label_color\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hero_content_position\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`header_nav_items\` DROP COLUMN \`link_label_color\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`footer_footer_columns_links\` DROP COLUMN \`link_label_color\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`footer_footer_columns\` DROP COLUMN \`content_type\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`footer_footer_columns\` DROP COLUMN \`rich_text\`;`,
    );
    await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`link_label_color\`;`);
}
