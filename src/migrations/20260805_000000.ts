import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`CREATE TABLE \`workouts\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`description\` text,
	\`updated_at\` text,
	\`created_at\` text
);
`);
    await db.run(
        sql`CREATE INDEX \`workouts_updated_at_idx\` ON \`workouts\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`workouts_created_at_idx\` ON \`workouts\` (\`created_at\`);`,
    );
    await db.run(sql`CREATE TABLE \`workouts_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`exercises_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`workouts\`(\`id\`) ON DELETE cascade,
	FOREIGN KEY (\`exercises_id\`) REFERENCES \`exercises\`(\`id\`) ON DELETE cascade
);
`);
    await db.run(
        sql`CREATE INDEX \`workouts_rels_order_idx\` ON \`workouts_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`workouts_rels_parent_idx\` ON \`workouts_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`workouts_rels_path_idx\` ON \`workouts_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`workouts_rels_exercises_id_idx\` ON \`workouts_rels\` (\`exercises_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`exercises_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`workouts_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`exercises\`(\`id\`) ON DELETE cascade,
	FOREIGN KEY (\`workouts_id\`) REFERENCES \`workouts\`(\`id\`) ON DELETE cascade
);
`);
    await db.run(
        sql`CREATE INDEX \`exercises_rels_order_idx\` ON \`exercises_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`exercises_rels_parent_idx\` ON \`exercises_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`exercises_rels_path_idx\` ON \`exercises_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`exercises_rels_workouts_id_idx\` ON \`exercises_rels\` (\`workouts_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`lessons_exercises\` ADD \`workout_id\` integer REFERENCES workouts(id) ON DELETE set null;`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_exercises_workout_idx\` ON \`lessons_exercises\` (\`workout_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`lesson_templates_default_exercises\` ADD \`workout_id\` integer REFERENCES workouts(id) ON DELETE set null;`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_default_exercises_workout_idx\` ON \`lesson_templates_default_exercises\` (\`workout_id\`);`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`lesson_templates_default_exercises\` DROP COLUMN \`workout_id\`;`,
    );
    await db.run(
        sql`ALTER TABLE \`lessons_exercises\` DROP COLUMN \`workout_id\`;`,
    );
    await db.run(sql`DROP TABLE \`exercises_rels\`;`);
    await db.run(sql`DROP TABLE \`workouts_rels\`;`);
    await db.run(sql`DROP TABLE \`workouts\`;`);
}