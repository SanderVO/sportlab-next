import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_subscription_plan_prices_interval" AS ENUM('week', 'month', 'year');
  CREATE TYPE "public"."enum_subscriptions_status" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused');
  CREATE TYPE "public"."enum_credit_adjustments_credit_type" AS ENUM('group', 'pt');
  CREATE TYPE "public"."enum_credit_adjustments_source" AS ENUM('manual', 'stripe', 'system');
  CREATE TABLE "subscription_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"group_credits_per_month" numeric DEFAULT 0 NOT NULL,
  	"pt_credits_per_week" numeric DEFAULT 0 NOT NULL,
  	"current_price_id" integer,
  	"stripe_product_id" varchar,
  	"active" boolean DEFAULT true NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscription_plan_prices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"plan_id" integer NOT NULL,
  	"stripe_price_id" varchar,
  	"amount_cents" numeric DEFAULT 0 NOT NULL,
  	"currency" varchar DEFAULT 'eur' NOT NULL,
  	"interval" "enum_subscription_plan_prices_interval" DEFAULT 'month' NOT NULL,
  	"active" boolean DEFAULT true NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"plan_id" integer NOT NULL,
  	"price_id" integer,
  	"status" "enum_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"stripe_subscription_id" varchar,
  	"current_period_start" timestamp(3) with time zone,
  	"current_period_end" timestamp(3) with time zone,
  	"cancel_at_period_end" boolean DEFAULT false,
  	"canceled_at" timestamp(3) with time zone,
  	"trial_ends_at" timestamp(3) with time zone,
  	"started_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "credit_adjustments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"subscription_id" integer,
  	"credit_type" "enum_credit_adjustments_credit_type" NOT NULL,
  	"amount" numeric NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"period_start" timestamp(3) with time zone NOT NULL,
  	"period_end" timestamp(3) with time zone NOT NULL,
  	"source" "enum_credit_adjustments_source" DEFAULT 'manual' NOT NULL,
  	"reason" varchar,
  	"added_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "stripe_customer_id" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscription_plans_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscription_plan_prices_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscriptions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "credit_adjustments_id" integer;
  ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_current_price_id_subscription_plan_prices_id_fk" FOREIGN KEY ("current_price_id") REFERENCES "public"."subscription_plan_prices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscription_plan_prices" ADD CONSTRAINT "subscription_plan_prices_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_price_id_subscription_plan_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."subscription_plan_prices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "credit_adjustments" ADD CONSTRAINT "credit_adjustments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "credit_adjustments" ADD CONSTRAINT "credit_adjustments_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "credit_adjustments" ADD CONSTRAINT "credit_adjustments_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "subscription_plans_current_price_idx" ON "subscription_plans" USING btree ("current_price_id");
  CREATE INDEX "subscription_plans_stripe_product_id_idx" ON "subscription_plans" USING btree ("stripe_product_id");
  CREATE INDEX "subscription_plans_updated_at_idx" ON "subscription_plans" USING btree ("updated_at");
  CREATE INDEX "subscription_plans_created_at_idx" ON "subscription_plans" USING btree ("created_at");
  CREATE INDEX "subscription_plan_prices_plan_idx" ON "subscription_plan_prices" USING btree ("plan_id");
  CREATE UNIQUE INDEX "subscription_plan_prices_stripe_price_id_idx" ON "subscription_plan_prices" USING btree ("stripe_price_id");
  CREATE INDEX "subscription_plan_prices_updated_at_idx" ON "subscription_plan_prices" USING btree ("updated_at");
  CREATE INDEX "subscription_plan_prices_created_at_idx" ON "subscription_plan_prices" USING btree ("created_at");
  CREATE INDEX "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");
  CREATE INDEX "subscriptions_plan_idx" ON "subscriptions" USING btree ("plan_id");
  CREATE INDEX "subscriptions_price_idx" ON "subscriptions" USING btree ("price_id");
  CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions" USING btree ("stripe_subscription_id");
  CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions" USING btree ("current_period_end");
  CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE INDEX "user_status_idx" ON "subscriptions" USING btree ("user_id","status");
  CREATE INDEX "credit_adjustments_user_idx" ON "credit_adjustments" USING btree ("user_id");
  CREATE INDEX "credit_adjustments_subscription_idx" ON "credit_adjustments" USING btree ("subscription_id");
  CREATE INDEX "credit_adjustments_period_start_idx" ON "credit_adjustments" USING btree ("period_start");
  CREATE INDEX "credit_adjustments_added_by_idx" ON "credit_adjustments" USING btree ("added_by_id");
  CREATE INDEX "credit_adjustments_updated_at_idx" ON "credit_adjustments" USING btree ("updated_at");
  CREATE INDEX "credit_adjustments_created_at_idx" ON "credit_adjustments" USING btree ("created_at");
  CREATE INDEX "user_creditType_periodStart_idx" ON "credit_adjustments" USING btree ("user_id","credit_type","period_start");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscription_plans_fk" FOREIGN KEY ("subscription_plans_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscription_plan_prices_fk" FOREIGN KEY ("subscription_plan_prices_id") REFERENCES "public"."subscription_plan_prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_credit_adjustments_fk" FOREIGN KEY ("credit_adjustments_id") REFERENCES "public"."credit_adjustments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_stripe_customer_id_idx" ON "users" USING btree ("stripe_customer_id");
  CREATE INDEX "payload_locked_documents_rels_subscription_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("subscription_plans_id");
  CREATE INDEX "payload_locked_documents_rels_subscription_plan_prices_i_idx" ON "payload_locked_documents_rels" USING btree ("subscription_plan_prices_id");
  CREATE INDEX "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_credit_adjustments_id_idx" ON "payload_locked_documents_rels" USING btree ("credit_adjustments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "subscription_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscription_plan_prices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscriptions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "credit_adjustments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "subscription_plans" CASCADE;
  DROP TABLE "subscription_plan_prices" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "credit_adjustments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscription_plans_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscription_plan_prices_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscriptions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_credit_adjustments_fk";
  
  DROP INDEX "users_stripe_customer_id_idx";
  DROP INDEX "payload_locked_documents_rels_subscription_plans_id_idx";
  DROP INDEX "payload_locked_documents_rels_subscription_plan_prices_i_idx";
  DROP INDEX "payload_locked_documents_rels_subscriptions_id_idx";
  DROP INDEX "payload_locked_documents_rels_credit_adjustments_id_idx";
  ALTER TABLE "users" DROP COLUMN "stripe_customer_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscription_plans_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscription_plan_prices_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscriptions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "credit_adjustments_id";
  DROP TYPE "public"."enum_subscription_plan_prices_interval";
  DROP TYPE "public"."enum_subscriptions_status";
  DROP TYPE "public"."enum_credit_adjustments_credit_type";
  DROP TYPE "public"."enum_credit_adjustments_source";`)
}
