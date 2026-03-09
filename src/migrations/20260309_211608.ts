import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.run(sql`CREATE TABLE \`organization_same_as\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`organization\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
    await db.run(
        sql`CREATE INDEX \`organization_same_as_order_idx\` ON \`organization_same_as\` (\`_order\`);`,
    );
    await db.run(
        sql`CREATE INDEX \`organization_same_as_parent_id_idx\` ON \`organization_same_as\` (\`_parent_id\`);`,
    );
    await db.run(sql`CREATE TABLE \`organization\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`logo_id\` integer,
  	\`email\` text,
  	\`description\` text,
  	\`contact_point_telephone\` text,
  	\`contact_point_contact_type\` text,
  	\`address_street_address\` text,
  	\`address_address_locality\` text,
  	\`address_postal_code\` text,
  	\`address_address_country\` text DEFAULT 'NL',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
    await db.run(
        sql`CREATE INDEX \`organization_logo_idx\` ON \`organization\` (\`logo_id\`);`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.run(sql`DROP TABLE \`organization_same_as\`;`);
    await db.run(sql`DROP TABLE \`organization\`;`);
}
