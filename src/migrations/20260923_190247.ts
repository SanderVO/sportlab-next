import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

// D1/SQLite has no `ADD COLUMN IF NOT EXISTS`, so check pragma_table_info first to stay idempotent.
async function columnExists(
    db: MigrateUpArgs["db"],
    table: string,
    column: string,
): Promise<boolean> {
    const rows = (await db.all(
        sql`SELECT 1 FROM pragma_table_info(${table}) WHERE name = ${column}`,
    )) as unknown[];
    return rows.length > 0;
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    if (!(await columnExists(db, "pages_blocks_content", "block_height"))) {
        await db.run(
            sql`ALTER TABLE \`pages_blocks_content\` ADD \`block_height\` text DEFAULT 'fixed';`,
        );
    }
    if (!(await columnExists(db, "_pages_v_blocks_content", "block_height"))) {
        await db.run(
            sql`ALTER TABLE \`_pages_v_blocks_content\` ADD \`block_height\` text DEFAULT 'fixed';`,
        );
    }
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    if (await columnExists(db, "pages_blocks_content", "block_height")) {
        await db.run(
            sql`ALTER TABLE \`pages_blocks_content\` DROP COLUMN \`block_height\`;`,
        );
    }
    if (await columnExists(db, "_pages_v_blocks_content", "block_height")) {
        await db.run(
            sql`ALTER TABLE \`_pages_v_blocks_content\` DROP COLUMN \`block_height\`;`,
        );
    }
}
