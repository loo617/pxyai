ALTER TABLE "captchas" RENAME COLUMN "text" TO "captchas_text";--> statement-breakpoint
ALTER TABLE "captchas" ADD COLUMN "captchas_id" varchar(32) NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_captchas_id" ON "captchas" USING btree ("captchas_id");