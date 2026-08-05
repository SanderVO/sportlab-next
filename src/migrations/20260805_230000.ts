import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`ALTER TABLE lessons ADD COLUMN start_date text;`);
    await db.run(sql`ALTER TABLE lessons ADD COLUMN end_date text;`);
    await db.run(
        sql`UPDATE lessons SET start_date = date, end_date = date WHERE date IS NOT NULL;`,
    );
    await db.run(
        sql`ALTER TABLE lesson_templates_schedule ADD COLUMN end_time text;`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE lesson_templates_schedule DROP COLUMN end_time;`,
    );
    await db.run(sql`ALTER TABLE lessons DROP COLUMN end_date;`);
    await db.run(sql`ALTER TABLE lessons DROP COLUMN start_date;`);
}
