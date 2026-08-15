import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    const runAllowingDuplicate = async (statement: ReturnType<typeof sql>) => {
        try {
            await db.run(statement);
        } catch (error) {
            const err = error as {
                message?: string;
                cause?: { message?: string };
                err?: { message?: string };
            };

            const safeJson = (() => {
                try {
                    return JSON.stringify(error);
                } catch {
                    return "";
                }
            })();

            const message = [
                err?.message,
                err?.cause?.message,
                err?.err?.message,
                safeJson,
                String(error),
            ]
                .filter(Boolean)
                .join(" | ")
                .toLowerCase();

            const isDuplicateColumn =
                message.includes("duplicate column name") ||
                (message.includes("already exists") &&
                    message.includes("column"));

            const isDuplicateIndex =
                (message.includes("already exists") &&
                    message.includes("index")) ||
                message.includes("duplicate index");

            if (!isDuplicateColumn && !isDuplicateIndex) {
                throw error;
            }
        }
    };

    // If a previous run failed mid-migration, clean up partially created tables first.
    await db.run(sql`PRAGMA foreign_keys=OFF;`);
    await db.run(
        sql`DROP TABLE IF EXISTS \`lessons_workout_blocks_exercises\`;`,
    );
    await db.run(sql`DROP TABLE IF EXISTS \`lessons_workout_blocks\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`lessons_rels\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`lessons\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`lesson_templates_schedule\`;`);
    await db.run(
        sql`DROP TABLE IF EXISTS \`lesson_templates_default_workout_blocks_exercises\`;`,
    );
    await db.run(
        sql`DROP TABLE IF EXISTS \`lesson_templates_default_workout_blocks\`;`,
    );
    await db.run(sql`DROP TABLE IF EXISTS \`lesson_templates_rels\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`lesson_templates\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`event_registrations\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`program_enrollments\`;`);
    await db.run(
        sql`DROP TABLE IF EXISTS \`lesson_exercise_tracking_workout_blocks_exercises\`;`,
    );
    await db.run(
        sql`DROP TABLE IF EXISTS \`lesson_exercise_tracking_workout_blocks\`;`,
    );
    await db.run(sql`DROP TABLE IF EXISTS \`lesson_exercise_tracking\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`lesson_enrollments\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`programs_schedule\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`programs\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`events\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_footer\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_media\`;`);
    await db.run(sql`PRAGMA foreign_keys=ON;`);

    await db.run(sql`CREATE TABLE \`lessons_workout_blocks_exercises\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lessons_workout_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lessons_workout_blocks_exercises_order_idx\` ON \`lessons_workout_blocks_exercises\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_workout_blocks_exercises_parent_id_idx\` ON \`lessons_workout_blocks_exercises\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lessons_workout_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`duration\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lessons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lessons_workout_blocks_order_idx\` ON \`lessons_workout_blocks\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_workout_blocks_parent_id_idx\` ON \`lessons_workout_blocks\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lessons\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`template_id\` integer,
	\`title\` text,
	\`type\` text,
	\`status\` text DEFAULT 'closed',
	\`start_date\` text,
	\`end_date\` text,
	\`spots\` numeric,
	\`image_id\` integer,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`template_id\`) REFERENCES \`lesson_templates\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lessons_template_idx\` ON \`lessons\` (\`template_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_image_idx\` ON \`lessons\` (\`image_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_updated_at_idx\` ON \`lessons\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_created_at_idx\` ON \`lessons\` (\`created_at\`);`,
    );
    await db.run(sql`CREATE TABLE \`lessons_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`lessons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lessons_rels_order_idx\` ON \`lessons_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_rels_parent_idx\` ON \`lessons_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_rels_path_idx\` ON \`lessons_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lessons_rels_users_id_idx\` ON \`lessons_rels\` (\`users_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_templates_schedule\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`day_of_week\` text NOT NULL,
	\`time\` text,
	\`end_time\` text,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lesson_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_templates_schedule_order_idx\` ON \`lesson_templates_schedule\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_schedule_parent_id_idx\` ON \`lesson_templates_schedule\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_templates_default_workout_blocks_exercises\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lesson_templates_default_workout_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_templates_default_workout_blocks_exercises_order_idx\` ON \`lesson_templates_default_workout_blocks_exercises\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_default_workout_blocks_exercises_parent_id_idx\` ON \`lesson_templates_default_workout_blocks_exercises\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_templates_default_workout_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`duration\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lesson_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_templates_default_workout_blocks_order_idx\` ON \`lesson_templates_default_workout_blocks\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_default_workout_blocks_parent_id_idx\` ON \`lesson_templates_default_workout_blocks\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_templates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`is_active\` integer DEFAULT true,
  	\`title\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`spots\` numeric,
  	\`image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_templates_image_idx\` ON \`lesson_templates\` (\`image_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_updated_at_idx\` ON \`lesson_templates\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_created_at_idx\` ON \`lesson_templates\` (\`created_at\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_templates_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`lesson_templates\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_templates_rels_order_idx\` ON \`lesson_templates_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_rels_parent_idx\` ON \`lesson_templates_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_rels_path_idx\` ON \`lesson_templates_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_templates_rels_users_id_idx\` ON \`lesson_templates_rels\` (\`users_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`event_type\` text NOT NULL,
  	\`banner_image_id\` integer,
  	\`starts_at\` text NOT NULL,
  	\`ends_at\` text,
  	\`location\` text,
  	\`capacity\` numeric,
  	\`signup_open_at\` text,
  	\`signup_close_at\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`banner_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`events_banner_image_idx\` ON \`events\` (\`banner_image_id\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`,
    );
    await db.run(sql`CREATE TABLE \`programs_schedule\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`lessons_id\` integer NOT NULL,
  	FOREIGN KEY (\`lessons_id\`) REFERENCES \`lessons\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`programs_schedule_order_idx\` ON \`programs_schedule\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`programs_schedule_parent_id_idx\` ON \`programs_schedule\` (\`_parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`programs_schedule_lessons_idx\` ON \`programs_schedule\` (\`lessons_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`programs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`start_date\` text NOT NULL,
  	\`end_date\` text NOT NULL,
  	\`banner_image_id\` integer NOT NULL,
  	\`description\` text NOT NULL,
  	\`final_event_id\` integer,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`banner_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`final_event_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`programs_banner_image_idx\` ON \`programs\` (\`banner_image_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`programs_final_event_idx\` ON \`programs\` (\`final_event_id\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`programs_slug_idx\` ON \`programs\` (\`slug\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`programs_updated_at_idx\` ON \`programs\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`programs_created_at_idx\` ON \`programs\` (\`created_at\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_enrollments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`lesson_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'assigned' NOT NULL,
  	\`added_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`added_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_enrollments_user_idx\` ON \`lesson_enrollments\` (\`user_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_enrollments_lesson_idx\` ON \`lesson_enrollments\` (\`lesson_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_enrollments_added_by_idx\` ON \`lesson_enrollments\` (\`added_by_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_enrollments_updated_at_idx\` ON \`lesson_enrollments\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_enrollments_created_at_idx\` ON \`lesson_enrollments\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`user_lesson_idx\` ON \`lesson_enrollments\` (\`user_id\`,\`lesson_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_exercise_tracking_workout_blocks_exercises\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lesson_exercise_id\` text NOT NULL,
  	\`exercise_name\` text NOT NULL,
  	\`exercise_description\` text,
  	\`sets\` numeric,
  	\`reps\` text,
  	\`notes\` text,
  	\`completed\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lesson_exercise_tracking_workout_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_workout_blocks_exercises_order_idx\` ON \`lesson_exercise_tracking_workout_blocks_exercises\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_workout_blocks_exercises_parent_id_idx\` ON \`lesson_exercise_tracking_workout_blocks_exercises\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_exercise_tracking_workout_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lesson_block_id\` text NOT NULL,
  	\`workout_name\` text NOT NULL,
  	\`workout_description\` text,
  	\`duration\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lesson_exercise_tracking\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_workout_blocks_order_idx\` ON \`lesson_exercise_tracking_workout_blocks\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_workout_blocks_parent_id_idx\` ON \`lesson_exercise_tracking_workout_blocks\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`lesson_exercise_tracking\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`lesson_id\` integer NOT NULL,
  	\`last_logged_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_user_idx\` ON \`lesson_exercise_tracking\` (\`user_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_lesson_idx\` ON \`lesson_exercise_tracking\` (\`lesson_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_updated_at_idx\` ON \`lesson_exercise_tracking\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`lesson_exercise_tracking_created_at_idx\` ON \`lesson_exercise_tracking\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`user_lesson_1_idx\` ON \`lesson_exercise_tracking\` (\`user_id\`,\`lesson_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`program_enrollments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`program_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'enrolled' NOT NULL,
  	\`added_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`program_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`added_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`program_enrollments_user_idx\` ON \`program_enrollments\` (\`user_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`program_enrollments_program_idx\` ON \`program_enrollments\` (\`program_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`program_enrollments_added_by_idx\` ON \`program_enrollments\` (\`added_by_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`program_enrollments_updated_at_idx\` ON \`program_enrollments\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`program_enrollments_created_at_idx\` ON \`program_enrollments\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`user_program_idx\` ON \`program_enrollments\` (\`user_id\`,\`program_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`event_registrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`event_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'registered' NOT NULL,
  	\`added_by_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`added_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`event_registrations_user_idx\` ON \`event_registrations\` (\`user_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`event_registrations_event_idx\` ON \`event_registrations\` (\`event_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`event_registrations_added_by_idx\` ON \`event_registrations\` (\`added_by_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`event_registrations_updated_at_idx\` ON \`event_registrations\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`event_registrations_created_at_idx\` ON \`event_registrations\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`user_event_idx\` ON \`event_registrations\` (\`user_id\`,\`event_id\`);`,
    );
    // Non-destructive: avoid rebuilding media/header/footer because dropping those
    // tables can cascade-delete related rows (header nav items) and null media links.
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_footer\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_media\`;`);

    await runAllowingDuplicate(
        sql`ALTER TABLE \`media\` ADD \`object_position_desktop\` text DEFAULT 'top';`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`media\` ADD \`object_position_mobile\` text DEFAULT 'center';`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`media_poster_idx\` ON \`media\` (\`poster_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`lessons_id\` integer REFERENCES lessons(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`lesson_templates_id\` integer REFERENCES lesson_templates(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`events_id\` integer REFERENCES events(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`programs_id\` integer REFERENCES programs(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`lesson_enrollments_id\` integer REFERENCES lesson_enrollments(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`lesson_exercise_tracking_id\` integer REFERENCES lesson_exercise_tracking(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`program_enrollments_id\` integer REFERENCES program_enrollments(id);`,
    );
    await runAllowingDuplicate(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`event_registrations_id\` integer REFERENCES event_registrations(id);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_lessons_id_idx\` ON \`payload_locked_documents_rels\` (\`lessons_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_lesson_templates_id_idx\` ON \`payload_locked_documents_rels\` (\`lesson_templates_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_programs_id_idx\` ON \`payload_locked_documents_rels\` (\`programs_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_lesson_enrollments_id_idx\` ON \`payload_locked_documents_rels\` (\`lesson_enrollments_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_lesson_exercise_tracking_i_idx\` ON \`payload_locked_documents_rels\` (\`lesson_exercise_tracking_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_program_enrollments_id_idx\` ON \`payload_locked_documents_rels\` (\`program_enrollments_id\`);`,
    );
    await runAllowingDuplicate(
        sql`CREATE INDEX \`payload_locked_documents_rels_event_registrations_id_idx\` ON \`payload_locked_documents_rels\` (\`event_registrations_id\`);`,
    );
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.run(sql`DROP TABLE \`lessons_workout_blocks_exercises\`;`);
    await db.run(sql`DROP TABLE \`lessons_workout_blocks\`;`);
    await db.run(sql`DROP TABLE \`lessons\`;`);
    await db.run(sql`DROP TABLE \`lessons_rels\`;`);
    await db.run(sql`DROP TABLE \`lesson_templates_schedule\`;`);
    await db.run(
        sql`DROP TABLE \`lesson_templates_default_workout_blocks_exercises\`;`,
    );
    await db.run(sql`DROP TABLE \`lesson_templates_default_workout_blocks\`;`);
    await db.run(sql`DROP TABLE \`lesson_templates\`;`);
    await db.run(sql`DROP TABLE \`lesson_templates_rels\`;`);
    await db.run(sql`DROP TABLE \`events\`;`);
    await db.run(sql`DROP TABLE \`programs_schedule\`;`);
    await db.run(sql`DROP TABLE \`programs\`;`);
    await db.run(sql`DROP TABLE \`lesson_enrollments\`;`);
    await db.run(
        sql`DROP TABLE \`lesson_exercise_tracking_workout_blocks_exercises\`;`,
    );
    await db.run(sql`DROP TABLE \`lesson_exercise_tracking_workout_blocks\`;`);
    await db.run(sql`DROP TABLE \`lesson_exercise_tracking\`;`);
    await db.run(sql`DROP TABLE \`program_enrollments\`;`);
    await db.run(sql`DROP TABLE \`event_registrations\`;`);
    await db.run(sql`PRAGMA foreign_keys=OFF;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_header\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_footer\`;`);
    await db.run(sql`DROP TABLE IF EXISTS \`__new_media\`;`);
    await db.run(sql`CREATE TABLE \`__new_header\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`header_logo_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`header_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_header\`("id", "header_logo_id", "updated_at", "created_at") SELECT "id", "header_logo_id", "updated_at", "created_at" FROM \`header\`;`,
    );
    await db.run(sql`DROP TABLE \`header\`;`);
    await db.run(sql`ALTER TABLE \`__new_header\` RENAME TO \`header\`;`);
    await db.run(
        sql`CREATE INDEX \`header_header_logo_idx\` ON \`header\` (\`header_logo_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_add_label\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_label_color\` text DEFAULT 'default',
  	\`footer_logo_id\` integer,
  	\`contact_text\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`footer_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_footer\`("id", "title", "description", "link_type", "link_new_tab", "link_add_label", "link_url", "link_label", "link_label_color", "footer_logo_id", "contact_text", "updated_at", "created_at") SELECT "id", "title", "description", "link_type", "link_new_tab", "link_add_label", "link_url", "link_label", "link_label_color", "footer_logo_id", "contact_text", "updated_at", "created_at" FROM \`footer\`;`,
    );
    await db.run(sql`DROP TABLE \`footer\`;`);
    await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`);
    await db.run(
        sql`CREATE INDEX \`footer_footer_logo_idx\` ON \`footer\` (\`footer_logo_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`documents_id\` integer,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`redirects_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`documents_id\`) REFERENCES \`documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "documents_id", "pages_id", "posts_id", "redirects_id", "forms_id", "form_submissions_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "documents_id", "pages_id", "posts_id", "redirects_id", "forms_id", "form_submissions_id" FROM \`payload_locked_documents_rels\`;`,
    );
    await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
    await db.run(
        sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
    );
    await db.run(sql`PRAGMA foreign_keys=ON;`);
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`documents_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`object_position_desktop\` text DEFAULT 'top',
  	\`object_position_mobile\` text DEFAULT 'center',
  	\`poster_id\` integer,
  	\`prefix\` text DEFAULT 'images/',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_media\`("id", "alt", "object_position_desktop", "object_position_mobile", "poster_id", "prefix", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height") SELECT "id", "alt", "object_position_desktop", "object_position_mobile", "poster_id", "prefix", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height" FROM \`media\`;`,
    );
    await db.run(sql`DROP TABLE \`media\`;`);
    await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`);
    await db.run(
        sql`CREATE INDEX \`media_poster_idx\` ON \`media\` (\`poster_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`,
    );
    await db.run(
        sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`,
    );
}
