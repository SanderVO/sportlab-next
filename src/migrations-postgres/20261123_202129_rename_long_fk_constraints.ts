import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_pages_v_blocks_media_carousel_gallery_images" DROP CONSTRAINT "_pages_v_blocks_media_carousel_gallery_images_media_id_media_id_fk";
  
  ALTER TABLE "subscription_plans" DROP CONSTRAINT "subscription_plans_current_price_id_subscription_plan_prices_id_fk";
  
  ALTER TABLE "_pages_v_blocks_media_carousel_gallery_images" ADD CONSTRAINT "_pages_v_blocks_media_carousel_gallery_images_media_54e6446c_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_current_price_id_subscription_pl_03eb5230_fk" FOREIGN KEY ("current_price_id") REFERENCES "public"."subscription_plan_prices"("id") ON DELETE set null ON UPDATE no action;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_pages_v_blocks_media_carousel_gallery_images" DROP CONSTRAINT "_pages_v_blocks_media_carousel_gallery_images_media_54e6446c_fk";
  
  ALTER TABLE "subscription_plans" DROP CONSTRAINT "subscription_plans_current_price_id_subscription_pl_03eb5230_fk";
  
  ALTER TABLE "_pages_v_blocks_media_carousel_gallery_images" ADD CONSTRAINT "_pages_v_blocks_media_carousel_gallery_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_current_price_id_subscription_plan_prices_id_fk" FOREIGN KEY ("current_price_id") REFERENCES "public"."subscription_plan_prices"("id") ON DELETE set null ON UPDATE no action;`)
}
