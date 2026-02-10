import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`CREATE TABLE \`footer_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_add_label\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`footer_footer_columns_links_order_idx\` ON \`footer_footer_columns_links\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_footer_columns_links_parent_id_idx\` ON \`footer_footer_columns_links\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`footer_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`column_title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`footer_footer_columns_order_idx\` ON \`footer_footer_columns\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_footer_columns_parent_id_idx\` ON \`footer_footer_columns\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`footer_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`footer_rels_order_idx\` ON \`footer_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_rels_parent_idx\` ON \`footer_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_rels_path_idx\` ON \`footer_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_rels_pages_id_idx\` ON \`footer_rels\` (\`pages_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_rels_posts_id_idx\` ON \`footer_rels\` (\`posts_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`footer_rels_users_id_idx\` ON \`footer_rels\` (\`users_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`footer\` ADD \`link_type\` text DEFAULT 'reference';`,
    );
    await db.run(sql`ALTER TABLE \`footer\` ADD \`link_new_tab\` integer;`);
    await db.run(sql`ALTER TABLE \`footer\` ADD \`link_add_label\` integer;`);
    await db.run(sql`ALTER TABLE \`footer\` ADD \`link_url\` text;`);
    await db.run(sql`ALTER TABLE \`footer\` ADD \`link_label\` text;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`DROP TABLE \`footer_footer_columns_links\`;`);
    await db.run(sql`DROP TABLE \`footer_footer_columns\`;`);
    await db.run(sql`DROP TABLE \`footer_rels\`;`);
    await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`link_type\`;`);
    await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`link_new_tab\`;`);
    await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`link_add_label\`;`);
    await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`link_url\`;`);
    await db.run(sql`ALTER TABLE \`footer\` DROP COLUMN \`link_label\`;`);
}
