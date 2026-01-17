import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`pages_blocks_carousel_carousel_items\` ADD \`google_url\` text;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_carousel_carousel_items\` ADD \`google_url\` text;`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`pages_blocks_carousel_carousel_items\` DROP COLUMN \`google_url\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_blocks_carousel_carousel_items\` DROP COLUMN \`google_url\`;`,
    );
}
