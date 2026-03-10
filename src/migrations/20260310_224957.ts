import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`media\` ADD \`object_position_desktop\` text DEFAULT 'top';`,
    );
    await db.run(
        sql`ALTER TABLE \`media\` ADD \`object_position_mobile\` text DEFAULT 'center';`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`media\` DROP COLUMN \`object_position_desktop\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`media\` DROP COLUMN \`object_position_mobile\`;`,
    );
}
