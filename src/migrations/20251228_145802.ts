import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`CREATE TABLE \`pages_blocks_instagram_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'black',
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_instagram\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`pages_blocks_instagram_images_order_idx\` ON \`pages_blocks_instagram_images\` (\`_order\`);`
    );
    await db.run(
        sql`CREATE INDEX \`pages_blocks_instagram_images_parent_id_idx\` ON \`pages_blocks_instagram_images\` (\`_parent_id\`);`
    );
    await db.run(
        sql`CREATE INDEX \`pages_blocks_instagram_images_media_idx\` ON \`pages_blocks_instagram_images\` (\`media_id\`);`
    );
    await db.run(sql`CREATE TABLE \`_pages_v_blocks_instagram_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'black',
  	\`_uuid\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_instagram\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`_pages_v_blocks_instagram_images_order_idx\` ON \`_pages_v_blocks_instagram_images\` (\`_order\`);`
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_blocks_instagram_images_parent_id_idx\` ON \`_pages_v_blocks_instagram_images\` (\`_parent_id\`);`
    );
    await db.run(
        sql`CREATE INDEX \`_pages_v_blocks_instagram_images_media_idx\` ON \`_pages_v_blocks_instagram_images\` (\`media_id\`);`
    );
    await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`focal_x\`;`);
    await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`focal_y\`;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`DROP TABLE \`pages_blocks_instagram_images\`;`);
    await db.run(sql`DROP TABLE \`_pages_v_blocks_instagram_images\`;`);
    await db.run(sql`ALTER TABLE \`media\` ADD \`focal_x\` numeric;`);
    await db.run(sql`ALTER TABLE \`media\` ADD \`focal_y\` numeric;`);
}
