import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "health_measurements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"measured_at" timestamp(3) with time zone NOT NULL,
  	"height" numeric,
  	"weight" numeric,
  	"body_fat_percentage" numeric,
  	"muscle_mass" numeric,
  	"visceral_fat" numeric,
  	"bone_mass" numeric,
  	"bmi" numeric,
  	"bmr" numeric,
  	"metabolic_age" numeric,
  	"body_water_percentage" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "health_measurements_id" integer;
  ALTER TABLE "health_measurements" ADD CONSTRAINT "health_measurements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "health_measurements_user_idx" ON "health_measurements" USING btree ("user_id");
  CREATE INDEX "health_measurements_updated_at_idx" ON "health_measurements" USING btree ("updated_at");
  CREATE INDEX "health_measurements_created_at_idx" ON "health_measurements" USING btree ("created_at");
  CREATE INDEX "user_measuredAt_idx" ON "health_measurements" USING btree ("user_id","measured_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_health_measurements_fk" FOREIGN KEY ("health_measurements_id") REFERENCES "public"."health_measurements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_health_measurements_id_idx" ON "payload_locked_documents_rels" USING btree ("health_measurements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "health_measurements" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "health_measurements" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_health_measurements_fk";
  
  DROP INDEX "payload_locked_documents_rels_health_measurements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "health_measurements_id";`)
}
