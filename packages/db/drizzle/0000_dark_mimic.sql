-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "provider" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_code" varchar(50) DEFAULT '' NOT NULL,
	"provider_name" varchar(255) DEFAULT '' NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"api_url" varchar(255) DEFAULT '' NOT NULL,
	"api_key" varchar(255) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "provider_provider_code_key" UNIQUE("provider_code")
);
--> statement-breakpoint
CREATE TABLE "model" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_code" varchar(50) DEFAULT '' NOT NULL,
	"model" varchar(50) DEFAULT '' NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"version" varchar(32) DEFAULT '' NOT NULL,
	"context" integer DEFAULT 0 NOT NULL,
	"price_input" numeric(10, 2) DEFAULT '0.00',
	"price_output" numeric(10, 2) DEFAULT '0.00',
	"status" integer DEFAULT 0 NOT NULL,
	"rate_limit" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "open_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_user_id" varchar(32) DEFAULT '' NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "open_user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"open_user_id" varchar(32) DEFAULT '' NOT NULL,
	"key" varchar(255) NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_user_id" varchar(32) DEFAULT '' NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recharge_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_user_id" varchar(32) DEFAULT '' NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"method" varchar(50),
	"status" integer NOT NULL,
	"reference_id" varchar(255),
	"metadata" jsonb,
	"balance_before" bigint NOT NULL,
	"balance_after" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_user_id" varchar(32) DEFAULT '' NOT NULL,
	"provider_code" varchar(50) DEFAULT '' NOT NULL,
	"model" varchar(50) NOT NULL,
	"tokens_input" integer DEFAULT 0,
	"tokens_output" integer DEFAULT 0,
	"token_amount" integer DEFAULT 0 NOT NULL,
	"amount" bigint NOT NULL,
	"reference_id" varchar(255),
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "model_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_user_id" varchar(32) DEFAULT '' NOT NULL,
	"provider_code" varchar(50) DEFAULT '' NOT NULL,
	"model" varchar(50) DEFAULT '' NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"latency_ms" integer DEFAULT 0 NOT NULL,
	"status" integer DEFAULT 0,
	"error_message" text DEFAULT '' NOT NULL,
	"cost" bigint DEFAULT 0 NOT NULL,
	"api_key" varchar(255) DEFAULT '' NOT NULL,
	"ip_address" "inet" DEFAULT '0.0.0.0' NOT NULL,
	"request_start_time" timestamp with time zone,
	"response_complete_time" timestamp with time zone,
	"tokens_per_second" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "admin_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(64) NOT NULL,
	"is_superadmin" boolean DEFAULT false,
	"must_reset_password" boolean DEFAULT true,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"last_login_ip" "inet" DEFAULT '0.0.0.0' NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"login_retries" integer DEFAULT 0,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_user_user_name_key" UNIQUE("user_name"),
	CONSTRAINT "admin_user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_open_user_id" ON "open_user" USING btree ("open_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_api_key_key" ON "api_key" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "idx_api_key_open_user_id" ON "api_key" USING btree ("open_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_balances_open_user_id" ON "user_balances" USING btree ("open_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_recharge_records_open_user_id" ON "recharge_records" USING btree ("open_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_usage_records_open_user_id" ON "usage_records" USING btree ("open_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_model_logs_model" ON "model_logs" USING btree ("model" text_ops);--> statement-breakpoint
CREATE INDEX "idx_model_logs_open_user_id" ON "model_logs" USING btree ("open_user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_model_logs_provider_code" ON "model_logs" USING btree ("provider_code" text_ops);
*/