import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(
        sql`ALTER TABLE \`pages_rels\` ADD \`users_id\` integer REFERENCES users(id);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_rels_users_id_idx\` ON \`pages_rels\` (\`users_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`_pages_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_rels_users_id_idx\` ON \`_pages_v_rels\` (\`users_id\`);`,
    );
    await db.run(
        sql`ALTER TABLE \`header_rels\` ADD \`users_id\` integer REFERENCES users(id);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_rels_users_id_idx\` ON \`header_rels\` (\`users_id\`);`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`PRAGMA foreign_keys=OFF;`);
    await db.run(sql`CREATE TABLE \`__new_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_pages_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id" FROM \`pages_rels\`;`,
    );
    await db.run(sql`DROP TABLE \`pages_rels\`;`);
    await db.run(
        sql`ALTER TABLE \`__new_pages_rels\` RENAME TO \`pages_rels\`;`,
    );
    await db.run(sql`PRAGMA foreign_keys=ON;`);
    await db.run(
        sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`pages_rels_posts_id_idx\` ON \`pages_rels\` (\`posts_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new__pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new__pages_v_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id" FROM \`_pages_v_rels\`;`,
    );
    await db.run(sql`DROP TABLE \`_pages_v_rels\`;`);
    await db.run(
        sql`ALTER TABLE \`__new__pages_v_rels\` RENAME TO \`_pages_v_rels\`;`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_rels_posts_id_idx\` ON \`_pages_v_rels\` (\`posts_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`__new_header_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`INSERT INTO \`__new_header_rels\`("id", "order", "parent_id", "path", "pages_id", "posts_id") SELECT "id", "order", "parent_id", "path", "pages_id", "posts_id" FROM \`header_rels\`;`,
    );
    await db.run(sql`DROP TABLE \`header_rels\`;`);
    await db.run(
        sql`ALTER TABLE \`__new_header_rels\` RENAME TO \`header_rels\`;`,
    );
    await db.run(
        sql`CREATE INDEX \`header_rels_order_idx\` ON \`header_rels\` (\`order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_rels_parent_idx\` ON \`header_rels\` (\`parent_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_rels_path_idx\` ON \`header_rels\` (\`path\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_rels_pages_id_idx\` ON \`header_rels\` (\`pages_id\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`header_rels_posts_id_idx\` ON \`header_rels\` (\`posts_id\`);`,
    );
}
