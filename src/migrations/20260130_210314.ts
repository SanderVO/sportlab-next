import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`users\` ADD \`generate_slug\` integer DEFAULT true;`,
    );
    await db.run(sql`ALTER TABLE \`users\` ADD \`slug\` text;`);
    await db.run(sql`ALTER TABLE \`users\` ADD \`content\` text;`);
    await db.run(
        sql`CREATE UNIQUE INDEX \`users_slug_idx\` ON \`users\` (\`slug\`);`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`DROP INDEX \`users_slug_idx\`;`);
    await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`generate_slug\`;`);
    await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`slug\`;`);
    await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`content\`;`);
}
