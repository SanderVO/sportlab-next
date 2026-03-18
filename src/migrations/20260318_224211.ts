import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`organization\` ADD \`geo_latitude\` numeric;`,
    );
    await db.run(
        sql`ALTER TABLE \`organization\` ADD \`geo_longitude\` numeric;`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`organization\` DROP COLUMN \`geo_latitude\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`organization\` DROP COLUMN \`geo_longitude\`;`,
    );
}
