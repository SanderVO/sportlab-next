import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'user', 'coach');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_media_object_position_desktop" AS ENUM('center', 'top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_media_object_position_mobile" AS ENUM('center', 'top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_content_position" AS ENUM('contentOnly', 'contentBottom', 'contentRight', 'contentLeft');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_image_size" AS ENUM('imageTopCut', 'imageFull', 'imageCenter');
  CREATE TYPE "public"."enum_pages_blocks_content_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_blocks_content_block_height" AS ENUM('fixed', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_carousel_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_blocks_team_sort_by" AS ENUM('name', '-name', '-createdAt', 'createdAt', 'position');
  CREATE TYPE "public"."enum_pages_blocks_team_type" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_team_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_blocks_team_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_team_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum_pages_blocks_instagram_images_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_instagram_images_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum_pages_blocks_instagram_type" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_instagram_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_blocks_cycle_timeline_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_blocks_media_carousel_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum_pages_hero_content_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_content_position" AS ENUM('contentOnly', 'contentBottom', 'contentRight', 'contentLeft');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_image_size" AS ENUM('imageTopCut', 'imageFull', 'imageCenter');
  CREATE TYPE "public"."enum__pages_v_blocks_content_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_blocks_content_block_height" AS ENUM('fixed', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_blocks_team_sort_by" AS ENUM('name', '-name', '-createdAt', 'createdAt', 'position');
  CREATE TYPE "public"."enum__pages_v_blocks_team_type" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_team_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_blocks_team_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_team_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_instagram_images_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_instagram_images_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum__pages_v_blocks_instagram_type" AS ENUM('carousel', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_instagram_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_blocks_cycle_timeline_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_blocks_media_carousel_background_color" AS ENUM('backgroundDark', 'backgroundLight', 'backgroundWhite');
  CREATE TYPE "public"."enum__pages_v_version_hero_content_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lessons_type" AS ENUM('pt', 'semi_pt', 'group', 'open_gym');
  CREATE TYPE "public"."enum_lessons_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_lesson_templates_schedule_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_lesson_templates_type" AS ENUM('pt', 'semi_pt', 'group', 'open_gym');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('running', 'hyrox', 'special');
  CREATE TYPE "public"."enum_lesson_enrollments_status" AS ENUM('assigned', 'started', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_program_enrollments_status" AS ENUM('enrolled', 'active', 'completed', 'dropped');
  CREATE TYPE "public"."enum_event_registrations_status" AS ENUM('registered', 'waitlist', 'cancelled', 'attended');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum_footer_social_media_links_platform" AS ENUM('facebook', 'twitter', 'instagram', 'youtube', 'tiktok');
  CREATE TYPE "public"."enum_footer_footer_columns_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_footer_columns_links_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum_footer_footer_columns_content_type" AS ENUM('links', 'richText');
  CREATE TYPE "public"."enum_footer_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_link_label_color" AS ENUM('default', 'beige', 'orange', 'neutral', 'white');
  CREATE TYPE "public"."enum_organization_opening_hours_day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"status" "enum_users_status" DEFAULT 'active' NOT NULL,
  	"is_coach" boolean DEFAULT false,
  	"avatar_id" integer,
  	"subtitle" varchar,
  	"about" varchar,
  	"position" numeric,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"object_position_desktop" "enum_media_object_position_desktop" DEFAULT 'top',
  	"object_position_mobile" "enum_media_object_position_mobile" DEFAULT 'center',
  	"poster_id" integer,
  	"prefix" varchar DEFAULT 'images/',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'documents/',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" "enum_pages_blocks_content_columns_background_color",
  	"content_position" "enum_pages_blocks_content_columns_content_position" DEFAULT 'contentRight',
  	"media_id" integer,
  	"image_size" "enum_pages_blocks_content_columns_image_size" DEFAULT 'imageCenter',
  	"rich_text" jsonb
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" "enum_pages_blocks_content_background_color" DEFAULT 'backgroundDark',
  	"block_height" "enum_pages_blocks_content_block_height" DEFAULT 'fixed',
  	"title" varchar,
  	"introduction" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_carousel_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"text" varchar,
  	"name" varchar,
  	"google_url" varchar
  );
  
  CREATE TABLE "pages_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"background_color" "enum_pages_blocks_carousel_background_color" DEFAULT 'backgroundDark',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"limit" numeric DEFAULT 0,
  	"sort_by" "enum_pages_blocks_team_sort_by" DEFAULT 'name',
  	"type" "enum_pages_blocks_team_type" DEFAULT 'carousel',
  	"background_color" "enum_pages_blocks_team_background_color" DEFAULT 'backgroundDark',
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_team_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum_pages_blocks_team_link_label_color" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_instagram_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_instagram_images_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum_pages_blocks_instagram_images_link_label_color" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"type" "enum_pages_blocks_instagram_type" DEFAULT 'carousel',
  	"background_color" "enum_pages_blocks_instagram_background_color" DEFAULT 'backgroundDark',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cycle_timeline_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"week_label" varchar,
  	"phase_title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_cycle_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" "enum_pages_blocks_cycle_timeline_background_color" DEFAULT 'backgroundDark',
  	"title" varchar,
  	"subtitle" varchar,
  	"footer_text" varchar,
  	"footer_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_carousel_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_media_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" "enum_pages_blocks_media_carousel_background_color" DEFAULT 'backgroundLight',
  	"title" varchar,
  	"main_media_id" integer,
  	"quote_text" varchar,
  	"quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_meta_rich_snippets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"json_ld" jsonb
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"title" varchar,
  	"has_hero" boolean DEFAULT false,
  	"hero_media_id" integer,
  	"hero_text" jsonb,
  	"hero_content_position" "enum_pages_hero_content_position" DEFAULT 'left',
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" "enum__pages_v_blocks_content_columns_background_color",
  	"content_position" "enum__pages_v_blocks_content_columns_content_position" DEFAULT 'contentRight',
  	"media_id" integer,
  	"image_size" "enum__pages_v_blocks_content_columns_image_size" DEFAULT 'imageCenter',
  	"rich_text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" "enum__pages_v_blocks_content_background_color" DEFAULT 'backgroundDark',
  	"block_height" "enum__pages_v_blocks_content_block_height" DEFAULT 'fixed',
  	"title" varchar,
  	"introduction" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_carousel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"text" varchar,
  	"name" varchar,
  	"google_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"background_color" "enum__pages_v_blocks_carousel_background_color" DEFAULT 'backgroundDark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"limit" numeric DEFAULT 0,
  	"sort_by" "enum__pages_v_blocks_team_sort_by" DEFAULT 'name',
  	"type" "enum__pages_v_blocks_team_type" DEFAULT 'carousel',
  	"background_color" "enum__pages_v_blocks_team_background_color" DEFAULT 'backgroundDark',
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_team_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum__pages_v_blocks_team_link_label_color" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_instagram_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_instagram_images_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum__pages_v_blocks_instagram_images_link_label_color" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"type" "enum__pages_v_blocks_instagram_type" DEFAULT 'carousel',
  	"background_color" "enum__pages_v_blocks_instagram_background_color" DEFAULT 'backgroundDark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cycle_timeline_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"week_label" varchar,
  	"phase_title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cycle_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" "enum__pages_v_blocks_cycle_timeline_background_color" DEFAULT 'backgroundDark',
  	"title" varchar,
  	"subtitle" varchar,
  	"footer_text" varchar,
  	"footer_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_carousel_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" "enum__pages_v_blocks_media_carousel_background_color" DEFAULT 'backgroundLight',
  	"title" varchar,
  	"main_media_id" integer,
  	"quote_text" varchar,
  	"quote_author" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_meta_rich_snippets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"json_ld" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_parent_id" integer,
  	"version_title" varchar,
  	"version_has_hero" boolean DEFAULT false,
  	"version_hero_media_id" integer,
  	"version_hero_text" jsonb,
  	"version_hero_content_position" "enum__pages_v_version_hero_content_position" DEFAULT 'left',
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"thumbnail_image_id" integer,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_thumbnail_image_id" integer,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "lessons_workout_blocks_exercises" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "lessons_workout_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"duration" numeric NOT NULL
  );
  
  CREATE TABLE "lessons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_id" integer,
  	"title" varchar,
  	"type" "enum_lessons_type",
  	"status" "enum_lessons_status" DEFAULT 'closed',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"spots" numeric,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lessons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "lesson_templates_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_of_week" "enum_lesson_templates_schedule_day_of_week" NOT NULL,
  	"time" timestamp(3) with time zone,
  	"end_time" timestamp(3) with time zone
  );
  
  CREATE TABLE "lesson_templates_default_workout_blocks_exercises" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "lesson_templates_default_workout_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"duration" numeric
  );
  
  CREATE TABLE "lesson_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"type" "enum_lesson_templates_type" NOT NULL,
  	"spots" numeric,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lesson_templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"event_type" "enum_events_event_type" NOT NULL,
  	"banner_image_id" integer,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"ends_at" timestamp(3) with time zone,
  	"location" varchar,
  	"capacity" numeric,
  	"signup_open_at" timestamp(3) with time zone,
  	"signup_close_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programs_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"lessons_id" integer NOT NULL
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"banner_image_id" integer NOT NULL,
  	"description" jsonb NOT NULL,
  	"final_event_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lesson_enrollments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"lesson_id" integer NOT NULL,
  	"status" "enum_lesson_enrollments_status" DEFAULT 'assigned' NOT NULL,
  	"added_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lesson_exercise_tracking_workout_blocks_exercises" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lesson_exercise_id" varchar NOT NULL,
  	"exercise_name" varchar NOT NULL,
  	"exercise_description" varchar,
  	"sets" numeric,
  	"reps" varchar,
  	"notes" varchar,
  	"completed" boolean DEFAULT false
  );
  
  CREATE TABLE "lesson_exercise_tracking_workout_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lesson_block_id" varchar NOT NULL,
  	"workout_name" varchar NOT NULL,
  	"workout_description" varchar,
  	"duration" numeric
  );
  
  CREATE TABLE "lesson_exercise_tracking" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"lesson_id" integer NOT NULL,
  	"last_logged_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "program_enrollments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"program_id" integer NOT NULL,
  	"status" "enum_program_enrollments_status" DEFAULT 'enrolled' NOT NULL,
  	"added_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"event_id" integer NOT NULL,
  	"status" "enum_event_registrations_status" DEFAULT 'registered' NOT NULL,
  	"added_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"pages_id" integer,
  	"posts_id" integer,
  	"lessons_id" integer,
  	"lesson_templates_id" integer,
  	"events_id" integer,
  	"programs_id" integer,
  	"lesson_enrollments_id" integer,
  	"lesson_exercise_tracking_id" integer,
  	"program_enrollments_id" integer,
  	"event_registrations_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"initially_visible" boolean DEFAULT true,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum_header_nav_items_link_label_color" DEFAULT 'default'
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "footer_social_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_media_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_footer_columns_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum_footer_footer_columns_links_link_label_color" DEFAULT 'default'
  );
  
  CREATE TABLE "footer_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"column_title" varchar NOT NULL,
  	"content_type" "enum_footer_footer_columns_content_type" DEFAULT 'links' NOT NULL,
  	"rich_text" jsonb
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"link_type" "enum_footer_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_add_label" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_label_color" "enum_footer_link_label_color" DEFAULT 'default',
  	"footer_logo_id" integer NOT NULL,
  	"contact_text" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "whats_app" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"text_pre_filled" varchar NOT NULL,
  	"button_text" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "organization_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "organization_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_of_week" "enum_organization_opening_hours_day_of_week" NOT NULL,
  	"opens" varchar NOT NULL,
  	"closes" varchar NOT NULL
  );
  
  CREATE TABLE "organization_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "organization" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"logo_id" integer,
  	"email" varchar,
  	"description" varchar,
  	"contact_point_telephone" varchar,
  	"contact_point_contact_type" varchar,
  	"address_street_address" varchar,
  	"address_address_locality" varchar,
  	"address_postal_code" varchar,
  	"address_address_country" varchar DEFAULT 'NL',
  	"geo_latitude" numeric,
  	"geo_longitude" numeric,
  	"price_range" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_carousel_items" ADD CONSTRAINT "pages_blocks_carousel_carousel_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_carousel_items" ADD CONSTRAINT "pages_blocks_carousel_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel" ADD CONSTRAINT "pages_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_instagram_images" ADD CONSTRAINT "pages_blocks_instagram_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_instagram_images" ADD CONSTRAINT "pages_blocks_instagram_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_instagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_instagram" ADD CONSTRAINT "pages_blocks_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cycle_timeline_stages" ADD CONSTRAINT "pages_blocks_cycle_timeline_stages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cycle_timeline_stages" ADD CONSTRAINT "pages_blocks_cycle_timeline_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cycle_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cycle_timeline" ADD CONSTRAINT "pages_blocks_cycle_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_carousel_gallery_images" ADD CONSTRAINT "pages_blocks_media_carousel_gallery_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_carousel_gallery_images" ADD CONSTRAINT "pages_blocks_media_carousel_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_carousel" ADD CONSTRAINT "pages_blocks_media_carousel_main_media_id_media_id_fk" FOREIGN KEY ("main_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_carousel" ADD CONSTRAINT "pages_blocks_media_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_meta_rich_snippets" ADD CONSTRAINT "pages_meta_rich_snippets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_carousel_items" ADD CONSTRAINT "_pages_v_blocks_carousel_carousel_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_carousel_items" ADD CONSTRAINT "_pages_v_blocks_carousel_carousel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel" ADD CONSTRAINT "_pages_v_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_instagram_images" ADD CONSTRAINT "_pages_v_blocks_instagram_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_instagram_images" ADD CONSTRAINT "_pages_v_blocks_instagram_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_instagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_instagram" ADD CONSTRAINT "_pages_v_blocks_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cycle_timeline_stages" ADD CONSTRAINT "_pages_v_blocks_cycle_timeline_stages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cycle_timeline_stages" ADD CONSTRAINT "_pages_v_blocks_cycle_timeline_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cycle_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cycle_timeline" ADD CONSTRAINT "_pages_v_blocks_cycle_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_carousel_gallery_images" ADD CONSTRAINT "_pages_v_blocks_media_carousel_gallery_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_carousel_gallery_images" ADD CONSTRAINT "_pages_v_blocks_media_carousel_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_carousel" ADD CONSTRAINT "_pages_v_blocks_media_carousel_main_media_id_media_id_fk" FOREIGN KEY ("main_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_carousel" ADD CONSTRAINT "_pages_v_blocks_media_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_meta_rich_snippets" ADD CONSTRAINT "_pages_v_version_meta_rich_snippets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_thumbnail_image_id_media_id_fk" FOREIGN KEY ("thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_thumbnail_image_id_media_id_fk" FOREIGN KEY ("version_thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_workout_blocks_exercises" ADD CONSTRAINT "lessons_workout_blocks_exercises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_workout_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_workout_blocks" ADD CONSTRAINT "lessons_workout_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_template_id_lesson_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."lesson_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons_rels" ADD CONSTRAINT "lessons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_rels" ADD CONSTRAINT "lessons_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_templates_schedule" ADD CONSTRAINT "lesson_templates_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lesson_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_templates_default_workout_blocks_exercises" ADD CONSTRAINT "lesson_templates_default_workout_blocks_exercises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lesson_templates_default_workout_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_templates_default_workout_blocks" ADD CONSTRAINT "lesson_templates_default_workout_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lesson_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_templates" ADD CONSTRAINT "lesson_templates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_templates_rels" ADD CONSTRAINT "lesson_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lesson_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_templates_rels" ADD CONSTRAINT "lesson_templates_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_schedule" ADD CONSTRAINT "programs_schedule_lessons_id_lessons_id_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_schedule" ADD CONSTRAINT "programs_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_final_event_id_events_id_fk" FOREIGN KEY ("final_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_enrollments" ADD CONSTRAINT "lesson_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_enrollments" ADD CONSTRAINT "lesson_enrollments_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_enrollments" ADD CONSTRAINT "lesson_enrollments_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_exercise_tracking_workout_blocks_exercises" ADD CONSTRAINT "lesson_exercise_tracking_workout_blocks_exercises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lesson_exercise_tracking_workout_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_exercise_tracking_workout_blocks" ADD CONSTRAINT "lesson_exercise_tracking_workout_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lesson_exercise_tracking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lesson_exercise_tracking" ADD CONSTRAINT "lesson_exercise_tracking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_exercise_tracking" ADD CONSTRAINT "lesson_exercise_tracking_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lesson_templates_fk" FOREIGN KEY ("lesson_templates_id") REFERENCES "public"."lesson_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lesson_enrollments_fk" FOREIGN KEY ("lesson_enrollments_id") REFERENCES "public"."lesson_enrollments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lesson_exercise_tracking_fk" FOREIGN KEY ("lesson_exercise_tracking_id") REFERENCES "public"."lesson_exercise_tracking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_enrollments_fk" FOREIGN KEY ("program_enrollments_id") REFERENCES "public"."program_enrollments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_media_links" ADD CONSTRAINT "footer_social_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_footer_columns_links" ADD CONSTRAINT "footer_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_footer_columns" ADD CONSTRAINT "footer_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_same_as" ADD CONSTRAINT "organization_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_opening_hours" ADD CONSTRAINT "organization_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_images" ADD CONSTRAINT "organization_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_images" ADD CONSTRAINT "organization_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization" ADD CONSTRAINT "organization_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_slug_idx" ON "users" USING btree ("slug");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_columns_media_idx" ON "pages_blocks_content_columns" USING btree ("media_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_carousel_carousel_items_order_idx" ON "pages_blocks_carousel_carousel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_carousel_items_parent_id_idx" ON "pages_blocks_carousel_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_carousel_items_media_idx" ON "pages_blocks_carousel_carousel_items" USING btree ("media_id");
  CREATE INDEX "pages_blocks_carousel_order_idx" ON "pages_blocks_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_parent_id_idx" ON "pages_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_path_idx" ON "pages_blocks_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX "pages_blocks_instagram_images_order_idx" ON "pages_blocks_instagram_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_instagram_images_parent_id_idx" ON "pages_blocks_instagram_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_instagram_images_media_idx" ON "pages_blocks_instagram_images" USING btree ("media_id");
  CREATE INDEX "pages_blocks_instagram_order_idx" ON "pages_blocks_instagram" USING btree ("_order");
  CREATE INDEX "pages_blocks_instagram_parent_id_idx" ON "pages_blocks_instagram" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_instagram_path_idx" ON "pages_blocks_instagram" USING btree ("_path");
  CREATE INDEX "pages_blocks_cycle_timeline_stages_order_idx" ON "pages_blocks_cycle_timeline_stages" USING btree ("_order");
  CREATE INDEX "pages_blocks_cycle_timeline_stages_parent_id_idx" ON "pages_blocks_cycle_timeline_stages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cycle_timeline_stages_image_idx" ON "pages_blocks_cycle_timeline_stages" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cycle_timeline_order_idx" ON "pages_blocks_cycle_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_cycle_timeline_parent_id_idx" ON "pages_blocks_cycle_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cycle_timeline_path_idx" ON "pages_blocks_cycle_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_carousel_gallery_images_order_idx" ON "pages_blocks_media_carousel_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_carousel_gallery_images_parent_id_idx" ON "pages_blocks_media_carousel_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_carousel_gallery_images_media_idx" ON "pages_blocks_media_carousel_gallery_images" USING btree ("media_id");
  CREATE INDEX "pages_blocks_media_carousel_order_idx" ON "pages_blocks_media_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_carousel_parent_id_idx" ON "pages_blocks_media_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_carousel_path_idx" ON "pages_blocks_media_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_carousel_main_media_idx" ON "pages_blocks_media_carousel" USING btree ("main_media_id");
  CREATE INDEX "pages_meta_rich_snippets_order_idx" ON "pages_meta_rich_snippets" USING btree ("_order");
  CREATE INDEX "pages_meta_rich_snippets_parent_id_idx" ON "pages_meta_rich_snippets" USING btree ("_parent_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_users_id_idx" ON "pages_rels" USING btree ("users_id");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_columns_media_idx" ON "_pages_v_blocks_content_columns" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_carousel_carousel_items_order_idx" ON "_pages_v_blocks_carousel_carousel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_carousel_items_parent_id_idx" ON "_pages_v_blocks_carousel_carousel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_carousel_items_media_idx" ON "_pages_v_blocks_carousel_carousel_items" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_carousel_order_idx" ON "_pages_v_blocks_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_parent_id_idx" ON "_pages_v_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_path_idx" ON "_pages_v_blocks_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_instagram_images_order_idx" ON "_pages_v_blocks_instagram_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_instagram_images_parent_id_idx" ON "_pages_v_blocks_instagram_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_instagram_images_media_idx" ON "_pages_v_blocks_instagram_images" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_instagram_order_idx" ON "_pages_v_blocks_instagram" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_instagram_parent_id_idx" ON "_pages_v_blocks_instagram" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_instagram_path_idx" ON "_pages_v_blocks_instagram" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cycle_timeline_stages_order_idx" ON "_pages_v_blocks_cycle_timeline_stages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cycle_timeline_stages_parent_id_idx" ON "_pages_v_blocks_cycle_timeline_stages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cycle_timeline_stages_image_idx" ON "_pages_v_blocks_cycle_timeline_stages" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cycle_timeline_order_idx" ON "_pages_v_blocks_cycle_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cycle_timeline_parent_id_idx" ON "_pages_v_blocks_cycle_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cycle_timeline_path_idx" ON "_pages_v_blocks_cycle_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_carousel_gallery_images_order_idx" ON "_pages_v_blocks_media_carousel_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_carousel_gallery_images_parent_id_idx" ON "_pages_v_blocks_media_carousel_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_carousel_gallery_images_media_idx" ON "_pages_v_blocks_media_carousel_gallery_images" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_media_carousel_order_idx" ON "_pages_v_blocks_media_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_carousel_parent_id_idx" ON "_pages_v_blocks_media_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_carousel_path_idx" ON "_pages_v_blocks_media_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_carousel_main_media_idx" ON "_pages_v_blocks_media_carousel" USING btree ("main_media_id");
  CREATE INDEX "_pages_v_version_meta_rich_snippets_order_idx" ON "_pages_v_version_meta_rich_snippets" USING btree ("_order");
  CREATE INDEX "_pages_v_version_meta_rich_snippets_parent_id_idx" ON "_pages_v_version_meta_rich_snippets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_users_id_idx" ON "_pages_v_rels" USING btree ("users_id");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_thumbnail_image_idx" ON "posts" USING btree ("thumbnail_image_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_thumbnail_image_idx" ON "_posts_v" USING btree ("version_thumbnail_image_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "lessons_workout_blocks_exercises_order_idx" ON "lessons_workout_blocks_exercises" USING btree ("_order");
  CREATE INDEX "lessons_workout_blocks_exercises_parent_id_idx" ON "lessons_workout_blocks_exercises" USING btree ("_parent_id");
  CREATE INDEX "lessons_workout_blocks_order_idx" ON "lessons_workout_blocks" USING btree ("_order");
  CREATE INDEX "lessons_workout_blocks_parent_id_idx" ON "lessons_workout_blocks" USING btree ("_parent_id");
  CREATE INDEX "lessons_template_idx" ON "lessons" USING btree ("template_id");
  CREATE INDEX "lessons_start_date_idx" ON "lessons" USING btree ("start_date");
  CREATE INDEX "lessons_image_idx" ON "lessons" USING btree ("image_id");
  CREATE INDEX "lessons_updated_at_idx" ON "lessons" USING btree ("updated_at");
  CREATE INDEX "lessons_created_at_idx" ON "lessons" USING btree ("created_at");
  CREATE INDEX "lessons_rels_order_idx" ON "lessons_rels" USING btree ("order");
  CREATE INDEX "lessons_rels_parent_idx" ON "lessons_rels" USING btree ("parent_id");
  CREATE INDEX "lessons_rels_path_idx" ON "lessons_rels" USING btree ("path");
  CREATE INDEX "lessons_rels_users_id_idx" ON "lessons_rels" USING btree ("users_id");
  CREATE INDEX "lesson_templates_schedule_order_idx" ON "lesson_templates_schedule" USING btree ("_order");
  CREATE INDEX "lesson_templates_schedule_parent_id_idx" ON "lesson_templates_schedule" USING btree ("_parent_id");
  CREATE INDEX "lesson_templates_default_workout_blocks_exercises_order_idx" ON "lesson_templates_default_workout_blocks_exercises" USING btree ("_order");
  CREATE INDEX "lesson_templates_default_workout_blocks_exercises_parent_id_idx" ON "lesson_templates_default_workout_blocks_exercises" USING btree ("_parent_id");
  CREATE INDEX "lesson_templates_default_workout_blocks_order_idx" ON "lesson_templates_default_workout_blocks" USING btree ("_order");
  CREATE INDEX "lesson_templates_default_workout_blocks_parent_id_idx" ON "lesson_templates_default_workout_blocks" USING btree ("_parent_id");
  CREATE INDEX "lesson_templates_image_idx" ON "lesson_templates" USING btree ("image_id");
  CREATE INDEX "lesson_templates_updated_at_idx" ON "lesson_templates" USING btree ("updated_at");
  CREATE INDEX "lesson_templates_created_at_idx" ON "lesson_templates" USING btree ("created_at");
  CREATE INDEX "lesson_templates_rels_order_idx" ON "lesson_templates_rels" USING btree ("order");
  CREATE INDEX "lesson_templates_rels_parent_idx" ON "lesson_templates_rels" USING btree ("parent_id");
  CREATE INDEX "lesson_templates_rels_path_idx" ON "lesson_templates_rels" USING btree ("path");
  CREATE INDEX "lesson_templates_rels_users_id_idx" ON "lesson_templates_rels" USING btree ("users_id");
  CREATE INDEX "events_banner_image_idx" ON "events" USING btree ("banner_image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "programs_schedule_order_idx" ON "programs_schedule" USING btree ("_order");
  CREATE INDEX "programs_schedule_parent_id_idx" ON "programs_schedule" USING btree ("_parent_id");
  CREATE INDEX "programs_schedule_lessons_idx" ON "programs_schedule" USING btree ("lessons_id");
  CREATE INDEX "programs_banner_image_idx" ON "programs" USING btree ("banner_image_id");
  CREATE INDEX "programs_final_event_idx" ON "programs" USING btree ("final_event_id");
  CREATE UNIQUE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "lesson_enrollments_user_idx" ON "lesson_enrollments" USING btree ("user_id");
  CREATE INDEX "lesson_enrollments_lesson_idx" ON "lesson_enrollments" USING btree ("lesson_id");
  CREATE INDEX "lesson_enrollments_added_by_idx" ON "lesson_enrollments" USING btree ("added_by_id");
  CREATE INDEX "lesson_enrollments_updated_at_idx" ON "lesson_enrollments" USING btree ("updated_at");
  CREATE INDEX "lesson_enrollments_created_at_idx" ON "lesson_enrollments" USING btree ("created_at");
  CREATE UNIQUE INDEX "user_lesson_idx" ON "lesson_enrollments" USING btree ("user_id","lesson_id");
  CREATE INDEX "lesson_exercise_tracking_workout_blocks_exercises_order_idx" ON "lesson_exercise_tracking_workout_blocks_exercises" USING btree ("_order");
  CREATE INDEX "lesson_exercise_tracking_workout_blocks_exercises_parent_id_idx" ON "lesson_exercise_tracking_workout_blocks_exercises" USING btree ("_parent_id");
  CREATE INDEX "lesson_exercise_tracking_workout_blocks_order_idx" ON "lesson_exercise_tracking_workout_blocks" USING btree ("_order");
  CREATE INDEX "lesson_exercise_tracking_workout_blocks_parent_id_idx" ON "lesson_exercise_tracking_workout_blocks" USING btree ("_parent_id");
  CREATE INDEX "lesson_exercise_tracking_user_idx" ON "lesson_exercise_tracking" USING btree ("user_id");
  CREATE INDEX "lesson_exercise_tracking_lesson_idx" ON "lesson_exercise_tracking" USING btree ("lesson_id");
  CREATE INDEX "lesson_exercise_tracking_updated_at_idx" ON "lesson_exercise_tracking" USING btree ("updated_at");
  CREATE INDEX "lesson_exercise_tracking_created_at_idx" ON "lesson_exercise_tracking" USING btree ("created_at");
  CREATE UNIQUE INDEX "user_lesson_1_idx" ON "lesson_exercise_tracking" USING btree ("user_id","lesson_id");
  CREATE INDEX "program_enrollments_user_idx" ON "program_enrollments" USING btree ("user_id");
  CREATE INDEX "program_enrollments_program_idx" ON "program_enrollments" USING btree ("program_id");
  CREATE INDEX "program_enrollments_added_by_idx" ON "program_enrollments" USING btree ("added_by_id");
  CREATE INDEX "program_enrollments_updated_at_idx" ON "program_enrollments" USING btree ("updated_at");
  CREATE INDEX "program_enrollments_created_at_idx" ON "program_enrollments" USING btree ("created_at");
  CREATE UNIQUE INDEX "user_program_idx" ON "program_enrollments" USING btree ("user_id","program_id");
  CREATE INDEX "event_registrations_user_idx" ON "event_registrations" USING btree ("user_id");
  CREATE INDEX "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_added_by_idx" ON "event_registrations" USING btree ("added_by_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "event_registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "user_event_idx" ON "event_registrations" USING btree ("user_id","event_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("lessons_id");
  CREATE INDEX "payload_locked_documents_rels_lesson_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("lesson_templates_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_lesson_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("lesson_enrollments_id");
  CREATE INDEX "payload_locked_documents_rels_lesson_exercise_tracking_i_idx" ON "payload_locked_documents_rels" USING btree ("lesson_exercise_tracking_id");
  CREATE INDEX "payload_locked_documents_rels_program_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("program_enrollments_id");
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_header_logo_idx" ON "header" USING btree ("header_logo_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "header_rels_users_id_idx" ON "header_rels" USING btree ("users_id");
  CREATE INDEX "footer_social_media_links_order_idx" ON "footer_social_media_links" USING btree ("_order");
  CREATE INDEX "footer_social_media_links_parent_id_idx" ON "footer_social_media_links" USING btree ("_parent_id");
  CREATE INDEX "footer_footer_columns_links_order_idx" ON "footer_footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_footer_columns_links_parent_id_idx" ON "footer_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_footer_columns_order_idx" ON "footer_footer_columns" USING btree ("_order");
  CREATE INDEX "footer_footer_columns_parent_id_idx" ON "footer_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_footer_logo_idx" ON "footer" USING btree ("footer_logo_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_users_id_idx" ON "footer_rels" USING btree ("users_id");
  CREATE INDEX "organization_same_as_order_idx" ON "organization_same_as" USING btree ("_order");
  CREATE INDEX "organization_same_as_parent_id_idx" ON "organization_same_as" USING btree ("_parent_id");
  CREATE INDEX "organization_opening_hours_order_idx" ON "organization_opening_hours" USING btree ("_order");
  CREATE INDEX "organization_opening_hours_parent_id_idx" ON "organization_opening_hours" USING btree ("_parent_id");
  CREATE INDEX "organization_images_order_idx" ON "organization_images" USING btree ("_order");
  CREATE INDEX "organization_images_parent_id_idx" ON "organization_images" USING btree ("_parent_id");
  CREATE INDEX "organization_images_image_idx" ON "organization_images" USING btree ("image_id");
  CREATE INDEX "organization_logo_idx" ON "organization" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_carousel_carousel_items" CASCADE;
  DROP TABLE "pages_blocks_carousel" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_instagram_images" CASCADE;
  DROP TABLE "pages_blocks_instagram" CASCADE;
  DROP TABLE "pages_blocks_cycle_timeline_stages" CASCADE;
  DROP TABLE "pages_blocks_cycle_timeline" CASCADE;
  DROP TABLE "pages_blocks_media_carousel_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_media_carousel" CASCADE;
  DROP TABLE "pages_meta_rich_snippets" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_carousel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_team" CASCADE;
  DROP TABLE "_pages_v_blocks_instagram_images" CASCADE;
  DROP TABLE "_pages_v_blocks_instagram" CASCADE;
  DROP TABLE "_pages_v_blocks_cycle_timeline_stages" CASCADE;
  DROP TABLE "_pages_v_blocks_cycle_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_media_carousel_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_media_carousel" CASCADE;
  DROP TABLE "_pages_v_version_meta_rich_snippets" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "lessons_workout_blocks_exercises" CASCADE;
  DROP TABLE "lessons_workout_blocks" CASCADE;
  DROP TABLE "lessons" CASCADE;
  DROP TABLE "lessons_rels" CASCADE;
  DROP TABLE "lesson_templates_schedule" CASCADE;
  DROP TABLE "lesson_templates_default_workout_blocks_exercises" CASCADE;
  DROP TABLE "lesson_templates_default_workout_blocks" CASCADE;
  DROP TABLE "lesson_templates" CASCADE;
  DROP TABLE "lesson_templates_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "programs_schedule" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "lesson_enrollments" CASCADE;
  DROP TABLE "lesson_exercise_tracking_workout_blocks_exercises" CASCADE;
  DROP TABLE "lesson_exercise_tracking_workout_blocks" CASCADE;
  DROP TABLE "lesson_exercise_tracking" CASCADE;
  DROP TABLE "program_enrollments" CASCADE;
  DROP TABLE "event_registrations" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_social_media_links" CASCADE;
  DROP TABLE "footer_footer_columns_links" CASCADE;
  DROP TABLE "footer_footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "whats_app" CASCADE;
  DROP TABLE "organization_same_as" CASCADE;
  DROP TABLE "organization_opening_hours" CASCADE;
  DROP TABLE "organization_images" CASCADE;
  DROP TABLE "organization" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_media_object_position_desktop";
  DROP TYPE "public"."enum_media_object_position_mobile";
  DROP TYPE "public"."enum_pages_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_pages_blocks_content_columns_content_position";
  DROP TYPE "public"."enum_pages_blocks_content_columns_image_size";
  DROP TYPE "public"."enum_pages_blocks_content_background_color";
  DROP TYPE "public"."enum_pages_blocks_content_block_height";
  DROP TYPE "public"."enum_pages_blocks_carousel_background_color";
  DROP TYPE "public"."enum_pages_blocks_team_sort_by";
  DROP TYPE "public"."enum_pages_blocks_team_type";
  DROP TYPE "public"."enum_pages_blocks_team_background_color";
  DROP TYPE "public"."enum_pages_blocks_team_link_type";
  DROP TYPE "public"."enum_pages_blocks_team_link_label_color";
  DROP TYPE "public"."enum_pages_blocks_instagram_images_link_type";
  DROP TYPE "public"."enum_pages_blocks_instagram_images_link_label_color";
  DROP TYPE "public"."enum_pages_blocks_instagram_type";
  DROP TYPE "public"."enum_pages_blocks_instagram_background_color";
  DROP TYPE "public"."enum_pages_blocks_cycle_timeline_background_color";
  DROP TYPE "public"."enum_pages_blocks_media_carousel_background_color";
  DROP TYPE "public"."enum_pages_hero_content_position";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_content_position";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_content_block_height";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_team_sort_by";
  DROP TYPE "public"."enum__pages_v_blocks_team_type";
  DROP TYPE "public"."enum__pages_v_blocks_team_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_team_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_team_link_label_color";
  DROP TYPE "public"."enum__pages_v_blocks_instagram_images_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_instagram_images_link_label_color";
  DROP TYPE "public"."enum__pages_v_blocks_instagram_type";
  DROP TYPE "public"."enum__pages_v_blocks_instagram_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_cycle_timeline_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_media_carousel_background_color";
  DROP TYPE "public"."enum__pages_v_version_hero_content_position";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_lessons_type";
  DROP TYPE "public"."enum_lessons_status";
  DROP TYPE "public"."enum_lesson_templates_schedule_day_of_week";
  DROP TYPE "public"."enum_lesson_templates_type";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_lesson_enrollments_status";
  DROP TYPE "public"."enum_program_enrollments_status";
  DROP TYPE "public"."enum_event_registrations_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_nav_items_link_label_color";
  DROP TYPE "public"."enum_footer_social_media_links_platform";
  DROP TYPE "public"."enum_footer_footer_columns_links_link_type";
  DROP TYPE "public"."enum_footer_footer_columns_links_link_label_color";
  DROP TYPE "public"."enum_footer_footer_columns_content_type";
  DROP TYPE "public"."enum_footer_link_type";
  DROP TYPE "public"."enum_footer_link_label_color";
  DROP TYPE "public"."enum_organization_opening_hours_day_of_week";`)
}
